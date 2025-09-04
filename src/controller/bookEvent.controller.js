const Event = require('../models/event.model');

const bookEvent = async (req, res) => {
    try {
        const { eventId, emails } = req.body;


        if (!eventId || !emails || !Array.isArray(emails) || emails.length === 0) {
            return res.status(400).send({ message: "Event ID and participant emails required" });
        }

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).send({ message: "Event not found" });

        // participantsLimit check
        if (emails.length > event.participantsLimit) {
            return res.status(400).send({ message: `Booking limit is ${event.participantsLimit} per request.` });
        }

        // availableTickets check
        if (emails.length > event.availableTickets) {
            return res.status(400).send({ message: "Not enough tickets available" });
        }

        // Check for duplicate emails in request
        const uniqueEmails = new Set(emails);
        if (uniqueEmails.size !== emails.length) {
            return res.status(400).send({ message: "Duplicate emails in booking request!" });
        }

        // Check already booked emails in event
        const alreadyBooked = event.participants.filter(p =>
            emails.includes(p.email)
        ).map(p => p.email);

        if (alreadyBooked.length > 0) {
            return res.status(400).send({
                message: `These emails already have tickets: ${alreadyBooked.join(', ')}`
            });
        }

        // Book tickets: Add participants, reduce tickets
        emails.forEach(email => {
            event.participants.push({ email }); // clerkUserId optional, agar hai toh bhejo
        });
        event.availableTickets -= emails.length;

        await event.save();
        return res.status(200).send({ message: "Booked successfully!", data: event });
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = { bookEvent };
