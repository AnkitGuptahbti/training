import amqp from "amqplib";

let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();
    console.log("✅ Connected to RabbitMQ");

    process.on("exit", () => {
      channel.close();
      console.log("❌ RabbitMQ channel closed");
    });
  } catch (error) {
    console.error("❌ RabbitMQ Connection Error:", error);
  }
}

async function sendToQueue(queue, message) {
  if (!channel) await connectRabbitMQ();
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  console.log(`📩 Sent to ${queue}:`, message);
}

async function consumeQueue(queue, callback) {
  if (!channel) await connectRabbitMQ();
  await channel.assertQueue(queue, { durable: true });

  console.log(`🔄 Waiting for messages in ${queue}...`);

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const message = JSON.parse(msg.content.toString());
      console.log(`📥 Received from ${queue}:`, message);
      callback(message);
      channel.ack(msg);
    }
  }, { noAck: false });
}

export { connectRabbitMQ, sendToQueue, consumeQueue };
