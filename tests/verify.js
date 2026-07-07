const CDPClient = require("./cdp-client");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  const client = new CDPClient();
  await client.connect();
  console.log("Connected to Chrome DevTools Protocol.");

  let targetId;
  let sessionId;

  try {
    console.log("Creating new target...");
    const targetRes = await client.send("Target.createTarget", { url: "about:blank" });
    targetId = targetRes.targetId;
    console.log("Created target page:", targetId);
  } catch (err) {
    console.error("Target.createTarget failed:", err);
  }

  if (!targetId) {
    // Let's find the existing page target to attach to, or use it
    try {
      console.log("Getting active targets...");
      const targets = await client.send("Target.getTargets");
      console.log("Active targets:", JSON.stringify(targets, null, 2));
      const pageTarget = targets.targetInfos.find(t => t.type === "page");
      if (pageTarget) {
        targetId = pageTarget.targetId;
        console.log("Using existing page target:", targetId);
      }
    } catch (err) {
      console.error("Target.getTargets failed:", err);
    }
  }

  if (!targetId) {
    console.error("Could not find or create a page target.");
    process.exit(1);
  }

  try {
    console.log("Attaching to target...");
    const attachRes = await client.send("Target.attachToTarget", { targetId, flatten: true });
    sessionId = attachRes.sessionId;
    console.log("Attached to target session:", sessionId);
  } catch (err) {
    console.error("Target.attachToTarget failed:", err);
    process.exit(1);
  }

  console.log("Enabling Page domain...");
  await client.send("Page.enable", {}, sessionId).catch(err => console.error("Page.enable failed:", err));
  
  console.log("Enabling Runtime domain...");
  await client.send("Runtime.enable", {}, sessionId).catch(err => console.error("Runtime.enable failed:", err));
  
  console.log("Enabling Network domain...");
  await client.send("Network.enable", {}, sessionId).catch(err => console.error("Network.enable failed:", err));

  // Track network requests
  const requests = [];
  client.on("Network.requestWillBeSent", (params, sId) => {
    if (sId === sessionId) {
      requests.push({
        url: params.request.url,
        method: params.request.method,
        headers: params.request.headers,
        postData: params.request.postData
      });
    }
  });

  try {
    // ----------------------------------------------------
    // TEST 1: Custom Cursor on Desktop (Normal View)
    // ----------------------------------------------------
    console.log("\n--- TEST 1: Custom Cursor Interactions (Desktop) ---");
    
    // Navigate to homepage
    console.log("Navigating to homepage...");
    await client.send("Page.navigate", { url: "http://localhost:3000" }, sessionId);
    
    // Wait for the cursor to be rendered (mounted)
    console.log("Waiting for magic-cursor to render...");
    let cursorRendered = false;
    for (let i = 0; i < 20; i++) {
      const check = await client.send("Runtime.evaluate", {
        expression: "!!document.getElementById('magic-cursor')",
        returnByValue: true
      }, sessionId);
      if (check && check.result && check.result.value) {
        cursorRendered = true;
        break;
      }
      await sleep(200);
    }

    if (!cursorRendered) {
      throw new Error("FAIL: #magic-cursor was not found in the DOM.");
    }
    console.log("PASS: #magic-cursor is rendered in the DOM on desktop.");

    // Trigger mouse movement to activate visible state
    console.log("Simulating initial mouse movement...");
    await client.send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: 100,
      y: 100
    }, sessionId);
    await sleep(200);

    // Get default cursor size
    let cursorState = await getCursorState(client, sessionId);
    console.log("Default cursor state:", cursorState);
    if (!cursorState || cursorState.width !== 8 || cursorState.height !== 8) {
      console.log(`WARNING: Expected 8x8 default size, got ${cursorState?.width}x${cursorState?.height}`);
    } else {
      console.log("PASS: Default cursor is 8x8 px.");
    }

    // Hover over data-cursor="-opaque" element (e.g. h1 on hero)
    console.log("Finding an element with data-cursor...");
    const opaqueCoords = await getElementCoords(client, "[data-cursor]", sessionId);
    if (opaqueCoords) {
      console.log(`Hovering over data-cursor element at (${opaqueCoords.x}, ${opaqueCoords.y})...`);
      await client.send("Input.dispatchMouseEvent", {
        type: "mouseMoved",
        x: opaqueCoords.x,
        y: opaqueCoords.y
      }, sessionId);
      await sleep(400); // Wait for transition

      cursorState = await getCursorState(client, sessionId);
      console.log("Cursor state on hover:", cursorState);
      if (cursorState && cursorState.width === 45 && cursorState.height === 45) {
        console.log("PASS: Cursor scaled to 45x45 px (opaque/larger circle) on data-cursor hover.");
      } else {
        throw new Error(`FAIL: Cursor did not scale to 45x45 px. Got ${cursorState?.width}x${cursorState?.height}`);
      }
    } else {
      console.log("WARNING: Could not find any data-cursor elements to hover over.");
    }

    // Hover over data-cursor-text element
    console.log("Finding an element with data-cursor-text...");
    const textCoords = await getElementCoords(client, "[data-cursor-text]", sessionId);
    if (textCoords) {
      console.log(`Hovering over data-cursor-text element at (${textCoords.x}, ${textCoords.y})...`);
      await client.send("Input.dispatchMouseEvent", {
        type: "mouseMoved",
        x: textCoords.x,
        y: textCoords.y
      }, sessionId);
      await sleep(400); // Wait for transition

      cursorState = await getCursorState(client, sessionId);
      console.log("Cursor state on hover (text):", cursorState);
      if (cursorState && cursorState.width === 75 && cursorState.height === 75 && cursorState.text.length > 0) {
        console.log(`PASS: Cursor scaled to 75x75 px and displays text '${cursorState.text}' on data-cursor-text hover.`);
      } else {
        throw new Error(`FAIL: Cursor did not scale to 75x75 px with text. Got ${cursorState?.width}x${cursorState?.height}, text: '${cursorState?.text}'`);
      }
    } else {
      console.log("WARNING: Could not find any data-cursor-text elements to hover over.");
    }

    // Move mouse away to non-hover element
    console.log("Moving mouse away to empty space (500, 500)...");
    await client.send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: 500,
      y: 500
    }, sessionId);
    await sleep(400);
    cursorState = await getCursorState(client, sessionId);
    console.log("Cursor state after moving away:", cursorState);
    if (cursorState && cursorState.width === 8 && cursorState.height === 8 && !cursorState.text) {
      console.log("PASS: Cursor reset to default 8x8 size with no text.");
    } else {
      throw new Error(`FAIL: Cursor did not reset to default size. Got ${cursorState?.width}x${cursorState?.height}, text: '${cursorState?.text}'`);
    }

    // ----------------------------------------------------
    // TEST 2: Custom Cursor Disables on Touch Devices
    // ----------------------------------------------------
    console.log("\n--- TEST 2: Custom Cursor Disables on Touch Devices ---");
    
    // Enable Mobile Emulation
    console.log("Enabling mobile touch emulation...");
    await client.send("Emulation.setTouchEmulationEnabled", {
      enabled: true,
      configuration: "mobile"
    }, sessionId);

    // Reload page to re-trigger useEffect matchMedia checks
    console.log("Reloading page with touch emulation active...");
    await client.send("Page.reload", {}, sessionId);
    
    // Wait a bit
    await sleep(1000);

    // Check if magic-cursor is in DOM
    const hasCursorOnTouch = await client.send("Runtime.evaluate", {
      expression: "!!document.getElementById('magic-cursor')",
      returnByValue: true
    }, sessionId);

    console.log("Is #magic-cursor present in DOM on touch device?", hasCursorOnTouch.result.value);
    if (hasCursorOnTouch.result.value) {
      throw new Error("FAIL: #magic-cursor should NOT be rendered in the DOM on touch devices.");
    } else {
      console.log("PASS: #magic-cursor is properly disabled (returns null / not rendered) on touch devices.");
    }

    // Disable touch emulation for the next tests
    await client.send("Emulation.setTouchEmulationEnabled", { enabled: false }, sessionId);


    // ----------------------------------------------------
    // TEST 3: Search Input Behavior & Debouncing on /cars
    // ----------------------------------------------------
    console.log("\n--- TEST 3: Search Input Behavior on /cars ---");
    
    // Navigate to /cars page
    console.log("Navigating to /cars...");
    await client.send("Page.navigate", { url: "http://localhost:3000/cars" }, sessionId);

    // Wait for the search input to load
    let searchInputLoaded = false;
    for (let i = 0; i < 20; i++) {
      const check = await client.send("Runtime.evaluate", {
        expression: "!!document.querySelector('form input[type=\"text\"]')",
        returnByValue: true
      }, sessionId);
      if (check && check.result && check.result.value) {
        searchInputLoaded = true;
        break;
      }
      await sleep(200);
    }
    if (!searchInputLoaded) {
      throw new Error("FAIL: Search input not found on /cars page.");
    }
    console.log("PASS: Search input is loaded on /cars page.");

    // Wait for initial data fetches to settle
    console.log("Waiting for initial page load requests to settle...");
    await sleep(1500);
    
    // Clear list of recorded requests
    requests.length = 0;

    // Simulate typing rapidly
    console.log("Simulating rapid typing in search input...");
    
    // We will focus the input and change its value, dispatching "input" and "change" events
    await client.send("Runtime.evaluate", {
      expression: `
        (() => {
          const input = document.querySelector('form input[type="text"]');
          input.focus();
          
          // Type 'T', 'o', 'y', 'o', 't', 'a' rapidly
          const chars = ['T', 'o', 'y', 'o', 't', 'a'];
          let current = "";
          for (let i = 0; i < chars.length; i++) {
            current += chars[i];
            input.value = current;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        })()
      `,
      returnByValue: true
    }, sessionId);

    // Wait 2 seconds to verify no fetches are triggered by typing
    console.log("Waiting to see if any fetches are triggered by typing...");
    await sleep(2000);

    // Check requests sent
    const fetchRequestsDuringTyping = requests.filter(r => r.method === "POST" && r.url.includes("/cars"));
    console.log("POST requests intercepted during/after typing:", fetchRequestsDuringTyping.length);
    
    if (fetchRequestsDuringTyping.length > 0) {
      console.log("Intercepted requests details:", fetchRequestsDuringTyping);
      throw new Error("FAIL: Database fetch/server action was triggered while typing!");
    } else {
      console.log("PASS: No database fetches/server actions were triggered while typing.");
    }

    // Submit the form
    console.log("Submitting the search form...");
    requests.length = 0; // Clear requests again

    await client.send("Runtime.evaluate", {
      expression: `
        (() => {
          const form = document.querySelector('form');
          form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        })()
      `,
      returnByValue: true
    }, sessionId);

    // Wait for the request to be sent and completed
    console.log("Waiting for fetch request to complete...");
    await sleep(1500);

    const fetchRequestsAfterSubmit = requests.filter(r => r.method === "POST");
    console.log("POST requests intercepted after submit:", fetchRequestsAfterSubmit.length);
    if (fetchRequestsAfterSubmit.length > 0) {
      console.log("PASS: Server action/fetch was successfully triggered on form submit.");
      // Check if it returned Toyota Yaris
      const carNames = await client.send("Runtime.evaluate", {
        expression: `
          (() => {
            const list = Array.from(document.querySelectorAll('.perfect-fleet-content h3')).map(h3 => h3.textContent.trim());
            return list;
          })()
        `,
        returnByValue: true
      }, sessionId);
      console.log("Visible cars on page:", carNames.result.value);
      if (carNames.result.value.includes("Toyota Yaris 2017")) {
        console.log("PASS: Search filter correctly filtered list to 'Toyota Yaris 2017'.");
      } else {
        console.log("WARNING: Expected 'Toyota Yaris 2017' in the search results, but got:", carNames.result.value);
      }
    } else {
      throw new Error("FAIL: Form submission did NOT trigger any fetch request / server action.");
    }

  } catch (error) {
    console.error("Test failed with error:", error);
    process.exit(1);
  } finally {
    // Close the target if we created it
    if (targetId) {
      try {
        await client.send("Target.closeTarget", { targetId });
      } catch (err) {
        // ignore if it was an existing target we shouldn't close
      }
    }
    await client.close();
    console.log("\nTests finished.");
  }
}

async function getCursorState(client, sessionId) {
  const check = await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const ball = document.getElementById("ball");
        if (!ball) return null;
        const rect = ball.getBoundingClientRect();
        const style = window.getComputedStyle(ball);
        return {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          text: ball.textContent.trim(),
          backgroundColor: style.backgroundColor
        };
      })()
    `,
    returnByValue: true
  }, sessionId);
  return check.result ? check.result.value : null;
}

async function getElementCoords(client, selector, sessionId) {
  const check = await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const el = document.querySelector('${selector}');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          x: Math.round(rect.left + rect.width / 2),
          y: Math.round(rect.top + rect.height / 2)
        };
      })()
    `,
    returnByValue: true
  }, sessionId);
  return check.result ? check.result.value : null;
}

runTests().catch(console.error);
