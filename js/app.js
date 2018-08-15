//Add better comments explaining "WHY" some code does what it does (not "WHAT" it does)

// cardlist that holds all  cards
 let cardList = [
   "fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"
 ];

// store number of moves
 let startGame = false;
 let moves = 0;
 let matchFound = 0;

// timer
const timer = new Timer();
 timer.addEventListener('secondsUpdated', function (e) {
   $('#timer').html(timer.getTimeValues().toString());
 });

// reset game
$('#restart-game').click(function () {
  restartGame();
});

// create card
function createCard(card) {
  $('#deck').append(`<li class="card animated"><i class="fa ${card}"></i></li>`);
}

// generate gameboard
function generateCards() {
  for (let i = 0; i < 2; i++) {
    cardList = shuffle(cardList);
    cardList.forEach(createCard);
  }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
    }

    return array;
}

// open cards
openCards = [];

// game functionality
function toggleCard() {
  if (startGame == false) {
    startGame = true;
    timer.start();
  }

  if (openCards.length === 0) {
    $(this).toggleClass("show open").animateCss('flipInY');
    openCards.push($(this));
    disableClick();
  }

  else if (openCards.length === 1) {
    updateMoves();
    $(this).toggleClass("show open").animateCss('flipInY');
    openCards.push($(this));
    setTimeout(matchCards, 1100);
  }
}

// do not allow click for open cards
function disableClick() {
  openCards.forEach(function (card) {
    card.off('click');
  });
}

// click on open cards
function enableClick() {
  openCards[0].click(toggleCard);
}

// check for matching cards
function matchCards() {
  if (openCards[0][0].firstChild.className == openCards[1][0].firstChild.className) {
    console.log("matchCard")
    openCards[0].addClass("match").animateCss('shake');
    openCards[1].addClass("match").animateCss('shake');
    disableClick();
    removeCards();
    setTimeout(gameOver, 1000)
  }
  else {
    openCards[0].toggleClass("show open").animateCss('flipInY');
    openCards[1].toggleClass("show open").animateCss('flipInY');
    enableClick();
    removeCards();
  }
}

// remove open cards
function removeCards() {
  openCards = [];
}

// animations (https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css)
$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass(animationName).one(animationEnd, function () {
            $(this).removeClass(animationName);
        });
        return this;
    }
});

function updateMoves () {
  moves += 1;
  $('#moves').html(`${moves} moves`);
  if (moves == 24) {
    addStar();
  }
  else if (moves == 15) {
    addStar();
  }
}

// add stars
function addStar() {
  $('#stars').children()[0].remove();
  $('#stars').append('<li><i class="fa fa-star-o"></i></li>');
}

// starting stars
function addStartStars() {
  for (var i = 0; i < 3; i++) {
    $('#stars').append('<li><i class="fa fa-star"></i></li>');
  }
}

// check if game is over
function gameOver() {
  matchFound += 1;
  if (matchFound == 8) {
    showResults();
  }
}

// restart the game
function restartGame() {
  moves = 0;
  matchFound = 0;
  $('#deck').empty();
  $('#stars').empty();
  $('#game')[0].style.display = "";
  $('#game-over')[0].style.display = "none";
  startGame=false;
  timer.stop();
  $('#timer').html("00:00:00");
  removeCards();
  playGame();
}

// start playing game
function playGame() {
  generateCards();
  $('.card').click(toggleCard);
  $('#moves').html("0 moves");
  addStartStars(3);
}

// show results
function showResults() {
  $('#game-over').empty();
  timer.pause();
  var scoreBoard = `
        <p class="success">Congratulations!</p>
        <p>
          <span class="final-scores">Moves:</span>
          <span class="final-values">${moves}</span>
          <span class="final-scores">Time:</span>
          <span class="final-values">${timer.getTimeValues().toString()}</span>
        </p>
        <div class="text-center margin-top">
          <div class="star">
            <i class="fa fa-star fa-3x"></i>
          </div>
          <div class="star">
            <i class="fa ${ (moves > 23) ? "fa-star-o" : "fa-star"} fa-3x"></i>
          </div>
          <div class="star">
            <i class="fa ${ (moves > 14) ? "fa-star-o" : "fa-star"} fa-3x"></i>
          </div>
        </div>
        <div class="text-center margin-top-2" id="restart">
          <i class="fa fa-repeat fa-2x"></i>
        </div>
    `;
  $('#game')[0].style.display = "none";
  $('#game-over')[0].style.display = "block";
  $('#game-over').append($(scoreBoard));
  $('#restart').click(restartGame);
}

// start game
playGame();
