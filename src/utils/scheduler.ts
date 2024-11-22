import axios from 'axios';
import { config } from '../config/config.service';
import { saveUsers } from '../services/user.service';

const apiUrl = 'https://randomuser.me/api/'; // API endpoint

// Configuration (from config.service or .env)
const requestsPerSecond = config.requestsPerSecond || 5;
const batchSize = config.batchSize || 300;
const batchSleepTime = (config.batchSleepTime || 30) * 1000; // in milliseconds

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Queue for managing requests
let requestQueue: (() => Promise<void>)[] = [];
let isProcessingQueue = false;

async function processRequestQueue() {
  if (isProcessingQueue || requestQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;

  while (requestQueue.length > 0) {
    const batch = requestQueue.splice(0, batchSize);
    const promises = batch.map((request) => request());
    await Promise.all(promises);
    await delay(batchSleepTime); // Wait after each batch
  }

  isProcessingQueue = false;
}

const fetchAndSaveUsers = async (results = 1) => {
  try {
    const response = await axios.get(`${apiUrl}?results=${results}`);
    const users = response.data.results;

    if (users && users.length > 0) {
      await saveUsers(users);
    }
  } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        const retryAfter = parseInt(error.response.headers['retry-after'] || '1') * 1000;
        console.log(`Rate limited, retrying after ${retryAfter/1000} seconds`);
        await delay(retryAfter);

        requestQueue.push(() => fetchAndSaveUsers(results)); // Add to queue for retry
        processRequestQueue();
      } else {
        console.error('Error fetching or saving users:', error);
      }
  }
};


export const scheduleUserFetch = async (totalUsers = 5000) => {
    for (let i = 0; i < totalUsers; i++) {
      requestQueue.push(() => fetchAndSaveUsers());
      if(requestQueue.length >= requestsPerSecond) { // if statements ensures requests per second is maintained.
          await processRequestQueue()
      }
    }
    if(requestQueue.length > 0) { // checks if queue has any pending request if so call processRequestQueue
        await processRequestQueue()
    }
    console.log("Finished fetching all users")

};