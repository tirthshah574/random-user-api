import { Request, Response, NextFunction } from 'express';
import { getUsers as getUserService } from '../services/user.service';
import { User, userSchema } from '../models/user.model';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        let sortBy = (req.query.sortBy as string) || 'createdAt';
        const searchParams = req.query.search;

        let search: Record<string, any> = {};
        if (searchParams) {
            try {
                search = JSON.parse(searchParams as string);
            } catch (err) {
                return res.status(400).json({ error: "Invalid search JSON" });
            }
        }

        const query: any = {};
        for (const field in search) {
            if (search.hasOwnProperty(field) && search[field]) {
                if (field === 'name') {
                    query['name'] = { $regex: new RegExp(search[field], 'i') };
                } else if (field === 'age') {
                    query[`dob.age`] = Number(search[field]);
                } else if (field === 'country') {
                    query['location.country'] = { $regex: new RegExp(search[field], 'i') };
                } else if (field === 'dob') {
                    query[`dob.date`] = { $regex: new RegExp(search[field], 'i') };
                } else {
                    query[field] = { $regex: new RegExp(search[field], 'i') };
                }
            }
        }

        let finalSortBy = 'createdAt'; 
        if (sortBy) {
            const sortOrder = sortBy.startsWith('-') ? -1 : 1;
            const sortField = sortBy.startsWith('-') ? sortBy.substring(1) : sortBy;

            const validSortFields = Object.keys(userSchema.paths).filter(path => !['_id', '__v'].includes(path));

            if (validSortFields.includes(sortField)) {
                 finalSortBy = sortBy;
             }
        }



        const users = await getUserService(limit, page, finalSortBy, query);

        res.json(users);
    } catch (error) {
        next(error);
    }
};
