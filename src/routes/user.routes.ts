import express from 'express';
import { getUsers } from '../controllers/user.controller';

export const userRoutes = express.Router();

userRoutes.get('/', getUsers);
