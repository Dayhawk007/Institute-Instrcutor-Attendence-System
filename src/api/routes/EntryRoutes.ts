import express, { Router } from 'express';
import { EntryController } from '../controllers/EntryController';

export class EntryRoutes {
    private router: Router;
    private entryController: EntryController;

    constructor() {
        this.router = express.Router();
        this.entryController = new EntryController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/clock-in', this.entryController.registerInEntry);
        this.router.post("/clock-out",this.entryController.registerOutEntry);
        this.router.get("/:instructorId/total-time",this.entryController.fetchTotalTimeInMonth)
    }

    public getRouter(): Router {
        return this.router;
    }
}
