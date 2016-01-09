var deck = [];
var dealNum = 0;
var playerNum = 0;
var currentDeal = 0;

var delayTime = 100;
var dragging = false;

function makeSuit (e) {

	var finalCard = 0;
	var cardNum = 0;
	var suit = e;
	for (var i = 0; i < 13; i++) {
		cardNum ++;

		if (cardNum == 11) {
			finalCard = "J" + " " + suit;
		} else if (cardNum == 12) {
			finalCard = "Q" + " " + suit;
		} else if (cardNum == 13) {
			finalCard = "K" + " " + suit;
		} else if (cardNum == 1) {
			finalCard = "A" + " " + suit;
		} else {
			finalCard = cardNum + " " + suit;
		}

		deck.push(finalCard);

	};
	cardNum = 0;
} 

function makeDeck() {

	makeSuit("S");
	makeSuit("C");
	makeSuit("H");
	makeSuit("D");

	//console.log(deck)
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  console.log(array);

  return array;

}

function deal() {
	if (playerNum > 0) {
		currentDeal ++;
		currentSuit = deck[0].slice(-1);
		console.log(currentSuit)
		if (deck.length != 0){
			$('div[player="' + currentDeal + '"]').append('<div class="card ' + currentSuit + '">' + deck[0] + "</div>");
			deck.shift();
			console.log(deck);
			makeDraggable()
		} else {
			console.log("empty!")
		}
		if (currentDeal == playerNum) {
			currentDeal = 0;
		}
	} else {
		console.log("no players to deal cards to");
	}
}

function dealToPlayer (player) {
	currentSuit = deck[0].slice(-1);
	if (deck.length != 0){
		$('div[player="' + player + '"]').append('<div class="card ' + currentSuit + '">' + deck[0] + "</div>");
		deck.shift();
		console.log(deck);
		makeDraggable();
	} else {
		console.log("empty!")
	}
}

function dealToTable (callback) {
	currentSuit = deck[0].slice(-1);
	if (deck.length != 0){
		$('div.table').append('<div class="card ' + currentSuit + '">' + deck[0] + "</div>");
		callback("div.card:contains('" + deck[0] + "')");
		deck.shift();
		console.log(deck);
		makeDraggable();
	} else {
		console.log("empty!")
	}
}

function returnCard (card) {
	var activeCard = $(card).html();
	deck.push(activeCard);
	$(card).remove();
	console.log(deck);
}

function addPlayertoTable (e) {

	$("div.playerArea").append('<div class="playerStation">' + e + '</div>');

	makeDroppable()
}

function addPlayertoHand (e) {
	$("div.content").append('<div class="player" player="' + e + '"><div class="playUp">up</div><div class="playDown">down</div>');

	makeDroppable()
}



// function playCard () {
// 	$(document).on( "click", "div.card", function() {
// 		var clickedCard = $(this).html();
// 		var clickedCardSuit = clickedCard.slice(-1);
// 		console.log(clickedCard)
// 		$(this).remove();
// 		$("div.table").append('<div class="card ' + clickedCardSuit + '">' + clickedCard + "</div>")
// 		//its technically a new instance, so needs to be made draggable again
// 		makeDraggable();
// 	});

// }


function faceDown (card) {
	$(card).addClass("faceDown");
	$(card).removeClass("faceUp");
}

function faceUp (card) {
	$(card).addClass("faceUp");
	$(card).removeClass("faceDown");
}

function flipCard (card) {
	//console.log($(card).hasClass("faceDown"))
	console.log(dragging);
	if (!dragging) {
		if ($(card).hasClass("faceDown")) {
			faceUp(card);
		} else {
			faceDown(card);
		}
	}
}

function touchFlip () {
	$(document).on( "click", "div.card", function() {
		flipCard(this);
	});
}

function tapFlip () {
		$("div.card").on("touchend", function(){
			flipCard(this);
		});
}

function playCardFromHand (card, flipState) {
	var activeCard = $(card).html();
	var activeCardSuit = activeCard.slice(-1);
	var playHand = [activeCard, flipState]
	console.log(activeCard)
	$(card).remove();
	console.log(flipState);

	socket.emit('playFromHand', playHand);

}

function playCardToTable (cardData, flipState) {
	console.log(flipState)
	var activeCardSuit = cardData.slice(-1);
	var newCard = '<div class="card ' + activeCardSuit + '">' + cardData + '</div>'
	$("div.table").append(newCard);
	//its technically a new instance, so needs to be made draggable again
	makeDraggable();
	if (flipState == "faceUp") {
		console.log("here!")
		faceUp("div.card:contains('" + cardData + "')");
	} else {
		console.log("there!")
		faceDown("div.card:contains('" + cardData + "')");
	}
}

function giveCard (player, card) {
	var activeCard = $(card).html();
	var down;
	if ($(card).hasClass("faceDown")) {
		down = true;
	} else {
		down = false;
	}
	var send = [player, activeCard, down]
	$(card).remove();
	socket.emit('give',send);
}

function takeCard (player, cardData, upDown) {

	var activeCardSuit = cardData.slice(-1);

	var newCard = '<div class="card ' + activeCardSuit + '">' + cardData + '</div>';
	$('div[player="' + player + '"]').append(newCard);
	//its technically a new instance, so needs to be made draggable again
	makeDraggable();
	//touchFlip();
	tapFlip();
	if (upDown) {
		console.log("down");
		faceDown("div.card:contains('" + cardData + "')");
	} else {
		console.log("up");
		faceUp("div.card:contains('" + cardData + "')");
	}
}

function tapDeck () {
	$("div.deck").click(function() {
		dealToTable(faceDown);
	});
}

//jquery UI stuff

function droppableDeck () {
	$("div.deck").droppable({
    	drop: function( event, ui ) {
        	returnCard(ui.draggable);
    	}
    })
}

function makeDraggable() {

	$(function() {
		$( "div.card" ).draggable({ 
			stack: "div.card",
			//containment: "parent",
			delay: delayTime,
		});
	});

}

function makeDroppable() {
	$( "div.playUp" ).droppable({
    	drop: function( event, ui ) {
    		console.log("up")
        	playCardFromHand(ui.draggable, "faceUp");
    	}
    });
    $( "div.playDown" ).droppable({
    	drop: function( event, ui ) {
    		console.log("down")
        	playCardFromHand(ui.draggable, "faceDown");
    	}
    });

    $("div.playerStation").droppable({
    	drop: function( event, ui ) {
    		var currentStation = $(this).html();
        	giveCard(currentStation, ui.draggable);
    	}
    });
}

//mouse to touch stuff
function touchHandler(event) {
    var touch = event.changedTouches[0];

    var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent({
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup"
    }[event.type], true, true, window, 1,
        touch.screenX, touch.screenY,
        touch.clientX, touch.clientY, false,
        false, false, false, 0, null);

    touch.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function touchConvert() {
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);
}

//anything is being dragged

function checkDragged () {
	$("body").on("touchmove", function(){
		setTimeout(function(){
			dragging = true;
		}, delayTime); 

	});

	$("body").on("touchstart", function(){
		dragging = false;
	});
	$("body").on("click", function(){
		dragging = false;
	});
}

checkDragged();


