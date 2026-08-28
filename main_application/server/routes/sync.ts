import { Router } from "express";
import { type Response } from "express";

export const syncRouter = Router();

// Store active connections
const clients = new Set<Response>();

// Store the latest state
let latestState: any = { type: "idle" };

// Send an event to all connected clients
function broadcast(state: any) {
  const data = `data: ${JSON.stringify(state)}\n\n`;
  for (const client of clients) {
    client.write(data);
  }
}

syncRouter.get("/stream", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  // Send the current state immediately upon connection
  res.write(`data: ${JSON.stringify(latestState)}\n\n`);

  clients.add(res);

  req.on("close", () => {
    clients.delete(res);
  });
});

syncRouter.post("/state", (req, res) => {
  const state = req.body;
  if (!state || !state.type) {
    res.status(400).json({ error: "Invalid state" });
    return;
  }

  latestState = state;
  broadcast(latestState);
  res.status(200).json({ success: true });
});
