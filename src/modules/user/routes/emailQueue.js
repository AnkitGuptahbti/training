import express from "express";
import { getChannel } from "../../../../services/rabbitMQClient.js";

const router = express.Router();
const QUEUE_NAME = "emailQueue";

// Add job to RabbitMQ queue
router.post("/send-email", async (req, res) => {
  const channel = getChannel();
  if (!channel) return res.status(500).json({ message: "RabbitMQ not ready" });

  const job = req.body; // { to: "user@example.com", subject: "Test", body: "Hello!" }
  await channel.assertQueue(QUEUE_NAME, { durable: true }); // Ensure queue exists
  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(job)), {
    persistent: true, // Ensures the job is saved even if RabbitMQ restarts
  });

  console.log("📩 Job added to RabbitMQ:", job);
  res.json({ message: "Email job added to queue" });
});

export default router;
