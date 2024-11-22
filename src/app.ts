import express from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { connect } from 'mongoose';
import { userRoutes } from './routes/user.routes';
import { config } from './config/config.service';
import { scheduleUserFetch } from './utils/scheduler';
import { errorHandler } from './middlewares/error.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/users', userRoutes); // Assuming /users as the base path for user routes

// Global Error Handler
app.use(errorHandler);

// Connect to MongoDB

async function main() {
    try {
        await connect(config.mongoURI);

        console.log('Connected to MongoDB');

        app.listen(port, async () => {
            console.log(`Server is running on port ${port}`);

            await scheduleUserFetch();
        });
    } catch (error: any) {
        console.error('Database Connection Error:' + error.message);
    }
}

main();
