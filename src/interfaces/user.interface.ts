// src/interfaces/user.interface.ts
export interface IAddress {
    city: string;
    state: string;
    country: string;
    street: string;
}

export interface IName {
    title: string;
    first: string;
    last: string;
}



export interface IItem {
    id: {
        name: string;
        value: string;
    };
    gender: string;
    name: IName;
    location: {
        street: IAddress;
        city: string;
        state: string;
        country: string;
        postcode: number | string;
        coordinates: {
            latitude: string;
            longitude: string;
        };
        timezone: {
            offset: string;
            description: string;
        };
    };
    email: string;
    dob: {
        date: string;
        age: number;
    };
    registered: {
        date: string;
        age: number;
    };
    phone: string;
    cell: string;
    picture: {
        large: string;
        medium: string;
        thumbnail: string;
    };
    nat: string;
    createdAt: Date;
    originalId?: { // Make originalId optional
        name: string;
        value: string;
    };    
}


export interface IPagination {
    total: number;
    limit: number;
    page: number;
    sortBy: string;
    items: IItem[];
}