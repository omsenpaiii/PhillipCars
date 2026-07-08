const CDPClient = require("./cdp-client");

async function run() {
  const client = new CDPClient();
  await client.connect();
  const targets = await client.send("Target.getTargets");
  console.log("Current targets:", JSON.stringify(targets, null, 2));

  const pageTarget = targets.targetInfos.find(t => t.type === "page");
  if (!pageTarget) {
    console.error("No page target found");
    await client.close();
    return;
  }

  const browserContextId = pageTarget.browserContextId;
  console.log("Attempting Target.createTarget with browserContextId:", browserContextId);
  try {
    const res = await client.send("Target.createTarget", {
      url: "http://localhost:3000",
      browserContextId: browserContextId
    });
    console.log("Successfully created target! Result:", res);
  } catch (err) {
    console.error("Create target failed:", err.message);
  }

  await client.close();
}
run().catch(console.error);
