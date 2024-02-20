import { Request, Response } from "express";

import { EntriesService } from "../../services/EntriesService";

import { HttpStatusCode } from "../../config/httpCodes";
import { entryType } from "../../models/Entries";

export class EntryController {
    public async registerInEntry(req: Request, res: Response) {
        try {
            const instructorId = req.body.instructorId;

            const createdAt = new Date(Date.now());

            if (
                instructorId === undefined ||
                instructorId === null ||
                instructorId === ""
            ) {
                return res.status(HttpStatusCode.BAD_REQUEST).send({
                    message: "body cannot be empty",
                });
            }

            const entryService = new EntriesService();

            const inEntries = await entryService.fetchEntries(
                instructorId,
                entryType.IN
            );

            const outEntries = await entryService.fetchEntries(
                instructorId,
                entryType.OUT
            );

            if (inEntries.length !== outEntries.length) {
                return res.status(HttpStatusCode.BAD_REQUEST).send({
                    message: "Existing Entries Invalid",
                });
            }

            if (inEntries.length > 0 && outEntries.length > 0) {
                if (
                    createdAt < inEntries[inEntries.length - 1].createdAt ||
                    createdAt < outEntries[outEntries.length - 1].createdAt
                ) {
                    return res.status(HttpStatusCode.BAD_REQUEST).send({
                        message: "In time conflicting with existing interval",
                    });
                }
            }

            const createdEntry = await entryService.registerEntry({
                instructorId,
                type: entryType.IN,
                createdAt,
            });

            if (createdEntry === false) {
                return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
                    message: "Incomplete body or content missing",
                });
            }

            return res.status(HttpStatusCode.OK).send(createdEntry);
        } catch (error: any) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
                message: error.message,
            });
        }
    }

    public async registerOutEntry(req: Request, res: Response) {
        try {
            const instructorId = req.body.instructorId;
            const createdAt = new Date(Date.now());

            if (
                instructorId === undefined ||
                instructorId === null ||
                instructorId === ""
            ) {
                return res.status(HttpStatusCode.BAD_REQUEST).send({
                    message: "body cannot be empty",
                });
            }

            const entryService = new EntriesService();

            const inEntries = await entryService.fetchEntries(
                instructorId,
                entryType.IN
            );
            const outEntries = await entryService.fetchEntries(
                instructorId,
                entryType.OUT
            );

            if (inEntries.length !== outEntries.length + 1) {
                return res.status(HttpStatusCode.BAD_REQUEST).send({
                    message: "Existing Entries Invalid",
                });
            }

            const lastInEntryCreatedAt = inEntries[inEntries.length - 1].createdAt;

            if (lastInEntryCreatedAt > createdAt) {
                return res.status(HttpStatusCode.BAD_REQUEST).send({
                    message: "Out time conflicting with existing interval",
                });
            }

            const createdEntry = await entryService.registerEntry({
                instructorId,
                type: entryType.OUT,
                createdAt,
            });

            if (createdEntry === false) {
                return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
                    message: "Incomplete body or content missing",
                });
            }

            return res.status(HttpStatusCode.OK).send(createdEntry);
        } catch (error: any) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
                message: error.message,
            });
        }
    }

    public async fetchTotalTimeInMonth(req: Request, res: Response) {
        try {
            const instructorId = req.params.instructorId;
            const month: number = parseInt(req.query.month?.toLocaleString() || "0");

            console.log("Month ", month);

            const testDate = new Date(2000, month - 1, 1);

            if (
                (!isNaN(testDate.getTime()) && testDate.getMonth() + 1 === month) ===
                false
            ) {
                return res.status(HttpStatusCode.BAD_REQUEST).send({
                    message: "Invalid month type",
                });
            }

            const entriesService = new EntriesService();

            const fetchedEntriesByMonth = await entriesService.fetchEntriesByMonth(
                instructorId,
                month
            );

            var length = 0;

            if (fetchedEntriesByMonth.length % 2 == 0)
                length = fetchedEntriesByMonth.length;
            else length = fetchedEntriesByMonth.length - 1;

            var totalTimeInMinutes:number=0

            for (var i = 0; i < fetchedEntriesByMonth.length; i += 2) {
                // Example date strings fetched from MongoDB
                const dateString1 = fetchedEntriesByMonth[i].createdAt; // Assuming UTC format
                const dateString2 = fetchedEntriesByMonth[i+1].createdAt;

                // Parse date strings into Date objects
                const date1 = new Date(dateString1);
                const date2 = new Date(dateString2);

                // Calculate the difference in milliseconds
                const differenceInMilliseconds = date2.getTime() - date1.getTime();

                // Convert milliseconds to other units if needed (e.g., seconds, minutes, hours, days)
                const differenceInMinutes = differenceInMilliseconds / (1000 * 60);

                totalTimeInMinutes+=parseInt(differenceInMinutes.toFixed(0));

            }
            const hours = Math.floor(totalTimeInMinutes / 60);
            const minutes = Math.floor(totalTimeInMinutes % 60);

            const formattedResult = `${hours} hours, ${minutes} minutes`;

            console.log(formattedResult);

            return res.status(HttpStatusCode.OK).send({
                instructorId,
                totalTime:formattedResult
            });
        } catch (error: any) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
                message: error.message,
            });
        }
    }
}
