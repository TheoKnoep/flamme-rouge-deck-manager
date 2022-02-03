class Card {
	constructor(value, special = null, image = null) {
		this.value = value,
		this.image = image ? 'exhausted.png' : this.getImage(this.value),
		this.special = special
	}

	cancelExhaustion(arrayOfCards = []) {
		let index = arrayOfCards.indexOf(2); 
		if (index > 0) {
			arrayOfCards.splice(index, 1); 
		}
		return arrayOfCards; 
	}
	getImage(value) {
		if (value < 5 ) {
			return 'calm.png'; 
		} else if (value < 8) {
			return 'rouleur.png'; 
		} else {
			return 'attack.png'; 
		}
	}

	displayCard() {
		let htmlInsert = `<a href="#">${this.value}</a>`; 
		return htmlInsert; 
	}
}