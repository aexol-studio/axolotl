import { User } from "./models.js";
export type UserModel = User & {
    password: string;
    token: string;
};
export declare const db: {
    users: UserModel[];
};
