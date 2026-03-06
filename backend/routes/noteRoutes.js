import express from "express"

import {
createNote,
getNotes,
updateNote,
deleteNote,
inviteCollaborator
} from "../controllers/noteController.js"

import {auth} from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/",auth,getNotes)
router.post("/",auth,createNote)
router.put("/:id",auth,updateNote)
router.delete("/:id",auth,deleteNote)
router.post("/invite",auth,inviteCollaborator)

export default router