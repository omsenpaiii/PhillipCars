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
    console.log("Getting active targets...");
    const targets = await client.send("Target.getTargets");
    const pageTarget = targets.targetInfos.find(t => t.type === "page");
    if (pageTarget) {
      targetId = pageTarget.targetId;
      console.log("Using existing page target:", targetId);
    }
  } catch (err) {
    console.error("Target.getTargets failed:", err);
  }

  if (!targetId) {
    console.error("Could not find a page target.");
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

  console.log("Enabling domains...");
  await client.send("Page.enable", {}, sessionId);
  await client.send("Runtime.enable", {}, sessionId);
  await client.send("Network.enable", {}, sessionId);

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

    // Get default cursor size (inline styles)
    let cursorState = await getCursorState(client, sessionId);
    console.log("Default cursor state (inline):", cursorState);
    if (cursorState && cursorState.inlineWidth === "8px" && cursorState.inlineHeight === "8px") {
      console.log("PASS: Default cursor inline style is 8px.");
    } else {
      throw new Error(`FAIL: Default cursor inline style width/height should be 8px. Got ${cursorState?.inlineWidth}x${cursorState?.inlineHeight}`);
    }

    // Hover over data-cursor="-opaque" element (e.g. h1 on hero)
    console.log("Finding an element with data-cursor...");
    const hasDataCursor = await client.send("Runtime.evaluate", {
      expression: "!!document.querySelector('[data-cursor]')",
      returnByValue: true
    }, sessionId);

    if (hasDataCursor.result.value) {
      console.log("Dispatching mousemove on [data-cursor] element...");
      await client.send("Runtime.evaluate", {
        expression: `
          (() => {
            const el = document.querySelector('[data-cursor]');
            el.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
          })()
        `,
        returnByValue: true
      }, sessionId);
      await sleep(200); // Wait for React state change

      cursorState = await getCursorState(client, sessionId);
      console.log("Cursor state on [data-cursor] hover (inline):", cursorState);
      if (cursorState && cursorState.inlineWidth === "45px" && cursorState.inlineHeight === "45px") {
        console.log("PASS: Cursor inline size scaled to 45px (opaque/larger circle) on data-cursor hover.");
      } else {
        throw new Error(`FAIL: Cursor inline size did not scale to 45px. Got ${cursorState?.inlineWidth}`);
      }
    } else {
      console.log("WARNING: Could not find any [data-cursor] elements to hover over.");
    }

    // Hover over data-cursor-text element
    console.log("Finding an element with data-cursor-text...");
    const hasDataCursorText = await client.send("Runtime.evaluate", {
      expression: "!!document.querySelector('[data-cursor-text]')",
      returnByValue: true
    }, sessionId);

    if (hasDataCursorText.result.value) {
      console.log("Dispatching mousemove on [data-cursor-text] element...");
      await client.send("Runtime.evaluate", {
        expression: `
          (() => {
            const el = document.querySelector('[data-cursor-text]');
            el.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
          })()
        `,
        returnByValue: true
      }, sessionId);
      await sleep(200); // Wait for React state change

      cursorState = await getCursorState(client, sessionId);
      console.log("Cursor state on [data-cursor-text] hover (inline):", cursorState);
      if (cursorState && cursorState.inlineWidth === "75px" && cursorState.inlineHeight === "75px" && cursorState.text.length > 0) {
        console.log(`PASS: Cursor inline size scaled to 75px and displays text '${cursorState.text}' on data-cursor-text hover.`);
      } else {
        throw new Error(`FAIL: Cursor inline size did not scale to 75px with text. Got ${cursorState?.inlineWidth}, text: '${cursorState?.text}'`);
      }
    } else {
      console.log("WARNING: Could not find any [data-cursor-text] elements to hover over.");
    }

    // Move mouse away (trigger mousemove on non-hover element)
    console.log("Dispatching mousemove on body to simulate moving away...");
    await client.send("Runtime.evaluate", {
      expression: `
        (() => {
          document.body.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
        })()
      `,
      returnByValue: true
    }, sessionId);
    await sleep(200);

    cursorState = await getCursorState(client, sessionId);
    console.log("Cursor state after moving away (inline):", cursorState);
    if (cursorState && cursorState.inlineWidth === "8px" && cursorState.inlineHeight === "8px" && !cursorState.text) {
      console.log("PASS: Cursor inline size reset to 8px with no text.");
    } else {
      throw new Error(`FAIL: Cursor inline size did not reset to 8px. Got ${cursorState?.inlineWidth}, text: '${cursorState?.text}'`);
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
    await sleep(1500);

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
    
    await client.send("Runtime.evaluate", {
      expression: `
        (() => {
          const input = document.querySelector('form input[type="text"]');
          input.focus();
          
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
            return Array.from(document.querySelectorAll('.perfect-fleet-content h3')).map(h3 => h3.textContent.trim());
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

    console.log("\nALL TESTS PASSED SUCCESSFULLY!");
    process.exit(0);

  } catch (error) {
    console.error("Test failed with error:", error);
    process.exit(1);
  } finally {
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
        return {
          inlineWidth: ball.style.width,
          inlineHeight: ball.style.height,
          text: ball.textContent.trim()
        };
      })()
    `,
    returnByValue: true
  }, sessionId);
  return check.result ? check.result.value : null;
}

runTests().catch(console.error);
