const express = require("express");

const app = express();
const PORT = 3000;


app.use(express.json());


let registrations = [
    {
        id: 501,
        participantName: "Riya Sharma",
        eventName: "Tech Fest",
        department: "CSE",
        ticketCount: 2,
        paymentStatus: "Paid"
    },
    {
        id: 502,
        participantName: "Arjun Mehta",
        eventName: "Code Sprint",
        department: "IT",
        ticketCount: 3,
        paymentStatus: "Pending"
    },
    {
        id: 503,
        participantName: "Neha Verma",
        eventName: "Tech Fest",
        department: "ECE",
        ticketCount: 1,
        paymentStatus: "Paid"
    }
];


function validateRegistration(data) {
    const {
        participantName,
        eventName,
        department,
        ticketCount,
        paymentStatus
    } = data;

    if (
        typeof participantName !== "string" ||
        !participantName.trim() ||
        typeof eventName !== "string" ||
        !eventName.trim() ||
        typeof department !== "string" ||
        !department.trim() ||
        !Number.isInteger(ticketCount) ||
        ticketCount <= 0 ||
        !["Paid", "Pending"].includes(paymentStatus)
    ) {
        return false;
    }

    return true;
}


app.get("/api/registrations", (req, res) => {
    res.status(200).json(registrations);
});

app.post("/api/registrations", (req, res) => {

    if (!validateRegistration(req.body)) {
        return res.status(400).json({
            message: "Invalid registration data"
        });
    }

    const newRegistration = {
        id: registrations.length > 0
            ? Math.max(...registrations.map(r => r.id)) + 1
            : 501,
        participantName: req.body.participantName.trim(),
        eventName: req.body.eventName.trim(),
        department: req.body.department.trim(),
        ticketCount: req.body.ticketCount,
        paymentStatus: req.body.paymentStatus
    };

    registrations.push(newRegistration);

    res.status(201).json({
        message: "Registration created successfully",
        registration: newRegistration
    });
});


app.get("/api/registrations/pending", (req, res) => {

    const pendingRegistrations = registrations.filter(
        r => r.paymentStatus === "Pending"
    );

    res.status(200).json(pendingRegistrations);
});


app.get("/api/registrations/filter", (req, res) => {

    const department = req.query.department;

    if (!department) {
        return res.status(400).json({
            message: "Please provide department"
        });
    }

    const filteredRegistrations = registrations.filter(
        r => r.department.toLowerCase() === department.toLowerCase()
    );

    res.status(200).json(filteredRegistrations);
});


app.get("/api/registrations/:id", (req, res) => {

    const id = Number(req.params.id);

    const registration = registrations.find(
        r => r.id === id
    );

    if (!registration) {
        return res.status(404).json({
            message: "Registration not found"
        });
    }

    res.status(200).json(registration);
});


app.put("/api/registrations/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = registrations.findIndex(
        r => r.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Registration not found"
        });
    }

    if (!validateRegistration(req.body)) {
        return res.status(400).json({
            message: "Invalid registration data"
        });
    }

    registrations[index] = {
        id: id,
        participantName: req.body.participantName.trim(),
        eventName: req.body.eventName.trim(),
        department: req.body.department.trim(),
        ticketCount: req.body.ticketCount,
        paymentStatus: req.body.paymentStatus
    };

    res.status(200).json({
        message: "Registration updated successfully",
        registration: registrations[index]
    });
});


app.delete("/api/registrations/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = registrations.findIndex(
        r => r.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Registration not found"
        });
    }

    registrations.splice(index, 1);

    res.status(200).json({
        message: "Registration deleted successfully"
    });
});


app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400) {
        return res.status(400).json({
            message: "Invalid JSON format"
        });
    }

    res.status(500).json({
        message: "Internal Server Error"
    });
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});