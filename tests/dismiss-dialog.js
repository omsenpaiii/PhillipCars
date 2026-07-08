const CDPClient = require("./cdp-client");

async function run() {
  const client = new CDPClient();
  await client.connect();
  const targets = await client.send("Target.getTargets");
  const pageTarget = targets.targetInfos.find(t => t.type === "page");
  const attachRes = await client.send("Target.attachToTarget", { targetId: pageTarget.targetId, flatten: true });
  const sessionId = attachRes.sessionId;
  console.log("Attached to page. Dismissing any dialogs...");

  try {
    await client.send("Page.handleJavaScriptDialog", { accept: true }, sessionId);
    console.log("Page.handleJavaScriptDialog command sent!");
  } catch (err) {
    console.error("Page.handleJavaScriptDialog failed:", err.message);
  }

  // Try Page.enable now
  console.log("Trying Page.enable...");
  const timer = setTimeout(() => {
    console.log("Page.enable still hung!");
    process.exit(1);
  }, 3000);

  await client.send("Page.enable", {}, sessionId);
  clearTimeout(timer);
  console.log("Page.enable succeeded! Page target is unfrozen!");

  await client.close();
}
run().catch(console.error);
