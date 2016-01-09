var deck = [];
var dealNum = 0;
var playerNum = 0;
var currentDeal = 0;

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

function addPlayer () {
	playerNum ++;
	$("div.players").append('<div class="player" player="' + playerNum + '"><div class="playUp">up</div><div class="playDown">down</div>');

	$("div.buttons").append('<button onclick="dealToPlayer(' + playerNum + ')">deal to player ' + playerNum + '</button>');
	$("div.playerArea").append('<div class="playerStation">' + playerNum + '</div>');

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
	if ($(card).hasClass("faceDown")) {
		faceUp(card);
	} else {
		faceDown(card);
	}
}

function touchFlip () {
	$(document).on( "click", "div.card", function() {
		flipCard(this);
	});
}

function playCard (card, callback) {
	var activeCard = $(card).html();
	var activeCardSuit = activeCard.slice(-1);
	console.log(activeCard)
	$(card).remove();
	var newCard = '<div class="card ' + activeCardSuit + '">' + activeCard + '</div>'
	$("div.table").append(newCard);
	//its technically a new instance, so needs to be made draggable again
	makeDraggable();
	callback("div.card:contains('" + activeCard + "')");
}

function takeCard (player, card) {
	var activeCard = $(card).html();
	var activeCardSuit = activeCard.slice(-1);
	console.log(activeCard)
	$(card).remove();
	var newCard = '<div class="card ' + activeCardSuit + '">' + activeCard + '</div>'
	$('div[player="' + player + '"]').append(newCard);
	//its technically a new instance, so needs to be made draggable again
	makeDraggable();
	if ($(card).hasClass("faceDown")) {
		faceDown("div.card:contains('" + activeCard + "')");
	} else {
		faceUp("div.card:contains('" + activeCard + "')");
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
		});
	});

}

function makeDroppable() {
	$( "div.playUp" ).droppable({
    	drop: function( event, ui ) {
    		console.log("up")
        	playCard(ui.draggable, faceUp);
    	}
    });
    $( "div.playDown" ).droppable({
    	drop: function( event, ui ) {
    		console.log("down")
        	playCard(ui.draggable, faceDown);
    	}
    });

    $("div.playerStation").droppable({
    	drop: function( event, ui ) {
    		var currentStation = $(this).html();
        	takeCard(currentStation, ui.draggable);
    	}
    });
}

// $(function() {
//     $( "#draggable" ).draggable();
//     $( "#droppable" ).droppable({
//       drop: function( event, ui ) {
//         $( this )
//           .addClass( "ui-state-highlight" )
//           .find( "p" )
//             .html( "Dropped!" );
//       }
//     });
//   });

//on load functions

makeDeck();
shuffle(deck);
touchFlip();
tapDeck();
droppableDeck();
//playCard();


