class Deck {
	constructor(name, color, arrayOfCards) {
		this.name = name;
		this.cards = arrayOfCards, 
		this.recycle = [],
		this.played = [], 
		this.id = this.generateID(); 
		this.color = this.verifyColor(color); 
	}

	init() {
		this.shuffleDeck(); 
		this.renderHTML(); 
		this.addStyle(); 
		this.addEventsHandler(); 
	}

	verifyColor(color) {
		let acceptable = [
			'green', 'red', 'pink', 'blue', 'black', 'purple'
		]; 
		if (acceptable.indexOf(color) < 0 ) {
			throw new Error('Color is not accepted'); 
		}
		return color; 
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
			let exhaustionClass = ''; 
			if (this.cards[i].special && this.cards[i].special === 'fatigue') {exhaustionClass = 'exhaustion' }

			else if (this.cards[i].special === 'descente') { textColor = 'blue' }
			htmlInsert += `<a id="cardchoice-${i}" class="${this.id}-cardchoice cardchoice-style ${exhaustionClass}" href="#" style="color: ${textColor}" data-value="${this.cards[i].value}">${this.cards[i].value}<br/><span class="small-text">${this.cards[i].special ? this.cards[i].special : ''}</span></a>`; 
		}
		return htmlInsert; 
	}

	displayLastPlayedCard() {
		let index = this.played.length - 1; 
		let textColor = '#fff'; 
		if (this.played[index].special === 'montagne') { textColor = 'red' }
		let exhaustionClass = ''; 
		if (this.played[index].special === 'fatigue') {exhaustionClass = 'exhaustion' }

		else if (this.played[index].special === 'descente') { textColor = 'blue' }

		let htmlInsert = `<a id="${this.id}-show-last-played-card" class="${this.id}-cardchoice-style cardchoice-style ${exhaustionClass}" href="#" color: ${textColor}">${this.played[index].value}<br/><span class="small-text">${this.played[index].special ? this.played[index].special : ''}</span></a>`; 
		return htmlInsert; 
	}

	displayHiddenCard() {
		let index = this.played.length - 1; 
		let htmlInsert = `<a id="${this.id}-show-hidden-card" class="${this.id}-cardchoice-style cardchoice-style cardchoice-style--hidden hidden" href="#"); " data-value="${this.played[index].value}"><span class="small-text hidden" data-value="${this.played[index].value}">Tapez pour révéler la carte choisie</span></a>`; 
		return htmlInsert; 
	}

	selectSingleCard(index) {
		//check if special rule applied : 
		console.log('la carte choisie a une règle spéciale ?', this.cards[index].special); 

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
			alert("La limite de mouvement en ascension est de 6 cases au lieu de 5"); 
		} else if (ruleName === 'récupération') {
			alert('Suppression d\'une carte fatigue'); 
			this.deleteExhaustion(); 
		} else if (ruleName === 'super aspiration') {
			alert('Le coureur bénéficie de 2 cases d\'aspiration au lieu d\'une'); 
		} else if (ruleName === 'endurance') {
			alert("La carte jouée est remise dans la pile des cartes recyclées"); 
			this.recyclePlayedCard(playedCard); 
		} else if (ruleName === 'descente') {
			alert("Le déplacement en descente est de 7 cases au lieu de 5"); 
		} else if (ruleName === 'troisième file') {
			alert("Le coureur peut bénéfier d'une file supplémentaire s'il termine son mouvement sur une case déjà complètement occupée"); 
		} else if (ruleName === 'pas d\'aspiration') {
			alert("Le coureur ne permet pas à un autre coureur de bénéficer de son aspiration"); 
		} else if(ruleName === 'aspiration en montagne') {
			alert("Le coureur peut bénéficier de l'aspiration donnée par un autre coureur même s'il est en ascension")
		} else if (ruleName === 'pas de fatigue') {
			alert("Le coureur ne prend pas de fatigue lors de ce tour quoi qu'il arrive"); 
		} else if (ruleName === 'attaque fulgurante') {
			alert("Ce coureur se déplace en premier quelle que soit sa position actuelle")
		}
	}

	addExhaustion() {
		this.recycle.push(new Card(2, 'fatigue', 'exhausted.png')); 
	}

	deleteExhaustion() {
		let index = -1; 
		for (let i in this.recycle) {
			if (this.recycle[i].special && this.recycle[i].special === 'fatigue') { 
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
			if (this.cards[i].special && this.cards[i].special === 'fatigue') { 
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

	countNumberOfExhaustion(pile) {
		pile.filter(card => {return card.special === 'fatigue' }); 
		return pile.filter(card => {return card.special === 'fatigue' }).length; 
	}


	renderHTML() {
		let content = `
			<div class="${this.id}-deck-container deck-container" id="${this.id}">
				<div class="${this.id}-pickbtn-container pickbtn-container ${this.color}">
					<div class="name-container"><strong>${this.name}</strong></div>
					<div class="${this.id}-tour-counter">Tour 1</div>
					<button id="${this.id}-pickcards-button">Piocher 4 cartes</button>
				</div>
				<div id="${this.id}-cardchoice-container"></div>
				<button id="${this.id}-endrace" class="endrace-btn">Fin de la course</button>
			</div>`; 
		document.querySelector('#app-container').insertAdjacentHTML('beforeend', content); 
	}




	addEventsHandler() {
			window.addEventListener('click', event => {
				console.log(event.target); 
				if (event.target.id === `${this.id}-pickcards-button`) {
					document.querySelector(`#${this.id}-cardchoice-container`).innerHTML = this.displayFourCards(); 
					
					document.getElementById(`${this.id}-pickcards-button`).setAttribute('disabled', 'true'); 
					document.getElementById(`${this.id}-pickcards-button`).style.visibility = 'hidden'; 
				} else if (event.target.classList.contains(`${this.id}-cardchoice`)) {
					let indexOfSelectedCard = event.target.id.split('-')[1]; 
					this.selectSingleCard(indexOfSelectedCard); 
					document.querySelector(`#${this.id}-cardchoice-container`).innerHTML = this.displayHiddenCard(); 
				} else if (checkParentsID(event.target, `${this.id}-show-hidden-card`) ) {
					document.querySelector(`#${this.id}-cardchoice-container`).innerHTML = this.displayLastPlayedCard(); 
				} else if (event.target.id === `${this.id}-show-last-played-card`) {
					document.querySelector(`#${this.id}-cardchoice-container`).innerHTML = `<button class="btn-exhaustion" id="${this.id}-add-exhaustion" style="font-weight: bold; background: linear-gradient(60deg,#d21818, #9e0000); font-size: 1.2em; border: none;">Fatigue</button><button class="btn-exhaustion" id="${this.id}-skip-exhaustion">pas de fatigue</button>`; 
				} else if (event.target.id === `${this.id}-add-exhaustion`) {
					this.addExhaustion(); 
					document.querySelector(`#${this.id}-cardchoice-container`).innerHTML = ''; 
					//update tours counter : 
					document.querySelector(`.${this.id}-tour-counter`).innerHTML = `Tour ${this.played.length + 1}`; 
					document.getElementById(`${this.id}-pickcards-button`).removeAttribute('disabled');  
					document.getElementById(`${this.id}-pickcards-button`).style.visibility = 'visible';
					console.log("Etat actuel : ", this); 
				} else if (event.target.id === `${this.id}-skip-exhaustion`) {
					document.querySelector(`#${this.id}-cardchoice-container`).innerHTML = ''; 
					//update tours counter : 
					document.querySelector(`.${this.id}-tour-counter`).innerHTML = `Tour ${this.played.length + 1}`;
					document.getElementById(`${this.id}-pickcards-button`).removeAttribute('disabled');  
					document.getElementById(`${this.id}-pickcards-button`).style.visibility = 'visible';
					console.log("Etat actuel : ", this); 
				}  
			});
			document.querySelector(`#${this.id}-endrace`).addEventListener('click', event => {
				if(confirm("Êtes-vous sûr ?")) {
					let numberOfFatiguesLeft = this.countNumberOfExhaustion(this.recycle) + this.countNumberOfExhaustion(this.cards); 
					document.querySelector(`#${this.id}-cardchoice-container`).innerHTML = `<p style="width: 100%; ">Course terminée !</p><p style="width: 100%; ">Il reste ${numberOfFatiguesLeft} cartes fatigues</p>`; 
				}
			}); 
	}

	addStyle() {
		let style = `
			.${this.id}-pickbtn-container {
				width: 100%; 
				display: flex; 
				justify-content: center;
				align-items: center;
				color: white; 
				border-radius: 0 0 4px 4px; 
			}
			.${this.id}-tour-counter {
				margin-right: auto; 
				margin-left: 12px; 
			}
			#${this.id}-pickcards-button {
				margin-right: 12px;
				padding: 2em;
				border: none; 
				background-color: rgba(255,255,255,0.25);
				cursor: pointer;
				color: white; 
			}
			#${this.id}-pickcards-button:active {
				background-color: rgba(255,255,255,0.55);
			}
			
			#${this.id}-cardchoice-container {
				width: 100%; 
				height: 80vh;
				display: flex; 
				flex-wrap: wrap;
				justify-content: center;
			}
			
			.${this.id}-cardchoice-style {
				width: calc( 50% - 24px ); 
				height: calc(40vh - 24px); 
				background-size: cover;
				background-position: center;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				text-align: center;
				color: #fff;
				text-decoration: none;
				font-size: 4em; 
				margin: 12px;
				border-radius: 12px;
				box-shadow: 2px 2px 8px rgba(0,0,0,.25); 
				text-shadow: 1px 1px 3px rgba(0,0,0,.95); 
			}
			
			.btn-exhaustion {
				margin: 12px; 
				height: 48px; 
				width: 220px;
			}
			#${this.id}-add-exhaustion {
				font-weight: bold;
			}
			#${this.id}-skip-exhaustion {
				opacity: .85; 
				font-style: italic;
			}`; 
		document.head.insertAdjacentHTML('beforeend', `<style>${style}</style>`); 
	}






	generateID() {
		let letters = 'AZERTYUIOPQSDFGHJKLMWXCVBN'; 
		let numbers = '1234567890'; 
		let output = letters[ Math.floor(Math.random() * letters.length) ]; 
		let numberOfCharacters = 6; 
		for (let i = 0; i < numberOfCharacters-1; i++) {
			output += numbers[Math.floor(Math.random() * numbers.length)]; 
		}
		return output; 
	}




	static racersProfiles() {
		return {
			sprinteur: [
				new Card(2),
				new Card(2),
				new Card(2),
				new Card(3),
				new Card(3),
				new Card(3),
				new Card(4),
				new Card(4),
				new Card(4),
				new Card(5),
				new Card(5),
				new Card(5),
				new Card(9),
				new Card(9),
				new Card(9)
			],
			rouleur: [
				new Card(3),
				new Card(3),
				new Card(3),
				new Card(4),
				new Card(4),
				new Card(4),
				new Card(5),
				new Card(5),
				new Card(5),
				new Card(6),
				new Card(6),
				new Card(6),
				new Card(7),
				new Card(7),
				new Card(7)
			],
			puncheur: [ 
				new Card(3), 
				new Card(3), 
				new Card(3), 
				new Card(4), 
				new Card(4), 
				new Card(5), 
				new Card(5),
				new Card(5),
				new Card(6),
				new Card(6),
				new Card(7),
				new Card(7),
				new Card(7), 
				new Card(8, ['attaque fulgurante', 'pas de fatigue'])
			], 
			flahute: [ 
				new Card(2), 
				new Card(2),
				new Card(2), 
				new Card(3), 
				new Card(3), 
				new Card(3), 
				new Card(4), 
				new Card(4), 
				new Card(5), 
				new Card(5),
				new Card(5),
				new Card(9), 
				new Card(6, "troisième file"), 
				new Card(9, "troisième file"), 
				new Card(9, "troisième file")
			], 
			polyvalent: [
				new Card(2),
				new Card(2),
				new Card(2),
				new Card(3),
				new Card(3),
				new Card(3),
				new Card(4),
				new Card(5),
				new Card(5),
				new Card(5),
				new Card(9),
				new Card(9),
				new Card(9), 
				new Card(6), 
				new Card(6)
			], 
			grimpeur: [
				new Card(3), 
				new Card(3),
				new Card(3),
				new Card(4, 'aspiration en montagne'),
				new Card(4, 'aspiration en montagne'),
				new Card(4, 'aspiration en montagne'),
				new Card(5),
				new Card(5),
				new Card(5),
				new Card(6, 'montagne'),
				new Card(6, 'montagne'),
				new Card(6, 'montagne'),
				new Card(7),
				new Card(7),
				new Card(7)
			], 
			descender: [
				new Card(2),
				new Card(2),
				new Card(2),
				new Card(3, ['descente', 'récupération']),
				new Card(3, ['descente', 'récupération']),
				new Card(3, ['descente', 'récupération']),
				new Card(4),
				new Card(4),
				new Card(4),
				new Card(5),
				new Card(5),
				new Card(5),
				new Card(9),
				new Card(9),
				new Card(9)
			], 
			domestique: [
				new Card(3),
				new Card(3),
				new Card(3),
				new Card(4, 'récupération'),
				new Card(4, 'récupération'),
				new Card(4, 'récupération'),
				new Card(5),
				new Card(5),
				new Card(5),
				new Card(6),
				new Card(6),
				new Card(6),
				new Card(7),
				new Card(7),
				new Card(7)
			], 
			pur_grimpeur: [
				new Card(2), 
				new Card(2), 
				new Card(2), 
				new Card(3, 'aspiration en montagne'), 
				new Card(3, 'aspiration en montagne'), 
				new Card(3, 'aspiration en montagne'), 
				new Card(4),
				new Card(4),
				new Card(4),
				new Card(5),
				new Card(5),
				new Card(5), 
				new Card(6, 'super montagne'),
				new Card(6, 'super montagne'),
				new Card(6, 'super montagne') 
			]
		}
	}
}