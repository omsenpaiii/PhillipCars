const wsUrl = process.env.AGY_BROWSER_WS_URL;
if (!wsUrl) {
  console.error("AGY_BROWSER_WS_URL environment variable is not defined.");
  process.exit(1);
}

console.log("Connecting to:", wsUrl);
const ws = new WebSocket(wsUrl);

ws.onopen = () => {
  console.log("WebSocket connection established!");
  const msg = JSON.stringify({
    id: 1,
    method: "Target.getTargets"
  });
  ws.send(msg);
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Received response:", JSON.stringify(data, null, 2));
  ws.close();
};

ws.onerror = (err) => {
  console.error("WebSocket error:", err);
};

ws.onclose = () => {
  console.log("WebSocket connection closed.");
};
