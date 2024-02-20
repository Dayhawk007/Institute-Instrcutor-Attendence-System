import mongoose from 'mongoose';
import dotenv from 'dotenv'

export class Database {
    private uri: string;

    constructor() {
        dotenv.config();
        this.uri = process.env.MONGO_DB_URI || "mongodb://127.0.0.1:27017";
    }

    public async connect(): Promise<void> {
        try {
            await mongoose.connect(this.uri);
            console.log('Connected to MongoDB on URI : ',this.uri);
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            process.exit(1);
        }
    }
}
