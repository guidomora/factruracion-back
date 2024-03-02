import mongoose from "mongoose";

interface ConectOptions {
    mongoUrl: string;
    dbName: string;
}

export const connect = async (options: ConectOptions) => {
    const { mongoUrl, dbName } = options;
    try {
        await mongoose.connect(mongoUrl, {
            dbName,
        });
        console.log("Connected to mongoDB");
    } catch (error) {
        console.log("Error connecting to mongoDB", error);
        throw error;
    }
}