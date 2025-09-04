const express = require("express")
const { createEvent, getAllEvents, getEventById, updateEventById, deleteEventById } = require("../controller/event.controller")
const clerkAuthMiddleware = require("../middleware/clerkAuthMiddleware")
const router = express.Router()

router.post("/", clerkAuthMiddleware, createEvent)
router.get("/", getAllEvents)
router.get("/:id", clerkAuthMiddleware, getEventById)
router.patch("/:id", clerkAuthMiddleware, updateEventById)
router.delete("/:id", clerkAuthMiddleware, deleteEventById)
router.get("/my-events", clerkAuthMiddleware, getMyEvents)

module.exports = router