const CDPClient = require("./cdp-client");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log("1. Starting search verification test...");
  const client = new CDPClient();
  await client.connect();
  console.log("2. Connected to Chrome DevTools Protocol.");

  const targets = await client.send("Target.getTargets");
  const pageTarget = targets.targetInfos.find(t => t.type === "page");
  if (!pageTarget) {
    console.error("No page target found.");
    process.exit(1);
  }

  const attachRes = await client.send("Target.attachToTarget", { targetId: pageTarget.targetId, flatten: true });
  const sessionId = attachRes.sessionId;
  console.log("3. Attached to page session:", sessionId);

  await client.send("Page.enable", {}, sessionId);
  await client.send("Runtime.enable", {}, sessionId);
  await client.send("Network.enable", {}, sessionId);
  console.log("4. Enabled domains.");

  const requests = [];
  client.on("Network.requestWillBeSent", (params, sId) => {
    if (sId === sessionId) {
      console.log(`-> Network request: ${params.request.method} ${params.request.url}`);
      requests.push({
        url: params.request.url,
        method: params.request.method,
        headers: params.request.headers
      });
    }
  });

  console.log("5. Navigating to /cars...");
  // Navigate with a timeout of 10s
  const navPromise = client.send("Page.navigate", { url: "http://localhost:3000/cars" }, sessionId);
  const timeoutPromise = sleep(10000).then(() => { throw new Error("Navigation timeout"); });
  try {
    await Promise.race([navPromise, timeoutPromise]);
    console.log("6. Navigation finished.");
  } catch (err) {
    console.log("6. Navigation timed out or finished with warning:", err.message);
  }

  // Wait for search input to be present in DOM
  console.log("7. Waiting for search input to appear in DOM...");
  let inputFound = false;
  for (let i = 0; i < 30; i++) {
    const check = await client.send("Runtime.evaluate", {
      expression: "!!document.querySelector('form input[type=\"text\"]')",
      returnByValue: true
    }, sessionId);
    if (check && check.result && check.result.value) {
      inputFound = true;
      break;
    }
    await sleep(500);
  }

  if (!inputFound) {
    console.error("FAIL: Search input not found on page.");
    process.exit(1);
  }
  console.log("8. Search input found.");

  // Clear requests list to only count post-load requests
  await sleep(1500);
  console.log("9. Initial load requests settled. Clearing request logs.");
  requests.length = 0;

  // Simulate rapid typing in search input
  console.log("10. Simulating rapid typing in search input...");
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

  console.log("11. Waiting 2s to check for typing-triggered fetches...");
  await sleep(2000);

  const typingPOSTs = requests.filter(r => r.method === "POST");
  console.log("12. POST requests during typing:", typingPOSTs.length);
  if (typingPOSTs.length > 0) {
    console.error("FAIL: POST request / database fetch was triggered during typing!", typingPOSTs);
    process.exit(1);
  }
  console.log("PASS: Typing rapidly did not trigger any database fetches.");

  // Submit form by clicking submit button
  console.log("13. Submitting form by clicking search button...");
  requests.length = 0; // Clear requests

  await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const btn = document.querySelector('form button[type="submit"]');
        if (btn) {
          btn.click();
          return "Clicked submit button";
        }
        return "Search button not found";
      })()
    `,
    returnByValue: true
  }, sessionId);

  console.log("14. Waiting 2s for submit fetch request to complete...");
  await sleep(2000);

  const submitPOSTs = requests.filter(r => r.method === "POST");
  console.log("15. POST requests after submit:", submitPOSTs.length);
  if (submitPOSTs.length > 0) {
    console.log("PASS: Submitting the form triggered a fetch/server action.");
  } else {
    console.error("FAIL: Submitting the form did not trigger any fetch/server action.");
    process.exit(1);
  }

  // Get visible cars list
  const carsResult = await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        return Array.from(document.querySelectorAll('.perfect-fleet-content h3')).map(h3 => h3.textContent.trim());
      })()
    `,
    returnByValue: true
  }, sessionId);
  console.log("16. Visible cars after search:", carsResult.result.value);

  await client.close();
  console.log("17. Closed client. Test finished successfully!");
  process.exit(0);
}

run().catch(err => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
