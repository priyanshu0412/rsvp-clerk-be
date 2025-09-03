const express = require("express")
const app = express()
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cors = require("cors")
const DBConnection = require("./db")
const { Webhook } = require("svix")
const User = require("./models/user.model")
require("dotenv").config()



// -------------------------- Body Parser --------------------------
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan("dev"))
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"]
}))



// -------------------------- DB Connection --------------------------
DBConnection()



// -------------------------- Test Route -------------------------- 
app.get("/", (req, res) => {
    res.status(200).send({ message: "First Route" })
})



// -------------------------- WebHook --------------------------
app.post('/api/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {

    try {
        console.log('Headers:', req.headers);
        console.log('Raw Body:', req.body.toString());
        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY)
        console.log("wh", wh)
        const payloadString = req.body.toString();
        const svixHeaders = req.headers;
        const evt = wh.verify(payloadString, svixHeaders);

        console.log('Webhook Event:', evt);
        const { id, ...attributes } = evt.data;
        const eventType = evt.type;

        if (eventType === 'user.created') {
            const userData = {
                clerkUserId: id,
                firstName: attributes.first_name,
                lastName: attributes.last_name,
                email: (attributes.email_addresses && attributes.email_addresses?.email_address) || '',
                photo: attributes.image_url
            };

            await User.findOneAndUpdate(
                { clerkUserId: id },
                userData,
                { upsert: true, new: true }
            );
        }

        if (eventType === 'user.deleted') {
            await User.findOneAndDelete({ clerkUserId: id });
        }

        res.status(200).json({ success: true });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }

})



// -------------------------- PORT & Listen -------------------------- 
const PORT = process.env.PORT || 3030

app.listen(PORT, () => {
    console.log(`Server started On localhost:${PORT}`)
})