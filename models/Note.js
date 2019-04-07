// Import mongoose
const mongoose = require("mongoose");
// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
const NoteSchema = new Schema({
  // `name` is of type String for the name of who leaves the note
  name: {
    type: String,
    required: true
  },
  // `title` is of type String for the title of the note
  title: {
    type: String,
    required: true
  },
  // `body` is of type String for the content of the note
  body: {
    type: String,
    required: true
  }
});

// This creates the Note model from the above schema, using mongoose's model method
const Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;