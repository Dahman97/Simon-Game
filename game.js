const buttonColors = ["red", "green", "yellow", "blue"];
const wrongSound = "wrong";
let isSoundMuted = false;
let darkMode = false;
let backgroundMusic = "migiComp";
let isMusicPlaying = false;

let gamePattern = [];
let userClickedPattern = [];
let started = false;
let level = 0;
let highScore = 0;
currentGameHighScore = 0;
let highScores = [];
// mediaQuery for tablets and mobile devices
const mobile = window.matchMedia("(max-width: 489px) and (min-width: 200px)");
const tablet = window.matchMedia("(max-width: 850px) and (min-width: 490px)");
const pc_Laptops = window.matchMedia("(min-width: 490px)");

function widthChangeCallback() {
  if (mobile.matches || tablet.matches) {
    // an event listener for non pc's or laptops
    $(".tryAgain").click(() => {
      if (!started) {
        $("#level-title").text("Level " + level);
        $("#mobile-title").css("visibility", "hidden");
        nextSequence();
        started = true;
      }

      $(".tryAgain").text("Try again?");
      $(".tryAgain").addClass("hidden");
    });
  } else if (pc_Laptops.matches) {
    // a keypress event is fired and the nextSequence() is fired only once when the game starts.
    $(document).keypress(() => {
      if (!started) {
        $("#level-title").text("Level " + level);
        $("#pc-title").css("visibility", "hidden");
        nextSequence();
        started = true;
      }
    });
  }
}

mobile.addListener(widthChangeCallback);
tablet.addListener(widthChangeCallback);
pc_Laptops.addListener(widthChangeCallback);
widthChangeCallback(); // Call it once to handle the initial state

// user clicked button will animate and play sound file
$(".btn").click(function () {
  let userChosenColor = $(this).attr("id");
  userClickedPattern.push(userChosenColor);
  animatePress(userChosenColor);
  playSound(userChosenColor);

  checkAnswer(userClickedPattern.length - 1);
});

// check if user clicked correct button else resets the game after a key is pressed.
checkAnswer = (currentLevel) => {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(() => {
        nextSequence();
      }, 1000);
    }
  } else if (mobile.matches || tablet.matches) {
    $("body").addClass("game-over");
    setTimeout(() => {
      $("#level-title").text("Game Over, Press Try Again? To Play ");
      $("body").removeClass("game-over");
    }, 200);
    $(".tryAgain").removeClass("hidden");
    playSound(wrongSound);
    if (currentGameHighScore > highScore) {
      highScore = currentGameHighScore;
    }
    saveHighScore();
    startOver();
  } else {
    $("body").addClass("game-over");
    setTimeout(() => {
      $("#level-title").text("Game Over, Press Any Key to Restart ");
      $("body").removeClass("game-over");
    }, 200);
    playSound(wrongSound);
    if (currentGameHighScore > highScore) {
      highScore = currentGameHighScore;
    }
    saveHighScore();
    startOver();
  }
};

// a function that genrates a random color each time it is called
// generated colors will be pushed to the game pattern array
nextSequence = () => {
  userClickedPattern = [];
  let randomNumber = Math.floor(Math.random() * 4);
  let randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);
  level++;
  currentGameHighScore++;
  $("#level-title").text("level " + level);
  animatePress(randomChosenColor);
  playSound(randomChosenColor);
};
// a function that resets the game
startOver = () => {
  level = 0;
  gamePattern = [];
  started = false;
  currentGameHighScore = 0; // resets the current high score
};

// toogles settings for dark mode and mute sound

$(document).ready(function () {
  $("#sound-toggle").change(function () {
    isSoundMuted = $(this).is(":checked");
    // Optionally, you can add logic to provide user feedback
    if (isSoundMuted == true) {
      isSoundMuted = true;
    } else {
      isSoundMuted = false;
    }
  });
});

$(document).ready(function () {
  $("#light-mode-toggle").change(function () {
    // Toggle the 'dark-mode' class on the body element
    $("body").toggleClass("light-mode", $(this).is(":checked"));
  });
});

// a function to play sounds based on the color argument passed
playSound = (color) => {
  if (!isSoundMuted) {
    let audio = new Audio(`./sounds/${color}.mp3`);
    audio.play();
  }
};

// play background music
let music = new Audio(`./sounds/${backgroundMusic}.mp3`);

playBackgroundMusic = (backgroundMusic) => {
  if (isMusicPlaying) {
    music.loop = true;
    music.play();
  } else {
    music.pause(); // Pause the music if it's not playing
    music.currentTime = 0; // Reset the playback to the beginning
  }
};

// ...

$(document).ready(function () {
  $("#music-toggle").change(function () {
    isMusicPlaying = $(this).is(":checked");
    if (isMusicPlaying) {
      playBackgroundMusic(backgroundMusic);
    } else {
      isMusicPlaying = false;
      playBackgroundMusic(backgroundMusic); // Call to stop the music
    }
  });
});

// animate the buttons when pressed
animatePress = (currentColor) => {
  $("#" + currentColor).addClass("pressed");
  setTimeout(() => {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
};

// save highScore in local stoarge
const savedHighScore = JSON.parse(localStorage.getItem("highScore"));
saveHighScore = () => {
  const score = {
    score: highScore,
  };

  // Get the saved high score from local storage

  // Check if there is no saved high score or if the current high score is greater
  if (!savedHighScore || score.score > savedHighScore[0].score) {
    // Update the high score array with the new high score
    highScores = [score];
    // Update the displayed high score
    $(".highestScore").text(score.score);
    // Save the updated high score to local storage
    localStorage.setItem("highScore", JSON.stringify(highScores));
  } else {
    // If the current high score is not greater, update only the displayed high score
    highScore = score.score; // Update the current session's high score
    $(".highestScore").text(score.score); // Update the displayed high score
  }
};

$(document).ready(function () {
  // Initialize the high score from local storage or set it to 0
  if (savedHighScore && savedHighScore.length > 0) {
    highScore = savedHighScore[0].score;
  }
  // Update the displayed high score
  $(".highestScore").text(highScore);
});
