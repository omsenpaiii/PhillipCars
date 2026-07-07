const CDPClient = require("./cdp-client");

async function run() {
  const client = new CDPClient();
  await client.connect();
  const targets = await client.send("Target.getTargets");
  const pageTarget = targets.targetInfos.find(t => t.type === "page");
  const attachRes = await client.send("Target.attachToTarget", { targetId: pageTarget.targetId, flatten: true });
  const sessionId = attachRes.sessionId;
  await client.send("Runtime.enable", {}, sessionId);

  console.log("Locating form and elements...");
  const formInfo = await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const forms = Array.from(document.querySelectorAll('form')).map((f, i) => ({
          index: i,
          className: f.className,
          id: f.id,
          hasSearchInput: !!f.querySelector('input[placeholder="Search name..."]')
        }));
        return forms;
      })()
    `,
    returnByValue: true
  }, sessionId);

  console.log("Forms on page:", formInfo.result.value);
  await client.close();
}
run().catch(console.error);
