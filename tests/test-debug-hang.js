console.log("Script started");
const CDPClient = require("./cdp-client");
console.log("Imported CDPClient");

async function run() {
  console.log("Instantiating CDPClient...");
  const client = new CDPClient();
  console.log("Connecting...");
  await client.connect();
  console.log("Connected.");
  
  console.log("Getting targets...");
  const targets = await client.send("Target.getTargets");
  console.log("Got targets.");
  
  const pageTarget = targets.targetInfos.find(t => t.type === "page");
  console.log("Target page:", pageTarget.targetId);

  console.log("Attaching to target...");
  const attachRes = await client.send("Target.attachToTarget", { targetId: pageTarget.targetId, flatten: true });
  console.log("Attached.");

  await client.close();
  console.log("Closed.");
}

run().catch(console.error);
