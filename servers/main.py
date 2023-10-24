from flask import Flask, request, jsonify
from flask_cors import CORS
import random
from pydub import AudioSegment
import numpy as np
import requests

app = Flask(__name__)
api_url = "http://localhost:4000/upload"
CORS(app, resources={r"/receive_data": {"origins": "http://localhost:3000"}})

# This dictionary will be used to store data
stored_data = {}


key_to_frequency = {
    'C4': 261.63,  # C4
    'C4#' : 277.2, # C4#
    'D4': 293.66,  # D4
    'D4#': 311.1,  # D4#
    'E4': 329.63,  # E4
    'F4': 349.23,  # F4
    'F4#': 370.0,  # F4# 
    'G4': 392.00,  # G4
    'G4#': 415.3,  # G4#
    'A4': 440.00,  # A4
    'A4#': 466.2,  # A4#
    'B4': 493.88,  # B4
    'C5': 523.25,  # C5
    'C5#' : 554.4, # C5#
    'D5': 587.33,  # D5
    'D5#': 622.3,  # D5#
    'E5': 659.26,  # E5
    'F5': 698.46,  # F5
    'F5#': 740.0,  # F5#
    'G5': 783.99,  # G5
    'G5#': 830.6,  # G5#
    'A5': 880.00,  # A5
    'A5#': 932.3,  # A5# 
    'B5': 987.77,  # B5
}

# Endpoint for receiving data
@app.route('/receive_data', methods=['POST'])
def receive_data():
    stored_data = {}
    data = request.get_json()

    songname = data.get('songname')
    datas = data.get('datas')

    if songname and datas:
        # Store the received data in the dictionary
        stored_data[songname] = datas
        songname = songname
        audio_file_path = "%s.wav"%songname
        generate_music_from_keyboard(songname,datas)

        with open(audio_file_path, "rb") as file:
            audio_data = file.read()
        # Send a POST request to the API with the audio file
        response = requests.post(api_url, files={"audio": (audio_file_path, audio_data)})

        # Check the response
        if response.status_code == 200:
            print("Audio file uploaded and saved to MongoDB")
        else:
            print("Error uploading and saving the audio file")
            print(response.text)    
        return jsonify({"message": "Data received and stored successfully", "data":{"name" : songname, "data":datas}})
    else:
        return jsonify({"error": "Invalid data format"})

# Endpoint to retrieve stored data
@app.route('/get_data/<songname>', methods=['GET'])
def get_data(songname):
    if songname in stored_data:
        return jsonify({"songname": songname, "datas": stored_data[songname]})
    else:
        return jsonify({"error": "Data not found"})

def generate_music_from_keyboard(songnames,datass):
    print("Type keys to play notes. Press 'q' to quit.")
    audio_segments = []
    for i in datass:
        print(i)
        key = i.strip()

        frequency = key_to_frequency.get(key, None)
        if frequency:
            fe = random.uniform(0, 1)
            print(fe)
            audio_segments.append(generate_audio_segment(frequency, fe))

    # Concatenate audio segments
    final_audio = sum(audio_segments)

    # Save the audio as an MP3 file
    final_audio.export("%s.wav"%songnames, format="wav")


def generate_audio_segment(frequency, duration=0.25):
    samples = np.sin(2 * np.pi * frequency * np.arange(int(44100 * duration)) / 44100)
    audio_data = (samples * 32767.0).astype(np.int16)  # Convert to 16-bit PCM
    return AudioSegment(audio_data.tobytes(), frame_rate=44100, sample_width=audio_data.dtype.itemsize, channels=1)

if __name__ == '__main__':
    app.run(debug=True)
