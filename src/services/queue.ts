import { Queue, Worker, QueueEvents } from 'bullmq';
import Redis from 'ioredis';

const hasRedis = !!process.env.REDIS_URL;

class MockQueue {
  async add(name: string, data: any, opts?: any) {
    console.log(`[MockQueue] Added job ${name}`);
    setTimeout(() => {
      this.processJob({ id: opts?.jobId || Math.random().toString(), name, data });
    }, 100);
  }

  processJob(job: any) {
    const event = job.data;
    switch (event.type) {
      case "charge.succeeded":
        console.log(`[Mock Worker] Executing transfers for ${event.data.object?.transfer_group}`);
        break;
      default:
        console.log(`[Mock Worker] Unhandled job event ${event.type}`);
    }
    console.log(`Job ${job.id} completed!`);
  }
}

let stripeEventQueue: any;
let queueEvents: any;
let worker: any;

if (hasRedis) {
  const connection = new Redis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null,
  });
  
  stripeEventQueue = new Queue('stripe-events', { connection });
  queueEvents = new QueueEvents('stripe-events', { connection });

  worker = new Worker('stripe-events', async job => {
    console.log(`Processing job ${job.id} of type ${job.name}`);
    const event = job.data;
    
    switch (event.type) {
      case "charge.succeeded":
        console.log(`[Worker] Executing transfers for ${event.data.object.transfer_group}`);
        break;
      default:
        console.log(`[Worker] Unhandled job event ${event.type}`);
    }

    return { processed: true, eventId: event.id };
  }, { 
    connection,
    concurrency: 5,
    settings: {
      backoffStrategy: function (attemptsMade, err: any) {
        return 5000 + Math.random() * 500;
      }
    }
  });

  worker.on('completed', (job: any) => {
    console.log(`Job ${job.id} completed!`);
  });

  worker.on('failed', (job: any, err: Error) => {
    console.log(`Job ${job?.id} failed with error ${err.message}. Moving to Dead Letter Queue (failed state).`);
  });
} else {
  console.log("No REDIS_URL found. Using in-memory MockQueue for development.");
  stripeEventQueue = new MockQueue();
}

export { stripeEventQueue, queueEvents, worker };
