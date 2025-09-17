# 🎶 Emotion Based Music Player

An AI-powered music player that uses **real-time facial emotion detection** to play songs based on the user’s mood.  
It also includes **search functionality** and **voice assistance** to play any music you like.

---

## 🚀 Features

- 🎭 **Emotion Detection** using [face-api.js](https://github.com/justadudewhohacks/face-api.js)  
  - Detects emotions such as *happy, sad, angry, surprised, neutral, disgusted, fearful*.  
  - Automatically plays music based on detected mood.  

- 🎵 **Music Player**  
  - Local songs mapped to each emotion.  
  - Basic controls: **Play, Pause, Stop**.  
  - Continuous playback for a minimum of 30s (configurable).  

- 🔎 **Music Search Bar**  
  - Search songs by name.  
  - Autocomplete suggestions.  
  - Click on a suggestion to play instantly.  

- 🎙 **Voice Assistant**  
  - Search for songs using your microphone.  
  - Plays requested song automatically.  

- 🎥 **Webcam Integration**  
  - Detects your face in real time.  
  - Draws a red bounding box around detected faces.  
  - Can toggle detection **On/Off**.  

---

## 🛠️ Technologies Used

- **Frontend:** HTML, CSS, JavaScript  
- **AI Model:** [face-api.js](https://github.com/justadudewhohacks/face-api.js)  
- **Icons:** [Font Awesome](https://fontawesome.com/)  
- **Voice Recognition:** Web Speech API  

---

## 📂 Project Structure

emotional-music-player/
├── index.html # Main HTML file
├── style.css # Styling
├── script.js # JavaScript logic
├── models/ # Face-api.js models
├── songs/ # Your downloaded songs
└── README.md # Project documentation


---

## ▶️ How to Run

1. Clone this repository:
   ```bash
   git clone https://github.com/sachinnaik143/emotional-music-player.git
Navigate into the project folder:

bash
Copy code
cd emotional-music-player
Open index.html in your browser.
(Make sure you allow camera access for emotion detection.)

📸 Screenshots
(Add your own screenshots later)

✨ Future Improvements
Add playlist support

Stream music from online APIs (Spotify, YouTube, etc.)

Smarter emotion-to-music mapping
