const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid');
var fs = require('fs');
const dbJson = require('./db/db.json');

const app = express();
const PORT = 3001;

app.use(express.static('public'));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for a new note`);
    res.status(200).json(dbJson);
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uuid(),
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            }else {
                const parsedNotes = JSON.parse(data);

                parsedNotes.push(newNote);

                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4),
                (writeErr) =>
                    writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
                );
            }
        
        });

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);

    } else {
        res.status(500).json('Error in adding note');

    }
});

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);
