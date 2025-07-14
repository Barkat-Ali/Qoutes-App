const express=require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Quote = require('./modules/module.js');
const app = express();
app.use(express.json());
app.use(cors());

// Connect to Mongoose
mongoose.connect('mongodb://localhost:27017/quotesDB').then(()=>{
    console.log("Connect to mongoose")
    app.listen("8000",()=>{
        console.log("Server is running")
    })
});
//Display Quotes
app.get('/quotes', async (req, res) => {
    try {
        const approvedQuotes = await Quote.find({ approved: true });
        res.json(approvedQuotes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching approved quotes", error });
    }
});

//Handle Submmission
app.post('/submit', async (req, res) => {
    const { text, author } = req.body;
    try {
        const newQuote = new Quote({ text, author });
        await newQuote.save();
        res.json({ message: 'Quote submitted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting quote', error });
    }
});
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1234";

// Admin login route
app.post("/admin-login", (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

// Admin routes
app.get("/admin/quotes", async (req, res) => {
    try {
        const quotes = await Quote.find({ approved: false });
        res.json(quotes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching quotes", error });
    }
});

app.put("/admin/approve/:id", async (req, res) => {
    try {
        await Quote.updateOne({ _id: req.params.id }, { $set: { approved: true } });
        res.json({ message: "Quote approved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error approving quote", error });
    }
});

app.delete("/admin/delete/:id", async (req, res) => {
    try {
        await Quote.deleteOne({ _id: req.params.id });
        res.json({ message: "Quote deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting quote", error });
    }
});