// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const appendFileAsync = util.promisify(fs.appendFile);

// -----------------------------------------------------
// Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// -----------------------------------------------------
// Data

const database = require("./Develop/db/db.json");

// -----------------------------------------------------
// Routes

// GET `*` - Should return the `index.html` file
// ---- DON'T NEED A GET FOR INDEX.HTML SINCE USING EXPRESS.STATIC ----

app.use(express.static("Develop/public"));

// GET `/notes` - Should return the `notes.html` file

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/Develop/public/notes.html"));
});

// GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON

app.get("/api/notes", function(req, res) {
  return res.json(database);
});

// POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client

app.post("/api/notes", function(req, res) {
  const newNote = req.body;
  console.log(newNote);
  let maxID = 0;
  for (const note of database) {
    let currentID = note.id;
    if (currentID > maxID) {
      maxID = currentID;
    }
  }
  newNote.id = maxID + 1;
  console.log(newNote);
  database.push(newNote);
  res.json(newNote);
});

// DELETE `/api/notes/:id` - Should recieve a query paramter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file

// -----------------------------------------------------
// Listener

app.listen(PORT, function() {
  console.log("App listening on http://localhost:" + PORT);
});
