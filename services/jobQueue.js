import { Queue, Worker } from "bullmq";
import redis from "./redisClient.js"; // Reuse existing Redis connection

// Create the queue using the existing Redis connection
const emailQueue = new Queue("emailQueue", {
    connection: {
        ...redis.options, // Use existing Redis configuration
        maxRetriesPerRequest: null, // Required for BullMQ
    },
});

// Function to add email jobs
export const addEmailJob = async (to, subject, body) => {
    await emailQueue.add("sendEmail", { to, subject, body });
    console.log(`📩 Email job added for ${to}`);
};

// Worker to process jobs
new Worker(
    "emailQueue",
    async (job) => {
        console.log(`📨 Processing email for ${job.data.to}`);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate email sending
        console.log(`✅ Email sent to ${job.data.to}`);
    },
    {
        connection: {
            ...redis.options,
            maxRetriesPerRequest: null,
        },
    }
);

console.log("🚀 Job Queue initialized");

// 📌 Summary of What Happened
// Express API added a job to Redis ✅

// BullMQ stored the job in a queue ✅

// Worker processed the job & removed it from the queue ✅

// Logs confirmed successful execution ✅

