// Dependencies need to be installed 
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const notes = require("./db/db.json");


// Server
const app = express();
const PORT = process.env.PORT || 3004


// Urlencoded, built in middleware function in Express
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());


// Adds static middleware
app.use(express.static("./Develop/public"));

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);


// "GET" request
app.get("/api/notes", function(req, res) {
    readFileAsync("./db/db.json", "utf-8").then(function(data) {
        notes = [].concat(JSON.parse(data))
        res.json(notes);
    })
});

// "POST" request
app.post("/api/notes", function(req, res) {
    const note = req.body;
    readFileAsync("./db/db.json", "utf-8").then(function(data) {
        const notes = [].concat(JSON.parse(data));
        note.id = notes.length + 1
        notes.push(note);
        return notes
    }).then(function(notes) {
        writeFileAsync("./db/db.json", JSON.stringify(notes))
        res.json(note);
    })
});

// "DELETE" request
app.delete("./api/notes/:id", function(req, res) {
    const idDelete = parseInt(req.params.id);
    readFileAsync("/db/db.json", "utf-8").then(function(data) {
        const notes = [].concat(JSON.parse(data));
        const newNotesData = []
        for (let i = 0; i<notes.length; i++) {
            if(idDelete !== notes[i].id) {
                newNotesData.push(notes[i])
            }
        }
        return newNotesData
    }).then(function(notes) {
        writeFileAsync("/Develop/db/db.json", JSON.stringify(notes))
        res.send('successfully saved !!')
    })
})

// HTML routes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});


// Function to bind and listen the connections on the specified host and port
app.listen(PORT, () => {
    console.log("App is listening on PORT " + PORT);
});