const express = require('express');
const { bookEvent } = require('../controller/bookEvent.controller');
const clerkAuthMiddleware = require('../middleware/clerkAuthMiddleware');
const router = express.Router();

router.post("/event-book", clerkAuthMiddleware, bookEvent)


module.exports = router;