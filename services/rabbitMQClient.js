import amqp from "amqplib";

const RABBITMQ_URL = "amqp://localhost"; // If using Docker, change to "amqp://rabbitmq"

let connection, channel;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log("🔥 Connected to RabbitMQ");
  } catch (err) {
    console.error("❌ RabbitMQ Connection Error:", err);
  }
};

const getChannel = () => channel;

export { connectRabbitMQ, getChannel };
