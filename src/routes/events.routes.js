const express = require("express")
const { createEvent, getAllEvents, getEventById, updateEventById, deleteEventById, getMyEvents } = require("../controller/event.controller")
const clerkAuthMiddleware = require("../middleware/clerkAuthMiddleware")
const router = express.Router()

router.get("/", getAllEvents)
router.get("/my-events", clerkAuthMiddleware, getMyEvents)
router.get("/:id", clerkAuthMiddleware, getEventById)
router.post("/", clerkAuthMiddleware, createEvent)
router.patch("/:id", clerkAuthMiddleware, updateEventById)
router.delete("/:id", clerkAuthMiddleware, deleteEventById)

module.exports = router