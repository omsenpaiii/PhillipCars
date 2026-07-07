const CDPClient = require("./cdp-client");

async function run() {
  const client = new CDPClient();
  await client.connect();
  const targets = await client.send("Target.getTargets");
  const pageTarget = targets.targetInfos.find(t => t.type === "page");
  const attachRes = await client.send("Target.attachToTarget", { targetId: pageTarget.targetId, flatten: true });
  const sessionId = attachRes.sessionId;
  await client.send("Runtime.enable", {}, sessionId);

  console.log("Dispatching mousemove on [data-cursor]...");
  await client.send("Runtime.evaluate", {
    expression: "document.querySelector('[data-cursor]').dispatchEvent(new MouseEvent('mousemove', { bubbles: true }))",
    returnByValue: true
  }, sessionId);

  for (let i = 0; i <= 5; i++) {
    const check = await client.send("Runtime.evaluate", {
      expression: `
        (() => {
          const ball = document.getElementById("ball");
          return {
            inlineWidth: ball.style.width,
            rectWidth: ball.getBoundingClientRect().width
          };
        })()
      `,
      returnByValue: true
    }, sessionId);
    console.log(`After ${i * 100}ms: inlineWidth = ${check.result.value.inlineWidth}, rectWidth = ${check.result.value.rectWidth}`);
    await new Promise(r => setTimeout(r, 100));
  }
  await client.close();
}
run().catch(console.error);
