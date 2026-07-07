const CDPClient = require("./cdp-client");

async function run() {
  const client = new CDPClient();
  await client.connect();
  const targets = await client.send("Target.getTargets");
  const pageTarget = targets.targetInfos.find(t => t.type === "page");
  const attachRes = await client.send("Target.attachToTarget", { targetId: pageTarget.targetId, flatten: true });
  const sessionId = attachRes.sessionId;
  
  await client.send("Page.enable", {}, sessionId);
  await client.send("Runtime.enable", {}, sessionId);
  await client.send("Network.enable", {}, sessionId);

  const requests = [];
  client.on("Network.requestWillBeSent", (params, sId) => {
    if (sId === sessionId) {
      console.log("Interacted request:", params.request.method, params.request.url);
      requests.push(params.request);
    }
  });

  console.log("Navigating to /cars...");
  await client.send("Page.navigate", { url: "http://localhost:3000/cars" }, sessionId);
  await new Promise(r => setTimeout(r, 2000));

  console.log("Typing 'Toyota Yaris' into search...");
  await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const input = document.querySelector('form.mb-4 input[type="text"]');
        if (!input) return "No input found";
        input.value = "Toyota Yaris";
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        return "Typed";
      })()
    `,
    returnByValue: true
  }, sessionId);

  await new Promise(r => setTimeout(r, 1000));

  console.log("Clicking search button...");
  const clickResult = await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const btn = document.querySelector('form.mb-4 button[type="submit"]');
        if (!btn) return "No button found";
        btn.click();
        return "Clicked";
      })()
    `,
    returnByValue: true
  }, sessionId);
  console.log("Click result:", clickResult.result.value);

  console.log("Waiting for results...");
  await new Promise(r => setTimeout(r, 2000));

  const pageInfo = await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        return {
          url: window.location.href,
          title: document.title,
          carsCount: document.querySelectorAll('.perfect-fleet-content h3').length,
          cars: Array.from(document.querySelectorAll('.perfect-fleet-content h3')).map(h3 => h3.textContent.trim())
        };
      })()
    `,
    returnByValue: true
  }, sessionId);

  console.log("Page info after search:", pageInfo.result.value);
  await client.close();
}

run().catch(console.error);
