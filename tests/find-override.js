const CDPClient = require("./cdp-client");

async function run() {
  const client = new CDPClient();
  await client.connect();
  const targets = await client.send("Target.getTargets");
  const pageTarget = targets.targetInfos.find(t => t.type === "page");
  const attachRes = await client.send("Target.attachToTarget", { targetId: pageTarget.targetId, flatten: true });
  const sessionId = attachRes.sessionId;
  await client.send("Runtime.enable", {}, sessionId);

  const report = await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const ball = document.getElementById("ball");
        if (!ball) return "No ball element";

        const cssRules = [];
        for (const sheet of document.styleSheets) {
          try {
            for (const rule of sheet.cssRules) {
              if (rule.selectorText && rule.selectorText.includes("#ball")) {
                cssRules.push({
                  href: sheet.href || 'inline/local',
                  selector: rule.selectorText,
                  css: rule.cssText
                });
              }
            }
          } catch (e) {
            // cross-origin stylesheets might throw, ignore
          }
        }
        return {
          inlineStyle: ball.getAttribute("style"),
          computedWidth: window.getComputedStyle(ball).width,
          matchingRules: cssRules
        };
      })()
    `,
    returnByValue: true
  }, sessionId);

  console.log(JSON.stringify(report.result.value, null, 2));
  await client.close();
}
run().catch(console.error);
