const game = {
	bankroll: 1000,
	cards: [2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King', 'As'],
	minValue: 0,
	maxValue: 12,
	elements: () => {
		bankAmount = document.querySelector('#bankroll')
		buttonPlay = document.querySelector('#bet-play')
		buttonPlayAgain = document.querySelector('#bet-again')
		formBet = document.querySelector('#bet-form')
		betInput = document.querySelector('#bet-input')
		cardLeft = document.querySelector('#card-min')
		cardRight = document.querySelector('#card-max')
		cardMiddle = document.querySelector('#card-guessed')
		boardMessage = document.querySelector('#board-message')
	},
	randomInteger(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min
	},
	getTwoNumbers: (min, max) => {
		let number1 = game.randomInteger(min, max)
		let number2 = game.randomInteger(min, max)

		if (number1 == number2) {
			number2 = game.randomInteger(min, max)
		}
		return {
			min: Math.min(number1, number2),
			max: Math.max(number1, number2),
			random: '?',
		}
	},
	randomizeCard: () => {
		game.valuesCards = game.getTwoNumbers(game.minValue, game.maxValue)
	},
	animateTurnOver: (elements) => {
		let firstFlipAnimation = `board__card--flip-1`
		let SecondFlipAnimation = `board__card--flip-2`

		if (elements === 'dealCards') {
			cardLeft.classList.add(SecondFlipAnimation)
			cardRight.classList.add(SecondFlipAnimation)
			cardMiddle.classList.add(firstFlipAnimation)
		} else if (elements === 'reshuffledCard') {
			cardMiddle.classList.add(SecondFlipAnimation)
			cardLeft.classList.add(firstFlipAnimation)
			cardRight.classList.add(firstFlipAnimation)
			let soundCardDeal = new Audio('audio/dealing-card.wav')
			soundCardDeal.play()
		} else {
			cardMiddle.classList.add(SecondFlipAnimation)
			let soundCardFlip = new Audio('audio/card-flip.wav')
			soundCardFlip.play()
		}
	},
	displayCards: () => {
		game.hideCard()

		game.animateTurnOver('dealCards')
		setTimeout(() => {
			cardLeft.classList.add(
				`board__card--${game.cards[game.valuesCards.min]}`
			)
			cardRight.classList.add(
				`board__card--${game.cards[game.valuesCards.max]}`
			)
		}, 200)
	},
	turnOverGuessingCard: () => {
		game.valuesCards.random = game.randomInteger(
			game.minValue,
			game.maxValue
		)
		cardRight.classList.remove(`board__card--flip-2`)
		cardLeft.classList.remove(`board__card--flip-2`)

		setTimeout(() => {
			cardMiddle.className = `board__card board__card--${
				game.cards[game.valuesCards.random]
			}`
		}, 340)
		game.animateTurnOver()
	},
	showBetForm: () => {
		buttonPlayAgain.style.display = 'none'
		buttonPlay.style.display = 'none'
		formBet.style.display = 'block'
	},
	showPlayAgain: () => {
		formBet.style.display = 'none'
		buttonPlayAgain.style.display = 'block'
	},
	handleActionPlayer: () => {
		buttonPlay.addEventListener('click', () => {
			game.launch()
			game.showBetForm()
		})
		buttonPlayAgain.addEventListener('click', () => {
			game.showBetForm()
			game.animateTurnOver('reshuffledCard')
			game.launch()
		})
		formBet.addEventListener('submit', (event) => {
			event.preventDefault()
			game.handleError(event.target[0].value)
		})
	},
	handleError: (amount) => {
		if (amount > game.bankroll) {
			game.handleMessage('Impossible to bet, insufficient token')
		} else if (amount <= 0) {
			game.handleMessage('Please bet a number greater than zero')
		} else {
			game.handleResult(amount)
			game.showPlayAgain()
		}
	},
	handleResult: (betValue) => {
		game.turnOverGuessingCard()
		let cardMin = game.valuesCards.min
		let cardMax = game.valuesCards.max
		let cardRandom = game.valuesCards.random

		if (cardRandom > cardMin && cardRandom < cardMax) {
			let doubledGain = betValue * 2
			game.bankroll = game.bankroll + doubledGain
			game.handleMessage(
				`Well done you have won ${doubledGain} Token !`
			)
		} else if (cardRandom === cardMin || cardRandom === cardMax) {
			let threefoldGain = betValue * 3
			game.bankroll = game.bankroll + threefoldGain
			game.handleMessage(
				`Perfect! Tripled bet ${threefoldGain} Token added`
			)
		} else {
			game.bankroll = game.bankroll - betValue
			game.handleMessage(
				`Unlucky, you lost ${betValue} Token !`
			)
		}
		game.handleBankRoll()
	},
	handleMessage: (text) => {
		boardMessage.textContent = text
	},
	handleBankRoll: () => {
		bankAmount.textContent = `Bank: ${game.bankroll} Token`
	},
	hideCard: () => {
		cardLeft.className = 'board__card board__card--undefined'
		cardRight.className = 'board__card board__card--undefined'
		cardMiddle.className = 'board__card board__card--undefined'
	},
	launch: () => {
		game.handleMessage('')
		game.randomizeCard()
		game.displayCards()
		game.handleBankRoll()
	},
	init: () => {
		game.elements()
		game.hideCard()
		game.handleActionPlayer()
	},
}

document.addEventListener('DOMContentLoaded', game.init)
