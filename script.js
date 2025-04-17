// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCunAsWIHvjbym2LSyaUGxCTUVPph_4Guk",
  authDomain: "food-trivia-1890f.firebaseapp.com",
  projectId: "food-trivia-1890f",
  storageBucket: "food-trivia-1890f.firebasestorage.app",
  messagingSenderId: "989485521019",
  appId: "1:989485521019:web:031348bb9b0cf884c06ade",
  measurementId: "G-JKLSC66HWF",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Firestore references
const gameDoc = db.collection("games").doc("defaultGame");
// Function to handle the main game logic on index.html
function runMainGameLogic() {
  console.log("Running main game logic for index.html");
  // DOM Elements
  const welcomeScreen = document.getElementById("welcome-screen");
  const gameScreen = document.getElementById("game-screen");
  const bonusFactScreen = document.getElementById("bonus-fact-screen");
  const gameOverScreen = document.getElementById("game-over-screen");
  const playerNameInput = document.getElementById("player-name");
  const startButton = document.getElementById("start-button");
  const questionNumberDisplay = document.getElementById("question-number");
  const questionTextDisplay = document.getElementById("question-text");
  const optionsContainer = document.getElementById("options-container");
  const timerDisplay = document.getElementById("time-left");
  const feedbackContainer = document.getElementById("feedback");
  const feedbackIcon = document.getElementById("feedback-icon");
  const feedbackText = document.getElementById("feedback-text");
  const currentPlayerNameDisplay = document.getElementById(
    "current-player-name"
  );
  const currentScoreDisplay = document.getElementById("current-score");
  const foodFactTextDisplay = document.getElementById("food-fact-text");
  const continueToBonusBtn = document.getElementById(
    "continue-to-bonus-question"
  );
  const finalMessageDisplay = document.getElementById("final-message");
  const finalScoreDisplay = document.getElementById("final-score");
  const finalRankDisplay = document.getElementById("final-rank");
  const playAgainButton = document.getElementById("play-again-button");
  const leaderboardContainer = document.getElementById("leaderboard-container");
  const leaderboardList = document.getElementById("leaderboard-list");
  const toggleLeaderboardBtn = document.getElementById("toggle-leaderboard");

  // Game State
  // --- Game State Variables ---
  // These might be initialized differently depending on whether we're starting fresh or returning from waiting room
  let currentPlayerName = "";
  let currentScore = 0;
  let questionIndex = 0;
  let timerInterval = null;
  let timeLeft = 20;
  let selectedQuestions = [];
  let selectedFacts = [];
  let currentFactIndex = 0;
  let leaderboardData = [...mockLeaderboard]; // Copy mock data
  const TOTAL_QUESTIONS = 10;
  const BONUS_ROUND_INTERVAL = 3;
  let regularQuestionCount = 0;
  let currentQuestionIsBonus = false;
  let isGameInitialized = false; // Flag to prevent double initialization

  // --- Initialization Function ---
  function initializeGame() {
    if (isGameInitialized) return; // Prevent running twice
    console.log("Initializing Game...");

    // Check if returning from waiting room
    if (window.location.hash === "#startgame") {
      console.log("Returning from waiting room.");
      currentPlayerName =
        localStorage.getItem("pendingPlayerName") || "Anonymous Chef";
      localStorage.removeItem("pendingPlayerName");
      localStorage.removeItem("gameStarted"); // Clean up flag
      window.location.hash = ""; // Clear the hash

      // Initialize game state for actual start
      currentScore = 0;
      questionIndex = 0;
      regularQuestionCount = 0;
      currentFactIndex = 0;
      currentQuestionIsBonus = false;
      selectedQuestions = shuffleArray([...triviaQuestions]).slice(
        0,
        TOTAL_QUESTIONS
      );
      selectedFacts = shuffleArray([...foodFacts]).slice(
        0,
        Math.ceil(TOTAL_QUESTIONS / BONUS_ROUND_INTERVAL)
      );

      updateScoreDisplay();
      currentPlayerNameDisplay.textContent = currentPlayerName;
      updateLeaderboard(); // Add player to leaderboard

      showScreen(gameScreen);
      loadNextQuestion();
    } else {
      console.log("Normal page load - showing welcome screen.");
      // Normal welcome screen setup
      renderLeaderboard(); // Initial render with mock data
      showScreen(welcomeScreen);
    }

    // --- Event Listeners (Should only be added once) ---
    if (!isGameInitialized) {
      startButton.addEventListener("click", handleStartClick);
      playAgainButton.addEventListener("click", restartGame);
      continueToBonusBtn.addEventListener("click", loadBonusQuestion);
      toggleLeaderboardBtn.addEventListener("click", toggleLeaderboard);

      // Initial setup for leaderboard toggle on smaller screens
      setupLeaderboardToggle();
    }
    isGameInitialized = true;
  }

  // --- Functions ---

  function setupLeaderboardToggle() {
    if (!toggleLeaderboardBtn) return;
    handleResize();
    window.addEventListener("resize", handleResize);
  }

  function handleResize() {
    const isMobileView = window.innerWidth <= 992;
    if (isMobileView) {
      leaderboardContainer.classList.add("collapsed"); // Start collapsed on mobile
      leaderboardContainer.classList.remove("open");
      toggleLeaderboardBtn.innerHTML = '<i class="fas fa-bars"></i>'; // Show hamburger
    } else {
      leaderboardContainer.classList.remove("collapsed", "open"); // Ensure it's visible on desktop
      toggleLeaderboardBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    }
  }

  function toggleLeaderboard() {
    const isMobileView = window.innerWidth <= 992;
    if (isMobileView) {
      leaderboardContainer.classList.toggle("open");
      if (leaderboardContainer.classList.contains("open")) {
        toggleLeaderboardBtn.innerHTML = '<i class="fas fa-times"></i>'; // Show close icon
      } else {
        toggleLeaderboardBtn.innerHTML = '<i class="fas fa-bars"></i>'; // Show hamburger icon
      }
    } else {
      leaderboardContainer.classList.toggle("collapsed");
      if (leaderboardContainer.classList.contains("collapsed")) {
        toggleLeaderboardBtn.innerHTML = '<i class="fas fa-chevron-right"></i>'; // Show open arrow
      } else {
        toggleLeaderboardBtn.innerHTML = '<i class="fas fa-chevron-left"></i>'; // Show collapse arrow
      }
    }
  }

  // Renamed original startGame to handleStartClick to differentiate roles
  function handleStartClick() {
    let playerName = playerNameInput.value.trim() || "Anonymous Chef";
    if (playerName.length > 15) {
      playerName = playerName.substring(0, 15) + "...";
    }
    playerNameInput.value = ""; // Clear input

    console.log(`Player "${playerName}" entered. Redirecting to waiting room.`);
    db.collection("players")
      .add({
        name: playerName,
        score: 0,
      })
      .then(() => {
        console.log("Player name saved to Firestore");
      });

    // Store name for retrieval on the waiting page/return
    localStorage.setItem("pendingPlayerName", playerName);
    // Set flag to indicate game setup is pending (host needs to start)
    localStorage.setItem("gameStarted", "false");

    // Redirect to the waiting room
    window.location.href = "waiting.html";

    // Simulate the host starting the game after a short delay
    // This allows the waiting page to load before the flag is set to true
    setTimeout(() => {
      console.log("Simulating host starting the game...");
      // In a real scenario, this 'true' would be set by a host action
      localStorage.setItem("gameStarted", "true");
    }, 100); // Short delay
  }

  // This function now resets the state for a new game AFTER finishing one
  function restartGame() {
    console.log("Restarting game from game over screen.");
    isGameInitialized = false; // Allow re-initialization
    leaderboardData = [...mockLeaderboard]; // Reset to mock data
    // Clear potential leftover flags if restarting without full page reload
    localStorage.removeItem("pendingPlayerName");
    localStorage.removeItem("gameStarted");
    window.location.hash = ""; // Clear hash just in case
    initializeGame(); // Re-initialize to show welcome screen
  }

  function showScreen(screenElement) {
    document
      .querySelectorAll(".screen")
      .forEach((screen) => screen.classList.remove("active"));
    screenElement.classList.add("active");
  }

  function loadNextQuestion() {
    resetQuestionState();

    // Check for bonus round
    if (
      regularQuestionCount > 0 &&
      regularQuestionCount % BONUS_ROUND_INTERVAL === 0 &&
      currentFactIndex < selectedFacts.length
    ) {
      showBonusFact();
    } else if (questionIndex < TOTAL_QUESTIONS) {
      loadRegularQuestion();
    } else {
      endGame();
    }
  }

  function loadRegularQuestion() {
    currentQuestionIsBonus = false;
    const questionData = selectedQuestions[questionIndex];
    questionNumberDisplay.textContent = `Question ${
      questionIndex + 1
    }/${TOTAL_QUESTIONS}`;
    questionTextDisplay.textContent = questionData.question;

    optionsContainer.innerHTML = ""; // Clear previous options
    const shuffledOptions = shuffleArray([...questionData.options]);

    shuffledOptions.forEach((option) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.classList.add("option-btn");
      button.addEventListener("click", () =>
        selectAnswer(button, option, questionData.answer)
      );
      optionsContainer.appendChild(button);
    });

    questionIndex++;
    regularQuestionCount++;
    startTimer();
  }

  function showBonusFact() {
    currentQuestionIsBonus = true; // Mark that the *next* question is the bonus one
    const factData = selectedFacts[currentFactIndex];
    foodFactTextDisplay.textContent = factData.fact;
    currentFactIndex++; // Increment here, before loading question
    showScreen(bonusFactScreen);
    // No timer here, player reads the fact
  }

  function loadBonusQuestion() {
    const factData = selectedFacts[currentFactIndex - 1]; // Use the current fact
    showScreen(gameScreen);
    questionNumberDisplay.textContent = `Bonus Question!`;
    questionTextDisplay.textContent = factData.bonusQuestion;

    optionsContainer.innerHTML = ""; // Clear previous options
    const shuffledOptions = shuffleArray([...factData.options]);

    shuffledOptions.forEach((option) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.classList.add("option-btn");
      button.addEventListener("click", () =>
        selectAnswer(button, option, factData.answer, true)
      ); // Mark as bonus
      optionsContainer.appendChild(button);
    });

    startTimer(15); // Shorter timer for bonus question
  }

  function startTimer(duration = 20) {
    timeLeft = duration;
    timerDisplay.textContent = `${timeLeft}s`;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        handleTimeout();
      }
    }, 1000);
  }

  function resetQuestionState() {
    clearInterval(timerInterval);
    feedbackContainer.style.visibility = "hidden";
    feedbackIcon.innerHTML = "";
    feedbackText.textContent = "";
    optionsContainer.querySelectorAll(".option-btn").forEach((btn) => {
      btn.disabled = false;
      btn.classList.remove("correct", "incorrect");
    });
  }

  function selectAnswer(
    button,
    selectedOption,
    correctAnswer,
    isBonus = false
  ) {
    clearInterval(timerInterval);
    const timeTaken = (isBonus ? 15 : 20) - timeLeft;
    const buttons = optionsContainer.querySelectorAll(".option-btn");
    buttons.forEach((btn) => (btn.disabled = true)); // Disable all buttons

    let scoreEarned = 0;
    let feedbackMessage = "";

    if (selectedOption === correctAnswer) {
      const basePoints = isBonus ? 150 : 100; // Higher points for bonus
      const speedBonus =
        Math.max(0, (isBonus ? 15 : 20) - timeTaken) * (isBonus ? 7 : 5); // Speed bonus calculation
      scoreEarned = basePoints + speedBonus;
      feedbackMessage = `Correct! +${scoreEarned} points!`;
      button.classList.add("correct");
      feedbackIcon.innerHTML = '<i class="fas fa-check-circle"></i>'; // Green check
    } else {
      feedbackMessage = `Oops! The correct answer was ${correctAnswer}.`;
      button.classList.add("incorrect");
      feedbackIcon.innerHTML = '<i class="fas fa-times-circle"></i>'; // Red cross
      // Highlight the correct answer
      buttons.forEach((btn) => {
        if (btn.textContent === correctAnswer) {
          btn.classList.add("correct");
        }
      });
    }

    currentScore += scoreEarned;
    updateScoreDisplay();
    feedbackText.textContent = feedbackMessage;
    feedbackContainer.style.visibility = "visible";

    updateLeaderboard();

    // Wait a moment before loading the next question
    setTimeout(() => {
      // Decide if next is regular question or end game
      if (currentQuestionIsBonus || questionIndex >= TOTAL_QUESTIONS) {
        loadNextQuestion(); // If it was a bonus, proceed normally
      } else {
        loadNextQuestion(); // Proceed to next regular or potential bonus trigger
      }
    }, 2000); // Show feedback for 2 seconds
  }

  function handleTimeout() {
    const buttons = optionsContainer.querySelectorAll(".option-btn");
    buttons.forEach((btn) => (btn.disabled = true));

    const questionData = currentQuestionIsBonus
      ? selectedFacts[currentFactIndex - 1]
      : selectedQuestions[questionIndex - 1]; // Get current Q data
    const correctAnswer = questionData.answer;

    feedbackText.textContent = `Time's up! The correct answer was ${correctAnswer}.`;
    feedbackIcon.innerHTML = '<i class="far fa-clock"></i>'; // Clock icon for timeout
    feedbackContainer.style.visibility = "visible";

    // Highlight the correct answer
    buttons.forEach((btn) => {
      if (btn.textContent === correctAnswer) {
        btn.classList.add("correct");
        btn.style.opacity = "1"; // Ensure it's fully visible
      }
    });

    updateLeaderboard(); // Update leaderboard even on timeout (score doesn't change)

    setTimeout(() => {
      loadNextQuestion();
    }, 2000);
  }

  function updateScoreDisplay() {
    currentScoreDisplay.textContent = currentScore;
  }

  function updateLeaderboard() {
    // Find if player already exists
    const playerIndex = leaderboardData.findIndex(
      (p) => p.name === currentPlayerName
    );

    if (playerIndex > -1) {
      leaderboardData[playerIndex].score = currentScore;
    } else {
      leaderboardData.push({ name: currentPlayerName, score: currentScore });
    }

    // Sort leaderboard by score descending
    leaderboardData.sort((a, b) => b.score - a.score);

    // Limit leaderboard size (e.g., top 10)
    // leaderboardData = leaderboardData.slice(0, 10);

    // Render leaderboard
    renderLeaderboard();
  }

  function renderLeaderboard() {
    leaderboardList.innerHTML = ""; // Clear existing list
    const playerRank =
      leaderboardData.findIndex((p) => p.name === currentPlayerName) + 1;

    leaderboardData.forEach((player, index) => {
      const li = document.createElement("li");
      const rankSpan = document.createElement("span");
      const nameSpan = document.createElement("span");
      const scoreSpan = document.createElement("span");

      rankSpan.classList.add("leaderboard-rank");
      rankSpan.textContent = `${index + 1}.`;

      nameSpan.classList.add("leaderboard-name");
      nameSpan.textContent = player.name;

      scoreSpan.classList.add("leaderboard-score");
      scoreSpan.textContent = player.score;

      li.appendChild(rankSpan);
      li.appendChild(nameSpan);
      li.appendChild(scoreSpan);

      if (player.name === currentPlayerName) {
        li.classList.add("current-player");
      }

      leaderboardList.appendChild(li);
    });
    // Return rank for game over screen
    return playerRank > 0 ? playerRank : "N/A";
  }

  function endGame() {
    console.log("Game ended. Final score:", currentScore);
    showScreen(gameOverScreen);
    finalScoreDisplay.textContent = currentScore;

    const finalRank = renderLeaderboard(); // Update and get final rank
    finalRankDisplay.textContent =
      finalRank !== "N/A" ? `#${finalRank}` : "N/A";

    if (currentScore > 1500) {
      finalMessageDisplay.textContent = `Amazing job, ${currentPlayerName}! Top Chef!`;
    } else if (currentScore > 800) {
      finalMessageDisplay.textContent = `Well done, ${currentPlayerName}! You know your food!`;
    } else {
      finalMessageDisplay.textContent = `Good effort, ${currentPlayerName}! Keep practicing!`;
    }
  }

  // Utility function to shuffle an array (Fisher-Yates algorithm)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Call the initialization function for the main game logic
  initializeGame();
} // End of runMainGameLogic

// Function to handle the waiting room logic on waiting.html
function runWaitingRoomLogic() {
  console.log("Running waiting room logic for waiting.html");

  // Get player name from localStorage and display it
  const playerNameDisplay = document.getElementById("display-player-name");
  const playerName = localStorage.getItem("pendingPlayerName");
  if (playerName && playerNameDisplay) {
    playerNameDisplay.textContent = playerName;
  } else if (playerNameDisplay) {
    playerNameDisplay.textContent = "Anonymous Chef"; // Default if not found
  }

  const checkInterval = setInterval(() => {
    console.log("Checking if game has started...");
    const gameStarted = localStorage.getItem("gameStarted");

    if (gameStarted === "true") {
      console.log(
        "Game started signal received! Redirecting back to main game."
      );
      clearInterval(checkInterval);
      // Redirect back to index.html and signal it to start the game immediately
      window.location.href = "index.html#startgame";
    }
    // else, keep waiting
  }, 2000); // Check every 2 seconds
}

// --- Global Scope Logic ---
// Determine which logic to run based on the current page path
if (window.location.pathname.endsWith("waiting.html")) {
  // Make sure the DOM is ready before running waiting logic
  document.addEventListener("DOMContentLoaded", runWaitingRoomLogic);
} else if (
  window.location.pathname.endsWith("index.html") ||
  window.location.pathname === "/"
) {
  // Handle root path as well
  // Make sure the DOM is ready before running main game logic
  document.addEventListener("DOMContentLoaded", runMainGameLogic);
}
