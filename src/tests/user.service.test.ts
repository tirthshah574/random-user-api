import { getUsers, saveUsers } from '../services/user.service';
import { User } from '../models/user.model';
import { IItem } from '../interfaces/user.interface';

jest.mock('../models/user.model'); // Mock the User model

describe('UserService', () => {
    describe('saveUsers', () => {
        const mockUsers: IItem[] = [
            // ... your mock user data (make sure it conforms to IItem)
        ];

        it('should save users successfully', async () => {
            // Correct way to mock and assert:
            (User.insertMany as jest.Mock).mockResolvedValue(mockUsers as any); // "as any" is a workaround for complex typing issues

            await saveUsers(mockUsers);

            expect(User.insertMany).toHaveBeenCalledWith(mockUsers);
        });
    });


    describe('getUsers', () => {
         it('should return users with pagination', async () => {
           const mockUsers: IItem[] = []; // Correct type here
           const mockQuery = {
               sort: jest.fn().mockReturnValue({
                   skip: jest.fn().mockReturnValue({
                       limit: jest.fn().mockResolvedValue(mockUsers)
                   })
               })
             } as any


           (User.find as jest.Mock).mockReturnValue(mockQuery);

           (User.countDocuments as jest.Mock).mockResolvedValue(100);


           const users = await getUsers();

           expect(users.items).toEqual(mockUsers);

          });


        it('should apply search criteria correctly', async () => {
            const search = { first: 'John' };


            (User.find as jest.Mock).mockReturnValue({ sort: jest.fn().mockReturnValue({ skip: jest.fn().mockReturnValue({ limit: jest.fn().mockResolvedValue([]) }) }) } as any);
            (User.countDocuments as jest.Mock).mockResolvedValue(0);


            await getUsers(10, 1, 'createdAt', search);


            expect(User.find).toHaveBeenCalledWith({ "name.first": { '$regex': /John/i } });

        });

     });


});