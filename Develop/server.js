const express = require("express");
const path = require("path");
const process = require("process");
const fs = require("fs");
var db = require("./db/db.json");
const { v4: uuid } = require("uuid");
const oldNotes = JSON.parse(fs.readFileSync("./db/db.json"));
const app = express();
console.log(oldNotes);
console.log("Starting server......");
const PORT = process.env.PORT || 3001;

// SET UP MIDDLEWARE FOR DATA PARSING
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const notes = [
  {
    id: 1,
    name: "Reggie",
    age: 33,
    status: "active",
  },
  {
    id: 2,
    name: "Amy",
    age: 23,
    status: "active",
  },
  {
    id: 3,
    name: "Leslie",
    age: 19,
    status: "active",
  },
];

// SET PUBLIC FOLDER TO STATIC
app.use(express.static("public"));

// SET HTML ROUTES
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// DISPLAY EXISTING  API NOTES
app.get("/api/notes/", (req, res) => res.json(db));
console.log(db.length);
// CREATE NEW NOTE AND SAVE
app.post("/api/notes", (req, res) => {
  const data = req.body;
  data.id = uuid();
  db.push(data);
  console.log(db);

  fs.writeFile("./db/db.json", JSON.stringify(db), (err) => {
    console.log(err);
  });
  res.status(200).send(data.id);
});
// DELETE A NOTE
app.delete("/api/notes/:id", (req, res) => {
  const deleteNoteID = req.params.id;
  const updatedDB = db.filter((deleteNote) => deleteNote.id !== deleteNoteID);
  console.log(updatedDB);

  fs.writeFile("./db/db.json", JSON.stringify(updatedDB), (err) => {
    console.log(err);
  });
  res.end();
});

app.listen(PORT, () =>
  console.log(`Server is listening on port: http://localhost:${PORT}`)
);
