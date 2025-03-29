import amqp from "amqplib";

const RABBITMQ_URL = "amqp://localhost";
const QUEUE_NAME = "emailQueue";

const startWorker = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log("📨 Worker listening for jobs...");

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        const job = JSON.parse(msg.content.toString());
        console.log("✅ Processing email:", job);

        // Simulating email sending (replace with actual email service)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log("📧 Email sent to:", job.to);
        channel.ack(msg); // Acknowledge the job is processed
      }
    });
  } catch (err) {
    console.error("❌ RabbitMQ Worker Error:", err);
  }
};

startWorker();
