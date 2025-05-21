
function toggleLessonMenu() {
  document.getElementById('welcome-screen').style.display = 'none';
  document.getElementById('lesson-menu').style.display = 'block';
}

function goBack() {
  document.getElementById('lesson-menu').style.display = 'none';
  document.getElementById('welcome-screen').style.display = 'block';
}

function toggleQuizSection() {
  document.getElementById('welcome-screen').style.display = 'none';
  document.getElementById('quiz-section').style.display = 'block';
}

function goBackFromQuiz() {
  document.getElementById('quiz-section').style.display = 'none';
  document.getElementById('welcome-screen').style.display = 'block';
}

function startQuiz(topic) {
  window.location.href = `/quizzes#${topic}`;
}

let speechActive = false;
let currentUtterance = null;

function speakText(id, button) {
  const text = document.getElementById(id).innerText;

  if (!speechActive) {
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = 'en-US';
    currentUtterance.rate = 0.9;

    currentUtterance.onend = () => {
      speechActive = false;
      if (button) button.textContent = '🔊 Read Aloud';
    };

    speechSynthesis.speak(currentUtterance);
    speechActive = true;
    if (button) button.textContent = '⏹️ Stop Reading';
  } else {
    speechSynthesis.cancel();
    speechActive = false;
    if (button) button.textContent = '🔊 Read Aloud';
  }
}


function view3DModel(modelName) {
  alert(`Opening 3D viewer for ${modelName}. This would integrate with a 3D library like Three.js in a real implementation.`);
}

let heartbeatAudio = null;

function playHeartbeat() {
  if (!heartbeatAudio) {
    heartbeatAudio = new Audio('/sounds/heartbeat.mp3');
    heartbeatAudio.loop = true; 
  }

  if (heartbeatAudio.paused) {
    heartbeatAudio.play();
  } else {
    heartbeatAudio.pause();
    heartbeatAudio.currentTime = 0;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const lessonCards = document.querySelectorAll('.lesson-card');
  lessonCards.forEach(card => {
    card.addEventListener('click', function() {
      const lessonName = this.getAttribute('data-lesson');
      window.location.href = `/lesson/${lessonName}`;
    });
  });

  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
});