const buttonColors = ["red", "green", "yellow", "blue"];
const soundWrong = "wrong";

let gamePattern = [];
let userClickedPattern = [];
let started = false;
let level = 0;

// a keypress event is fired and the nextSequence() is fired only once when the game starts, sound and flash effects to
$(document).keypress(() => {
  if (!started) {
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }
});

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
  } else {
    $("body").addClass("game-over");
    setTimeout(() => {
      $("#level-title").text("Game Over, Press Any Key to Restart ");
      $("body").removeClass("game-over");
    }, 200);
    playSound(soundWrong);
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
  $("#level-title").text("level " + level);
  animatePress(randomChosenColor);
  playSound(randomChosenColor);
};
// a function that resets the game
startOver = () => {
  level = 0;
  gamePattern = [];
  started = false;
};

// a function to play sounds based on the color argument passed
playSound = (color) => {
  let audio = new Audio(`./sounds/${color}.mp3`);
  audio.play();
};

// animate the buttons when pressed
animatePress = (currentColor) => {
  $("#" + currentColor).addClass("pressed");
  setTimeout(() => {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
};

$(".hide").click(() => {
  $("#how-to").slideToggle(function () {
    if ($(this).css("display") === "none") {
      $(".hide").text("Show tutorial");
    } else {
      $(".hide").text("Hide tutorial");
    }
  });
});
