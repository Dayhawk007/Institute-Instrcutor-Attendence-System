import mongoose, { Document,model,Schema } from "mongoose";

enum entryType{
    IN="in",
    OUT="out"
}

interface Entry {
    instructorId:mongoose.Schema.Types.ObjectId
    type:entryType;
    createdAt:Date;
}

interface Entries extends Document{
    instructorId:mongoose.Schema.Types.ObjectId
    type:entryType;
    createdAt:Date;
}

const entriesSchema=new Schema<Entries>({
    instructorId:{type:mongoose.Schema.Types.ObjectId,ref:'instructor',required:true},
    type:{type:String,enum:entryType,required:true}
},{
    timestamps:true,
}
)

export const entriesModel=model<Entries>("Entries",entriesSchema);

export {Entry,entryType}