import mongoose from "mongoose"

const noteSchema = new mongoose.Schema({

title:String,

content:String,

owner:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

collaborators:[
{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
}
]

},{timestamps:true})

noteSchema.index({title:"text",content:"text"})

export default mongoose.model("Note",noteSchema)