import express, { Application } from 'express';
import dotenv from 'dotenv'
import { EntryRoutes } from './api/routes/EntryRoutes';

export class App {
    private app: Application;
    private port:Number;

    constructor() {
        this.app = express();
        this.config();
        this.port=parseInt(process.env.PORT || "5000");
        this.setupRoutes();
    }

    private config(): void {
        dotenv.config();
        this.app.use(express.json());
    }

    private setupRoutes(): void {
        const entryRoutes=new EntryRoutes();
        this.app.use("/api/entries",entryRoutes.getRouter())
    }

    public async start(): Promise<void> {
        try {
            this.app.listen(this.port, () => {
                console.log(`Server is running on port ${this.port}`);
            });
        } catch (error) {
            console.log("Error while starting server ",error)
        }
    }
}

