const CDPClient = require("./cdp-client");

async function run() {
  const client = new CDPClient();
  await client.connect();
  const targets = await client.send("Target.getTargets");
  const pageTarget = targets.targetInfos.find(t => t.type === "page");
  const attachRes = await client.send("Target.attachToTarget", { targetId: pageTarget.targetId, flatten: true });
  const sessionId = attachRes.sessionId;
  await client.send("Runtime.enable", {}, sessionId);

  console.log("Before hover...");
  let styles = await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const ball = document.getElementById("ball");
        if (!ball) return null;
        const comp = window.getComputedStyle(ball);
        return {
          inline: ball.style.width,
          computed: comp.width,
          rect: ball.getBoundingClientRect().width
        };
      })()
    `,
    returnByValue: true
  }, sessionId);
  console.log("Before:", styles.result.value);

  console.log("Hovering...");
  await client.send("Runtime.evaluate", {
    expression: "document.querySelector('[data-cursor]').dispatchEvent(new MouseEvent('mousemove', { bubbles: true }))",
    returnByValue: true
  }, sessionId);

  await new Promise(r => setTimeout(r, 400));

  styles = await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const ball = document.getElementById("ball");
        if (!ball) return null;
        const comp = window.getComputedStyle(ball);
        return {
          inline: ball.style.width,
          computed: comp.width,
          rect: ball.getBoundingClientRect().width
        };
      })()
    `,
    returnByValue: true
  }, sessionId);
  console.log("After:", styles.result.value);

  await client.close();
}
run().catch(console.error);
