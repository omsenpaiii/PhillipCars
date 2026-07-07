const CDPClient = require("./cdp-client");

async function run() {
  const client = new CDPClient();
  await client.connect();
  const targets = await client.send("Target.getTargets");
  const pageTarget = targets.targetInfos.find(t => t.type === "page");
  const attachRes = await client.send("Target.attachToTarget", { targetId: pageTarget.targetId, flatten: true });
  const sessionId = attachRes.sessionId;
  await client.send("Runtime.enable", {}, sessionId);

  console.log("Checking layout properties of #ball...");
  const properties = await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const ball = document.getElementById("ball");
        if (!ball) return null;
        const style = window.getComputedStyle(ball);
        return {
          display: style.display,
          position: style.position,
          width: style.width,
          height: style.height,
          minWidth: style.minWidth,
          maxWidth: style.maxWidth,
          boxSizing: style.boxSizing,
          opacity: style.opacity,
          transform: style.transform,
          left: style.left,
          top: style.top
        };
      })()
    `,
    returnByValue: true
  }, sessionId);

  console.log(JSON.stringify(properties.result.value, null, 2));
  await client.close();
}
run().catch(console.error);
