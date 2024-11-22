import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/user-db',
    apiUrl: process.env.API_URL || 'https://randomuser.me/api/',
    requestsPerSecond: parseInt(process.env.REQUESTS_PER_SECOND || '5'),
    batchSize: parseInt(process.env.BATCH_SIZE || '300'),
    batchSleepTime: parseInt(process.env.BATCH_SLEEP_TIME || '30'),
    requestPerBatch: parseInt(process.env.REQUEST_PER_BATCH || '5'),
};
