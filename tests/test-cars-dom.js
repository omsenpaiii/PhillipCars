const CDPClient = require("./cdp-client");

async function run() {
  const client = new CDPClient();
  await client.connect();
  const targets = await client.send("Target.getTargets");
  const pageTarget = targets.targetInfos.find(t => t.type === "page");
  const attachRes = await client.send("Target.attachToTarget", { targetId: pageTarget.targetId, flatten: true });
  const sessionId = attachRes.sessionId;
  await client.send("Runtime.enable", {}, sessionId);

  const dom = await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const fleetCards = Array.from(document.querySelectorAll('.perfect-fleet-item, .fleet-card-image-link')).map(el => el.outerHTML);
        const skeletonShimmers = document.querySelectorAll('.skeleton-shimmer').length;
        const noCarsFound = document.querySelector('h3')?.textContent || 'No H3 found';
        return {
          fleetCardsCount: fleetCards.length,
          skeletonShimmersCount: skeletonShimmers,
          noCarsFoundText: noCarsFound,
          url: window.location.href
        };
      })()
    `,
    returnByValue: true
  }, sessionId);

  console.log(dom.result.value);
  await client.close();
}
run().catch(console.error);
