import mongoose from "mongoose"

const inviteSchema = new mongoose.Schema({

note:{
type:mongoose.Schema.Types.ObjectId,
ref:"Note"
},

from:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

to:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

status:{
type:String,
enum:["pending","accepted","rejected"],
default:"pending"
}

},{timestamps:true})

export default mongoose.model("Invite",inviteSchema)