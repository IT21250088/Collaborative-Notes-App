import express from "express"

import {
sendInvite,
getInvites,
acceptInvite,
rejectInvite
} from "../controllers/inviteController.js"

import {auth} from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/",auth,sendInvite)

router.get("/",auth,getInvites)

router.put("/accept/:id",auth,acceptInvite)

router.put("/reject/:id",auth,rejectInvite)

export default router