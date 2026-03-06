import Invite from "../models/Invite.js"
import User from "../models/User.js"
import Note from "../models/Note.js"


export const sendInvite = async(req,res)=>{

const {noteId,email} = req.body

const user = await User.findOne({email})

if(!user){
return res.status(404).json("User not found")
}

const invite = await Invite.create({
note:noteId,
from:req.user,
to:user._id
})

res.json(invite)

}


export const getInvites = async(req,res)=>{

const invites = await Invite.find({
to:req.user,
status:"pending"
}).populate("note")

res.json(invites)

}


export const acceptInvite = async(req,res)=>{

const invite = await Invite.findById(req.params.id)

invite.status="accepted"

await invite.save()

const note = await Note.findById(invite.note)

note.collaborators.push(invite.to)

await note.save()

res.json("Invite accepted")

}


export const rejectInvite = async(req,res)=>{

const invite = await Invite.findById(req.params.id)

invite.status="rejected"

await invite.save()

res.json("Invite rejected")

}