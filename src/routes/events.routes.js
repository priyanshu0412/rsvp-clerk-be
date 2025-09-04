const express = require("express")
const { createEvent, getAllEvents, getEventById, updateEventById, deleteEventById } = require("../controller/event.controller")
const clerkAuthMiddleware = require("../middleware/clerkAuthMiddleware")
const router = express.Router()

router.post("/", clerkAuthMiddleware, createEvent)
router.get("/", getAllEvents)
router.get("/:id", getEventById)
router.patch("/:id", updateEventById)
router.delete("/:id", deleteEventById)

module.exports = router