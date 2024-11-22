import axios from 'axios';
import { config } from '../config/config.service';
import { IItem } from '../interfaces/user.interface';

export const fetchUsers = async (results: number = 5000): Promise<IItem[]> => {
    try {
        const response = await axios.get(`${config.apiUrl}?results=${results}`);

        return response.data.results;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; // Re-throw the error to be handled elsewhere
    }
};

// Add rate limiting logic here using promises, delays, etc.
// ... (rate limiting and batching logic as described in the detailed solution)
