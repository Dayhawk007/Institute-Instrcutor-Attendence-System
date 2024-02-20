import { Document,model,Schema } from "mongoose";

interface Instructor extends Document{
    name:string;
    username:string;
}

const instructorSchema=new Schema<Instructor>({
    name:{type:String,required:true},
    username:{type:String,required:true}
})

export const InstructorModel=model<Instructor>("Instructor",instructorSchema);