const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const app = express();
require('dotenv').config();


// Set up MongoDB connection
mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const audioSchema = new mongoose.Schema({
  filename: String,
  data: Buffer,
});

// Create a Mongoose model for notes
const noteSchema = new mongoose.Schema({
  songname: String,
  content: [String],
});

const Audio = mongoose.model('Audio', audioSchema);
const Note = mongoose.model('Note', noteSchema);


// Configure Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to add custom headers
app.use((req, res, next) => {
  res.setHeader('Content-Type','application/json');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, PATCH, DELETE, POST, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  next();
});

// Serve uploaded audio files
app.use('/uploads', express.static('uploads'));
app.use(express.json()); 

app.get('/', (req, res) =>  {
  res.send("RUNNING API V2");
});

// Route for uploading audio files
app.post('/upload', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No audio file uploaded');
    }

    const newAudio = new Audio({
      filename: req.file.originalname,
      data: req.file.buffer,
    });

    await newAudio.save();
    res.send('Audio file uploaded and saved to MongoDB');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading and saving the audio file');
  }
});

app.post('/get_notes', async (req, res) => {
  try {
    const { notes } = req.body; // Extract the 'notes' property from the request body

    if (!notes || !Array.isArray(notes)) {
      return res.status(400).send('Invalid input. Expecting an object with a "notes" property that contains an array of strings.');
    }

    // Save each note in the array to MongoDB
    const newNote = new Note({songname : req.body.songname ,content: notes });
    await newNote.save();

    res.status(200).send('Notes saved successfully'); // Respond with a success message
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving notes');
  }
});

app.get('/audio/:audioId', async (req, res) => {
    try {
      const audioId = req.params.audioId;
  
      // Find the audio data in the database by its ObjectId
      const audio = await Audio.findById(audioId);
  
      if (!audio) {
        return res.status(404).send('Audio not found');
      }
  
      // Set the response headers and send the audio data
      res.setHeader('Content-Type', 'audio/wav'); // Adjust the content type as needed
      res.setHeader('Content-Disposition', `attachment; filename="${audio.filename}"`);
      res.end(audio.data, 'binary');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving and serving audio data');
    }
  });

  app.get('/audioname/:filename', async (req, res) => {
    try {
      const requestedFilename = req.params.filename;
  
      // Find the audio data in the database by filename
      const audio = await Audio.findOne({ filename: requestedFilename });
  
      if (!audio) {
        return res.status(404).send('Audio not found');
      }
      // Set the response headers and send the audio data
      res.setHeader('Content-Type', 'audio/wav'); // Adjust the content type as needed
      res.setHeader('Content-Disposition', `attachment; filename="${audio.filename}"`);
      res.end(audio.data, 'binary');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving and serving audio data');
    }
  });

  app.get('/get_notes/:noteId', async (req, res) => {
    try {
      const noteId = req.params.noteId;
  
      // Find the note in the database by its ID
      const note = await Note.findById(noteId);
  
      if (!note) {
        return res.status(404).send('Note not found');
      }
  
      // Send the note as a JSON response
      res.status(200).json(note.content);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving note');
    }
  });
  
  app.get('/getNotesByName/:songname', async (req, res) => {
    try {
      const requestSongname = req.params.songname;
      console.log(requestSongname);
      const notes = await Note.findOne({ songname: requestSongname });
      console.log(notes);

      if (!notes) {
        return res.status(404).send('Note not found');
      }

      let data = {
        id : notes._id,
        songname : notes.songname,
        data : notes.content
      };
  
      // Send the note as a JSON response
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving note');
    }
  });

  app.get('/audio', async (req, res) => {
    try {
      // Find all audio files in the database
      const audioFiles = await Note.find({}, 'songname'); // You can select only the filename if you don't want to send the entire data
  
      if (audioFiles.length === 0) {
        return res.status(404).send('No audio files found');
      }
  
      // Send the list of audio filenames as a JSON response
      res.status(200).json(audioFiles);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving audio files');
    }
  });

app.listen(4000, () => {
  console.log(`Server is running on port 4000`);
});

module.exports = app;
