// src/services/user.service.ts
import { User } from '../models/user.model';
import { IPagination, IItem } from '../interfaces/user.interface';


export const saveUsers = async (users: IItem[]): Promise<void> => {
    try {
        const usersToSave = users.map(user => ({
            ...user,
            originalId: user.id,
            id: undefined // Let Mongoose generate _id
        }));

        await User.insertMany(usersToSave);
        console.log(`${users.length} users saved to database.`);
    } catch (error) {
        console.error('Error saving users: ', error);
        // Handle error as needed (retry logic, etc.)
    }
};

export const getUsers = async (
    limit: number = 10,
    page: number = 1,
    sortBy: string = 'createdAt',
    search: any = {}
): Promise<IPagination> => {
    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) {
        for (const key in search) {
            if (search.hasOwnProperty(key) && search[key]) {
                query[`name.${key}`] = { $regex: new RegExp(search[key], 'i') }; // Case-insensitive search
            }
        }
    }

    const sortOptions: any = {};
    sortOptions[sortBy] = 1; // 1 for ascending

    const [users, total] = await Promise.all([
        User.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
        ,
        User.countDocuments(query)
    ]);


    return {
        total,
        limit,
        page,
        sortBy,
        items: users as IItem[], // Correctly type the items array
    };

};