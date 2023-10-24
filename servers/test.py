import requests

# Replace with the URL of your API
api_url = "http://localhost:4000/upload"

# Replace with the path to your audio file
audio_file_path = "ABC.wav"

# Open the audio file as binary data
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
