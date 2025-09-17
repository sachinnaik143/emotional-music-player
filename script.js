// DOM Elements
const video = document.getElementById('video');
const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');
const musicPlayer = document.getElementById('musicPlayer');
const emotionText = document.getElementById('emotionText');
const emotionIcon = document.getElementById('emotionIcon');

const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');

const suggestionsList = document.getElementById('suggestions');
const toggleDetectionBtn = document.getElementById('toggleDetectionBtn');
// Music Playlists

// Define playlists for each emotion
const playlists = {
  happy: [
    "music/happy/Imogen Heap - The Happy Song - Official Music Video.mp3",
    "music/happy1.mp3",
    "music/happy2.mp3",
    "music/happy3.mp3"
  ],
  sad: [
    "music/sad/sad songs for sad people.mp3",
    "music/sad1.mp3",
    "music/sad2.mp3",
    "music/sad3.mp3"
  ],
  angry: [
    "music/angry/The Rolling Stones - Angry (Official Music Video).mp3",
    "music/angry1.mp3",
    "music/angry2.mp3",
    "music/angry3.mp3"
  ],
  fearful: [
    "music/fearful/Steps - Scared Of The Dark (Official Video).mp3",
    "music/fearful1.mp3",
    "music/fearful2.mp3",
    "music/fearful3.mp3"
  ],
  disgusted: [
    "music/disgusted/Disgusted.mp3",
    "music/disgusted1.mp3",
    "music/disgusted2.mp3",
    "music/disgusted3.mp3"
  ],
  surprised: ["music/surprised/Adhi Dha Surprisu Video  Robinhood  Nithiin, Sreeleela, Ketika Sharma, Venky Kudumula, GV Prakash.mp3",
    "music/surprised1.mp3",
    "music/surprised2.mp3",
    "music/surprised3.mp3"
  ],
  neutral: [
    "music/neutral/Lord Shiva Telugu Devotional Songs  Hara Om Namashivaya Songs Jukebox   Amulya Audios And Videos.mp3",
    "music/neutral1.mp3",
    "music/neutral2.mp3",
    "music/neutral3.mp3"
  ]
};




// Load Models
async function loadModels() {
  const MODEL_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights/';
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
  ]);
  console.log("✅ Models loaded!");
  startVideo();
}

// Start Camera
function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream)
    .catch(err => console.error("Camera error:", err));
}

// Run detection after video metadata is loaded
video.addEventListener('loadedmetadata', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  startDetectionLoop();
});

// Detection loop
function startDetectionLoop() {
  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  const interval = setInterval(async () => {
    try {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224 }))
        .withFaceExpressions();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detections.length > 0) {
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        // Draw faces
        resizedDetections.forEach(d => {
          const box = d.detection.box;
          const expressions = d.expressions;
          const emotion = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);

          // Box color
          const colorMap = { happy: "green", sad: "blue", angry: "red", surprised: "yellow", neutral: "gray" };
          ctx.strokeStyle = colorMap[emotion] || "white";
          ctx.lineWidth = 2;
          ctx.strokeRect(box.x, box.y, box.width, box.height);

          // Label
          ctx.font = "16px Arial";
          ctx.fillStyle = colorMap[emotion] || "#ff9800";
          ctx.fillText(emotion, box.x + 5, box.y > 20 ? box.y - 5 : box.y + 15);
        });

        // Largest face for music
        let largestFace = resizedDetections[0];
        let maxArea = 0;
        resizedDetections.forEach(d => {
          const area = d.detection.box.width * d.detection.box.height;
          if (area > maxArea) {
            maxArea = area;
            largestFace = d;
          }
        });

        const dominantEmotion = Object.keys(largestFace.expressions)
          .reduce((a, b) => largestFace.expressions[a] > largestFace.expressions[b] ? a : b);

        emotionText.innerText = `Detected Emotion: ${dominantEmotion}`;
        updateEmotionIcon(dominantEmotion);
        playSong(dominantEmotion);

      } else {
        emotionText.innerText = "No face detected";
      }
    } catch (err) {
      console.error("Detection error:", err);
    }
  }, 500);
}

// Update Emoji
function updateEmotionIcon(emotion) {
  const icons = { happy: "fa-face-smile", sad: "fa-face-frown", angry: "fa-face-angry", surprised: "fa-face-surprise", neutral: "fa-face-meh" };
  emotionIcon.className = `fa-solid ${icons[emotion] || "fa-face-meh"}`;
}

// Play Music
let lastPlayTime = 0;
const MIN_PLAY_TIME = 10000; // 10 seconds
let isStoppedManually = false; // NEW: block auto-play when stopped

function playSong(emotion) {
  const now = Date.now();

  // If user pressed Stop, don't auto-start music
  if (isStoppedManually) {
    console.log("🛑 Song stopped manually. Waiting for user to play again.");
    return;
  }

  // Prevent switching too quickly
  if (now - lastPlayTime < MIN_PLAY_TIME && !musicPlayer.paused) {
    console.log("⏳ Song still playing, ignoring new emotion...");
    return;
  }

  const playlist = playlists[emotion] || playlists.neutral;
  const song = playlist[Math.floor(Math.random() * playlist.length)];

  const filename = song.split('/').pop();
  const title = filename.replace(/\.(mp3|wav|ogg)$/i, '').replace(/[_-]/g, ' ');

  musicPlayer.src = song;
  musicPlayer.play().catch(e => console.warn("Autoplay blocked:", e));

  trackTitle.innerText = title;
  trackEmotion.innerText = `Playing for emotion: ${emotion}`;

  lastPlayTime = Date.now();
}

const musicSearchInput = document.getElementById('musicSearchInput');
const searchBtn = document.getElementById('searchBtn');

// Example: simple music database
const musicLibrary = [
  { title: "Happy Song 1", file: "music/happy/happy1.mp3" },
  { title: "Happy Song 2", file: "music/happy/happy2.mp3" },
  { title: "Sad Song 1", file: "music/sad/sad1.mp3" },
  { title: "Angry Song 1", file: "music/angry/angry1.mp3" },
  { title: "Surprised Song 1", file: "music/surprised/surprised1.mp3" }
];

let detectionActive = true; // detection starts ON

// Toggle button logic
// Toggle detection ON/OFF
toggleDetectionBtn.addEventListener('click', () => {
  detectionEnabled = !detectionEnabled;

  if (detectionEnabled) {
    toggleDetectionBtn.innerText = "Turn OFF Detection";
  } else {
    toggleDetectionBtn.innerText = "Turn ON Detection";
    stopMusic(); // stop current music when detection is off
  }
});

// Update detect loop
async function detectEmotion() {
  if (!detectionEnabled) return; // if OFF, skip detection

  const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions();

  if (detections.length > 0) {
    const expressions = detections[0].expressions;
    const emotion = Object.keys(expressions).reduce((a, b) => 
      expressions[a] > expressions[b] ? a : b
    );

    playMusicBasedOnEmotion(emotion);
  }
}

// Music control
function stopMusic() {
  musicPlayer.pause();
  musicPlayer.currentTime = 0;
  trackTitle.innerText = "Detection OFF";
  trackEmotion.innerText = "Emotion detection stopped ❌";
}

// Search function
function searchMusic(query) {
  const results = musicLibrary.filter(song =>
    song.title.toLowerCase().includes(query.toLowerCase())
  );

  if (results.length > 0) {
    musicPlayer.src = results[0].file;
    musicPlayer.play();
    trackTitle.innerText = results[0].title;
  } else {
    alert("No song found!");
  }
}

// Trigger search


// Show suggestions while typing
musicSearchInput.addEventListener('input', () => {
  const query = musicSearchInput.value.toLowerCase();
  suggestionsList.innerHTML = '';

  if (!query) {
    suggestionsList.style.display = 'none';
    return;
  }

  const results = musicLibrary.filter(song =>
    song.title.toLowerCase().includes(query)
  );

  if (results.length > 0) {
    results.forEach(song => {
      const li = document.createElement('li');
      li.textContent = song.title;
      li.addEventListener('click', () => {
        playSelectedSong(song);
        suggestionsList.style.display = 'none';
      });
      suggestionsList.appendChild(li);
    });
    suggestionsList.style.display = 'block';
  } else {
    suggestionsList.style.display = 'none';
  }
});
searchBtn.addEventListener('click', () => {
  const query = musicSearchInput.value.toLowerCase();
  const results = musicLibrary.filter(song =>
    song.title.toLowerCase().includes(query)
  );
  if (results.length > 0) {
    playSelectedSong(results[0]);
  } else {
    alert("No song found!");
  }
});

const voiceBtn = document.getElementById('voiceBtn');

voiceBtn.addEventListener('click', () => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert("Your browser does not support voice search!");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.start();

  recognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript;
    musicSearchInput.value = spokenText;

    // search and play song
    const results = musicLibrary.filter(song =>
      song.title.toLowerCase().includes(spokenText.toLowerCase())
    );
    if (results.length > 0) {
      playSelectedSong(results[0]);
    } else {
      alert("No song found!");
    }
  };
});

// Function to play a chosen song
function playSelectedSong(song) {
  musicPlayer.src = song.file;
  musicPlayer.play().catch(e => console.warn("Autoplay blocked:", e));
  trackTitle.innerText = song.title;
  trackEmotion.innerText = "Playing selected song 🎵";
  isStoppedManually = false; // allow playback
}



const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.start();

recognition.onresult = (event) => {
  const spokenText = event.results[0][0].transcript;
  musicSearchInput.value = spokenText;
  searchMusic(spokenText);
};

recognition.onerror = (event) => {
  console.error("Voice recognition error:", event.error);
};




// Manual Controls
playBtn.addEventListener('click', () => {
  isStoppedManually = false; // allow songs again
  musicPlayer.play();
});

stopBtn.addEventListener('click', () => musicPlayer.pause());

pauseBtn.addEventListener('click', () => {
  musicPlayer.pause();
  musicPlayer.currentTime = 0;
  isStoppedManually = true; // block auto-restart
});

// Initialize
loadModels();  