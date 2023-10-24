const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const app = express();
const port = 4000;

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5000'],
  };


// Set up MongoDB connection
mongoose.connect('mongodb+srv://bunyawat:Asd_0949823192@cluster0.nqv9e.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const audioSchema = new mongoose.Schema({
  filename: String,
  data: Buffer,
});

const Audio = mongoose.model('Audio', audioSchema);

// Configure Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors(corsOptions));

// Serve uploaded audio files
app.use('/uploads', express.static('uploads'));

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
  

  app.get('/audio', async (req, res) => {
    try {
      // Find all audio files in the database
      const audioFiles = await Audio.find({}, 'filename'); // You can select only the filename if you don't want to send the entire data
  
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
