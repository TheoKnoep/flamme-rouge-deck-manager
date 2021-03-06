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
			let textColor = '#fff'; 
			if (this.cards[i].special === 'montagne') { textColor = 'red' }
			else if (this.cards[i].special === 'descente') { textColor = 'blue' }
			htmlInsert += `<a id="cardchoice-${i}" class="cardchoice cardchoice-style" href="#" style="background-image: url('${this.cards[i].image}'); color: ${textColor}">${this.cards[i].value}<br/><span class="small-text">${this.cards[i].special ? this.cards[i].special : ''}</span></a>`; 
		}
		return htmlInsert; 
	}

	displayLastPlayedCard() {
		let index = this.played.length - 1; 
		let textColor = '#fff'; 
		if (this.played[index].special === 'montagne') { textColor = 'red' }
		else if (this.played[index].special === 'descente') { textColor = 'blue' }
		let htmlInsert = `<a id="show-last-played-card" class="cardchoice-style" href="#" style="background-image: url('${this.played[index].image}'); color: ${textColor}">${this.played[index].value}<br/><span class="small-text">${this.played[index].special ? this.played[index].special : ''}</span></a>`; 
		return htmlInsert; 
	}

	displayHiddenCard() {
		let htmlInsert = `<a id="show-hidden-card" class="cardchoice-style" href="#" style="background-image: url('hidden.png'); "><span class="small-text"><em>Tapez pour r??v??ler la carte choisie</em></span></a>`; 
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
		if (typeof playedCard.special === 'string') {
			this.applySpecialRule(playedCard.special, playedCard)
		} else {
			for (let i in playedCard.special) {
				this.applySpecialRule(playedCard.special[i], playedCard); 
			}
		}
		
	}

	applySpecialRule(ruleName, playedCard) {
		if (ruleName === 'montagne') {
			alert("La limite en ascension est de 6 cases au lieu de 5"); 
		} else if (ruleName === 'r??cup??ration') {
			alert('Suppression d\'une carte fatigue'); 
			this.deleteExhaustion(); 
		} else if (ruleName === 'super aspiration') {
			alert('Le coureur b??n??ficie de 2 cases d\'aspiration au lieu d\'une'); 
		} else if (ruleName === 'endurance') {
			alert("La carte jou??e est remise dans la pile des cartes recycl??es"); 
			this.recyclePlayedCard(playedCard); 
		} else if (ruleName === 'descente') {
			alert("Le d??placement en descente est de 7 cases au lieu de 5"); 
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