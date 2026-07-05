const express = require("express");

const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(express.json());
app.use(cors());

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const PORT = 3001;

// Hardcoded phonebook data
let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// GET /api/persons
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

// GET /api/persons/:id
app.get("/api/persons/:id", (req, res) => {
  const { id } = req.params;

  const person = persons.find((person) => person.id === id);

  if (!person) {
    return res.status(404).json({
      error: "Person not found",
    });
  }

  res.json(person);
});

// DELETE /api/persons/:id
app.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params;

  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

// POST /api/persons
app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  // Validate required fields
  if (!name || !number) {
    return res.status(400).json({
      error: "name or number is missing",
    });
  }

  // Validate unique name
  const existingPerson = persons.find((person) => person.name === name);

  if (existingPerson) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000000).toString(),
    name,
    number,
  };

  persons.push(newPerson);

  res.status(201).json(newPerson);
});

// GET /info
app.get("/info", (req, res) => {
  const personCount = persons.length;
  const currentTime = new Date();

  res.send(`
    <p>Phonebook has info for ${personCount} people</p>
    <p>${currentTime}</p>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});