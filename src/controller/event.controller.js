const Event = require("../models/event.model");

const createEvent = async (req, res) => {

    const {
        title,
        location,
        participantsLimit,
        availableTickets,
        price,
        category,
        description
    } = req.body

    const createdBy = req.userId

    if (!title || !location || !availableTickets || !price || !category || !description) {
        res.status(400).send({ message: "All the Fields Required" })
    }

    if (availableTickets <= 0) {
        return res.status(400).json({ message: "Available tickets must be greater than zero" });
    }

    if (participantsLimit <= 0) {
        return res.status(400).json({ message: "Participants limit must be greater than zero" });
    }

    try {
        const event = new Event({
            title,
            location,
            availableTickets,
            participantsLimit,
            price,
            category,
            description,
            participants: [],
            createdBy
        });
        await event.save();
        res.status(200).json({ message: "Event Created Successfully", data: event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).send({ message: "Events Retrieved", data: events });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getEventById = async (req, res) => {

    try {
        const id = req.params.id;

        if (id) {
            res.status(400).send({ message: "ID Required" })
        }

        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.status(200).send({ message: event })

    } catch (error) {
        res.status(500).send({ message: "Internal server Error", error: error.message })
    }

}

const updateEventById = async (req, res) => {
    const eventId = req.params.id;
    const updates = req.body;

    if (!eventId || !updates) {
        return res.status(400).send({ message: "ID and Updated Fields are required" })
    }
    try {

        const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, { new: true });

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).send({ message: "Data updated Successfully", data: updatedEvent });

    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error", error })
    }

}

const deleteEventById = async (req, res) => {

    const id = req.params.id;
    if (!id) {
        return res.status(400).send({ message: "ID Required" })
    }
    try {
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).send({ message: "Event Deleted Successfully", data: deletedEvent });
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error", error })
    }


}

const getMyEvents = async (req, res) => {
    try {
        const userId = req.userId;
        const events = await Event.find({ createdBy: userId });
        return res.status(200).send({ message: events });
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
};


module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEventById,
    deleteEventById,
    getMyEvents
}