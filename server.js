// Dependencies need to be installed 
const express = require('express');
const fs = require('fs');
const path = require('path');
const { readFromFile, readAndAppend } = require('./fsUtils');
const { v4: uuidv4 } = require('uuid');
const { json } = require('express');

// Server
const app = express();
const PORT = process.env.PORT || 3004




// Urlencoded, built in middleware function in Express
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Adds static middleware
app.use(express.static('public'));


// "GET" request
app.get('/api/notes', (req, res) => {
    console.log("In GET route.")
    readFromFile(path.join(__dirname, "./db/db.json")).then((data) => {
        console.log(data);
        res.send(data)});
});

// "POST" request
app.post('/api/notes', (req, res) => {
    console.log(req.body)
    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };

        readAndAppend(newNote, './db/db.json');
        res.json("Succesfully added Note!!")
    } else {
        res.error('Adding note error...')
    }
});

// "DELETE" request
app.delete("/api/notes/:id", function(req, res) {
    const idDelete = req.params.id;
    fs.readFile("./db/db.json", (error, data) => {
        if (error){
            console.log(error)
        }
        const notes = JSON.parse(data);
        const newNotesData = []
        for (let i = 0; i<notes.length; i++) {
            if(idDelete !== notes[i].id) {
                newNotesData.push(notes[i])
            }
        }
        console.log(newNotesData);
        fs.writeFile("./db/db.json", JSON.stringify(newNotesData), (error) => {
            if (error){
                console.log(error) 
            }
            res.send('successfully saved !!')
        })
    }) 
})

// HTML routes
app.get('/notes', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});


// Function to bind and listen the connections on the specified host and port
app.listen(PORT, () => {
    console.log("App is listening on PORT " + PORT);
});