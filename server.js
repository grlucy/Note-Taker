// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

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
  let maxID = 0;
  for (const note of database) {
    let currentID = note.id;
    if (currentID > maxID) {
      maxID = currentID;
    }
  }
  newNote.id = maxID + 1;
  let tempDatabase = database;
  tempDatabase.push(newNote);
  fs.writeFile("./Develop/db/db.json", JSON.stringify(tempDatabase), err => {
    if (err) {
      console.log(err);
    } else {
      console.log("Added new note to db.json.");
      console.log(database);
      res.json(newNote);
    }
  });
});

// DELETE `/api/notes/:id`

app.delete("/api/notes/:id", function(req, res) {
  // Receive a query parameter containing the id of a note to delete
  const chosenID = req.params.id;
  // Read all notes from the 'db.json' file and remove the note with the given 'id' property
  let tempDB = database;
  for (let i = 0; i < tempDB.length; i++) {
    if (chosenID === tempDB[i].id.toString()) {
      tempDB.splice(i, 1);
    }
  }
  // Rewrite the notes to the 'db.json' file
  fs.writeFile("./Develop/db/db.json", JSON.stringify(tempDB), err => {
    if (err) {
      res.sendStatus(500);
    } else {
      console.log(`Deleted id # ${chosenID} from the database.`);
      console.log(database);
      res.sendStatus(200);
    }
  });
});

// -----------------------------------------------------
// Listener

app.listen(PORT, function() {
  console.log("App listening on http://localhost:" + PORT);
});
