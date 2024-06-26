const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');

const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
});

// GET Route for a specific tip
// notes.get('/:tip_id', (req, res) => {
//   const tipId = req.params.tip_id;
//   readFromFile('./db/notes.json')
//     .then((data) => JSON.parse(data))
//     .then((json) => {
//       const result = json.filter((tip) => tip.tip_id === tipId);
//       return result.length > 0
//         ? res.json(result)
//         : res.json('No tip with that ID');
//     });
// });

// DELETE Route for a specific tip
notes.delete('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/notes.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((note) => note.id !== noteId);

      // Save that array to the filesystem
      writeToFile('./db/notes.json', result);

      // Respond to the DELETE request
      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});

// POST Route for a new UX/UI tip
notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, './db/notes.json');
    res.json(`Note added successfully`);
  } else {
    res.error('Error in adding note');
  }
});

module.exports = notes;
