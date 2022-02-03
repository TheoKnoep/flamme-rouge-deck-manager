class Deck {
	constructor(arrayOfCards) {
		this.cards = arrayOfCards, 
		this.recycle = [],
		this.played = []
	}

	shuffleDeck(array = this.cards) {
		let curId = array.length;
		// There remain elements to shuffle
		while (0 !== curId) {
			// Pick a remaining element
			let randId = Math.floor(Math.random() * curId);
			curId -= 1;
			// Swap it with the current element.
			let tmp = array[curId];
			array[curId] = array[randId];
			array[randId] = tmp;
		}
		return array;
	}

	displayFourCards() {
		let htmlInsert = ''; 
		if (this.cards.length >= 4) {
			htmlInsert = this.createHtmlCards(4); 
		} else {
			let tempHand = [...this.cards]; 
			this.cards.length = 0; 
			this.cards = [...this.recycle]; 
			this.recycle.length = 0; 
			this.cards = this.shuffleDeck(this.cards);  
			this.cards = tempHand.concat(this.cards); 
			if (this.cards.length >= 4) {
				htmlInsert = this.createHtmlCards(4); 
			} else if (this.cards.length === 0) {
				htmlInsert = 'Le paquet de carte est vide'; 
			} else {
				htmlInsert = this.createHtmlCards(this.cards.length); 
			}
		}
		return htmlInsert; 
	}

	createHtmlCards(length) {
		let htmlInsert = ''; 
		for (let i = 0; i < length; i++) {
			htmlInsert += `<a id="cardchoice-${i}" class="cardchoice" href="#" style="background-image: url('${this.cards[i].image}'); ${this.cards[i].special === 'montagne' ? 'color: red' : ''}">${this.cards[i].value}<br/>${this.cards[i].special ? this.cards[i].special : ''}</a>`; 
		}
		return htmlInsert; 
	}

	selectSingleCard(index) {
		//check if special rule applied : 
		console.log(this.cards[index].special); 

		this.checkSpecialRule(this.cards[index]); 
		
		//delete the played card of the game
		this.played.push(this.cards[index]); 
		this.cards.splice(index, 1); 

		//put the no-played card in the recycle array
		let maxIndex = Math.min(3, this.cards.length); 
		for (let i = 0; i < maxIndex; i++) {
			this.recycle.push(this.cards[i]); 
		}

		//delete the 3 first cards of the pile : 
		for (let i = 0; i < 3; i++) {
			this.cards.shift(); 
		}
	}

	checkSpecialRule(playedCard) {
		if (playedCard.special === 'montagne') {
			alert('Pas de limite en ascension'); 
		} else if (playedCard.special === 'récupération') {
			alert('Suppression d\'une carte fatigue'); 
			this.deleteExhaustion(); 
		} else if (playedCard.special === 'super aspiration') {
			alert('Le coureur bénéficie de 2 cases d\'aspiration au lieu d\'une'); 
		} else if (playedCard.special === 'endurance') {
			alert("La carte jouée est remise dans la pile des cartes recyclées"); 
			this.recyclePlayedCard(playedCard); 
		}
	}

	addExhaustion() {
		this.recycle.push(new Card(2, null, 'exhausted.png')); 
	}

	deleteExhaustion() {
		let index = -1; 
		for (let i in this.recycle) {
			if (this.recycle[i].image === 'exhausted.png') { 
				index = i; 
				break; 
			}
		}
		if (index > -1) {
			this.recycle.splice(index, 1); 
			return '1 exhaustion deleted in recycle'; 
		} 
		
		console.log('no exhaustion founded in recycle'); 

		for (let i in this.cards) {
			if (this.cards[i].image === 'exhausted.png') { 
				index = i; 
				break; 
			}
		}
		if (index > -1) {
			this.cards.splice(index, 1); 
			return '1 exhaustion deleted in cards'; 
		} 

		console.log('no exhaustion found at all'); 
	}
	recyclePlayedCard(playedCard) {
		this.recycle.push(playedCard); 
	}
}