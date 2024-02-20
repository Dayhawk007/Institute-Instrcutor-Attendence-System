import mongoose from "mongoose";
import { Entry, entriesModel, entryType } from "../models/Entries";

export class EntriesService{

    async registerEntry(data:Entry){

        if(data==undefined){
            return {
                "message":"Body cannot be empty"
            }
        }

        if(!Object.values(entryType).includes(data.type)){
            return false
        }

        if(data.instructorId===undefined || ""){
            return false
        }

        const createdEntry=await entriesModel.create(data);

        return createdEntry;
    }

    async fetchEntries(instructorId:string,type:entryType):Promise<any>{
        if(instructorId===null || instructorId===""){
            return false
        }
        if(!Object.values(entryType).includes(type)){
            return false
        }

        const fetchedEntries=await entriesModel.find({
            instructorId,
            type
        })

        return fetchedEntries

    }

    async fetchEntriesByMonth(instructorId:string,month:number):Promise<any>{

        if(instructorId==="" || instructorId==undefined){
            return false
        }
        if(month<1 && month>12){
            return false
        }


        const aggregatedResult=await entriesModel.aggregate([
            {
                $match: {
                    instructorId:new mongoose.Types.ObjectId(instructorId),
                    createdAt: { $exists: true, $ne: null },
                }
            },
            {
                $project: {
                    instructorId: 1,
                    type: 1,
                    createdAt: 1,
                    month: { $month: '$createdAt' }
                }
            },
            {
                $match:{
                    'month':month
                }
            }
        ])

        console.log(aggregatedResult);

        return aggregatedResult
    }
}

