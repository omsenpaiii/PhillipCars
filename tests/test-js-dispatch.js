const CDPClient = require("./cdp-client");

async function run() {
  const client = new CDPClient();
  await client.connect();

  const targets = await client.send("Target.getTargets");
  const pageTarget = targets.targetInfos.find(t => t.type === "page");
  const attachRes = await client.send("Target.attachToTarget", { targetId: pageTarget.targetId, flatten: true });
  const sessionId = attachRes.sessionId;

  await client.send("Runtime.enable", {}, sessionId);

  console.log("Dispatching mousemove on [data-cursor] element...");
  const result = await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const el = document.querySelector('[data-cursor]');
        if (!el) return "No element";
        
        // Dispatch mousemove
        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        const event = new MouseEvent('mousemove', {
          bubbles: true,
          clientX: x,
          clientY: y
        });
        el.dispatchEvent(event);
        return "Dispatched";
      })()
    `,
    returnByValue: true
  }, sessionId);

  console.log("Dispatch result:", result.result.value);

  // Wait for React state update
  await new Promise(r => setTimeout(r, 200));

  const check = await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const ball = document.getElementById("ball");
        if (!ball) return null;
        const rect = ball.getBoundingClientRect();
        return {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          text: ball.textContent.trim()
        };
      })()
    `,
    returnByValue: true
  }, sessionId);

  console.log("Cursor state:", check.result.value);
  await client.close();
}

run().catch(console.error);
