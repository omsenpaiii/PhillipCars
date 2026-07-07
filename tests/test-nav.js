const CDPClient = require("./cdp-client");

async function test() {
  const client = new CDPClient();
  await client.connect();

  const targets = await client.send("Target.getTargets");
  const pageTarget = targets.targetInfos.find(t => t.type === "page");
  if (!pageTarget) {
    console.log("No page target found");
    await client.close();
    return;
  }

  const attachRes = await client.send("Target.attachToTarget", { targetId: pageTarget.targetId, flatten: true });
  const sessionId = attachRes.sessionId;

  await client.send("Page.enable", {}, sessionId);
  await client.send("Runtime.enable", {}, sessionId);

  console.log("Current URL before navigation:", (await client.send("Runtime.evaluate", { expression: "window.location.href" }, sessionId)).result.value);

  console.log("Navigating to http://localhost:3000 ...");
  await client.send("Page.navigate", { url: "http://localhost:3000" }, sessionId);

  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 500));
    const url = (await client.send("Runtime.evaluate", { expression: "window.location.href" }, sessionId)).result.value;
    const title = (await client.send("Runtime.evaluate", { expression: "document.title" }, sessionId)).result.value;
    console.log(`Poll ${i}: URL = ${url}, Title = ${title}`);
  }

  await client.close();
}

test().catch(console.error);
