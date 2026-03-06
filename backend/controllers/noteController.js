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


/* GET NOTES + SEARCH */

export const getNotes = async(req,res)=>{

const search = req.query.search

let query = {
$or:[
{owner:req.user},
{collaborators:req.user}
]
}

if(search){

query.$text = { $search: search }

}

const notes = await Note.find(query)

res.json(notes)

}


/* UPDATE NOTE */

export const updateNote = async(req,res)=>{

const note = await Note.findByIdAndUpdate(
req.params.id,
req.body,
{new:true}
)

res.json(note)

}


/* DELETE NOTE */

export const deleteNote = async(req,res)=>{

await Note.findByIdAndDelete(req.params.id)

res.json({message:"Note deleted"})

}


/* INVITE COLLABORATOR */

export const inviteCollaborator = async(req,res)=>{

const {noteId,email} = req.body

const user = await User.findOne({email})

if(!user){
return res.status(404).json("User not found")
}

const note = await Note.findById(noteId)

if(!note.collaborators.includes(user._id)){
note.collaborators.push(user._id)
}

await note.save()

res.json(note)

}