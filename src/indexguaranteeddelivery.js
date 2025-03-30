import { connectRabbitMQ, consumeQueue, sendToQueue } from "../services/rabbitMQ.js";

async function testRabbitMQ() {
  await connectRabbitMQ(); // Ensure RabbitMQ is connected

  // Send a test message
  await sendToQueue("test_queue", { message: "Hello from RabbitMQ!" });

  // Consume messages from the queue
  consumeQueue("test_queue", (data) => {
    console.log("✅ Processed message:", data);
  });
}

testRabbitMQ();
