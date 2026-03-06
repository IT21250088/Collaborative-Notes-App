import Note from "../models/Note.js"
import User from "../models/User.js"

export const createNote = async(req,res)=>{

const note = await Note.create({
title:req.body.title,
content:req.body.content,
owner:req.user
})

res.json(note)

}

export const getNotes = async(req,res)=>{

const notes = await Note.find({
$or:[
{owner:req.user},
{collaborators:req.user}
]
})

res.json(notes)

}

export const updateNote = async(req,res)=>{

const note = await Note.findByIdAndUpdate(
req.params.id,
req.body,
{new:true}
)

res.json(note)

}

export const deleteNote = async(req,res)=>{

await Note.findByIdAndDelete(req.params.id)

res.json({message:"deleted"})

}

export const inviteCollaborator = async(req,res)=>{

const {noteId,email} = req.body

const user = await User.findOne({email})

if(!user) return res.status(404).json("User not found")

const note = await Note.findById(noteId)

note.collaborators.push(user._id)

await note.save()

res.json(note)

}