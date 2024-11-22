// src/models/user.model.ts
import { Schema, model, Document } from 'mongoose';
import { IItem } from '../interfaces/user.interface';

export const userSchema = new Schema<IItem & Document>({
    gender: String,
    name: {
        title: String,
        first: String,
        last: String,
    },
    location: {
        street: {
            number: Number,
            name: String,
        },
        city: String,
        state: String,
        country: String,
        postcode: Schema.Types.Mixed,
        coordinates: {
            latitude: String,
            longitude: String,
        },
        timezone: {
            offset: String,
            description: String,
        },
    },
    email: String,
    dob: {
        date: String,
        age: Number,
    },
    registered: {
        date: String,
        age: Number,
    },
    phone: String,
    cell: String,
    picture: {
        large: String,
        medium: String,
        thumbnail: String,
    },
    nat: String,
    originalId: {
        name: String,
        value: String,
    },    
    createdAt: { type: Date, default: Date.now },
});

export const User = model<IItem & Document>('User', userSchema);