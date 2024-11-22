import { fetchUsers } from '../services/api.service';
import axios from 'axios';

jest.mock('axios');

describe('fetchUsers', () => {
    it('should fetch users successfully', async () => {
        const mockData = {
            results: [
                // Mock user data
                { name: 'test', gender: 'male' },
            ],
        };
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({ data: mockData });

        const users = await fetchUsers(5);
        expect(users).toEqual(mockData.results);
    });

    it('should handle errors', async () => {
        (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValue(new Error('Network error'));

        await expect(fetchUsers(5)).rejects.toThrow('Network error');
    });
});
