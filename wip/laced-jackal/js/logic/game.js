import Wrestler from "./wrestler.js"
import select from "../helpers/select.js"

class Game {
	constructor(){
		this.gameCount = 1
		this.playerWins = 0
		this.cpuWins = 0

		// Base settings
		this.firstTo = 2

		// Laced Jackal is the player character!
		// He does not come with a probability object because your actions 
		// dictate what he does.
		this.playerCharacter = new Wrestler({ name: 'Laced Jackal' })
		
		// DOM junk
		this.header = select('h1')

		this.playerButton = select('.player-action__btn')
		this.resetButton = select('.reset__btn')
		this.continueButton = select('.continue__btn')

		this.outputContainer = select('.game-output__container')
		this.countOutput = select('.game-output__count')
		this.playerOutput = select('.game-output__count--player')
		this.cpuOutput = select('.game-output__count--cpu')

		this.opponentLabel = select('.game-output__current-opponent-label')
		this.opponentName = select('.game-output__current-opponent-name')

		// Potential Opponents?
		// Tiny Children (does anything? only do drills? play? Ossu?)
		// Jobber Ken (thin + basic, grapple only)
		// Faux Nakano (taunt based chunk girl)
		// Kareem Littlejohn (tiny man, grapple and strikes)
		// Rina + Obi + Kagetsu (strikes + taunt)
		// Ringkamfe adjace? (strikes)
		// Yuuna Hashimoto (stocky grapple girl, grapples + strikes)
		// Ryota Hamada (also animal masked wrestler, strikes + taunt)
		// Adam Rambeau (lovecraft loving powerhouse, grapples + armor)
		// The Boss (he got a gun!?)
		this.opponents = [
			new Wrestler({ 
				name: 'Jobber Kent', 
				actionProbability: {
					grapple: 1,
				},
				isDefeated: false,
			}),
			new Wrestler({ 
				name: 'Jobber Brett', 
				actionProbability: {
					strike: 1,
				},
				isDefeated: false,
			}),
			new Wrestler({ 
				name: 'Faux Nakano', 
				actionProbability: {
					taunt: 5,
					grapple: 1,
					strike: 2,
				},
				isDefeated: false,
			}),
		]
		this.numberOfOpponents = this.opponents.length
		this.resultsMessage
		this.resultsHtml
	}

	init(){
		this.opponentName.innerHTML = `${this.activeOpponent.name} ${[localStorage.reigningChampion === this.activeOpponent.name ? ` 👑` : ``]}`
	}

	get defeatedOpponents() {
		return this.opponents.filter( opponent => opponent.isDefeated )
	}

	get activeOpponent(){
		const firstAvailable = this.opponents.find( opponent => !opponent.isDefeated )

		if (firstAvailable === undefined) { return undefined }

		this.opponentName.innerHTML = firstAvailable.name
		
		if ( localStorage.reigningChampion === firstAvailable.name ) this.opponentName.innerHTML += ` 👑` 
		
		return firstAvailable
	}

	get results () {
		return this.resultsHtml
	}
	set results(html) {
		return this.resultsHtml = html
	}

	play(playerAction, cpuAction = this.activeOpponent.move()){
		// If wanting to mutate a destructured object inside of itself, use this
		// Also, do not destructure outside and inside of the object if using this. Things get weird.
		const { type:playerType, beats:playerBeats } = playerAction
		const { name:cpuName, type:cpuType, losesTo:cpuLosesTo } = cpuAction

		console.group(`Play actions:`)
		console.table([playerAction, cpuAction])
		console.groupEnd()

		if ( cpuType === playerType ) {
			this.draw()
		} else if ( playerBeats.includes(cpuType) || cpuLosesTo.includes(playerType) ) {
			this.win()
		} else {
			this.lose()
		}

		this.results = `<div class="game-results">
			<span class="game-results__header">Game ${this.gameCount}</span>
			<div class="player-wrestler">${playerAction.textOutput}</div>
			<div class="cpu-wrestler">${cpuAction.textOutput}</div>
			<div class="outcome">${this.resultsMessage}</div>
		</div>`

		this.gameCount++
	}

	win(){
		this.playerWins++
		this.playerOutput.innerText = this.playerWins

		const onLastOpponent = this.numberOfOpponents - 1 === this.defeatedOpponents.length
		const opponentDefeated = this.playerWins === this.firstTo

		if (onLastOpponent && opponentDefeated) {
			this.resultsMessage = `You won! ${this.activeOpponent.name} has been <strong>defeated</strong>.`
			this.next()
		} else if (opponentDefeated) {
			this.resultsMessage = `You won! ${this.activeOpponent.name} has been <strong>defeated</strong>.`
			this.playerButton.forEach( button => { button.setAttribute('disabled', true) })
			this.continueButton.removeAttribute('disabled')
		} else if (this.activeOpponent === undefined) {
			this.resultsMessage = `You survived!`
		} else {
			this.resultsMessage = `You won!`
		}
	}

	lose(){
		this.cpuWins++
		this.cpuOutput.innerText = this.cpuWins

		const youAreDefeated = this.cpuWins === this.firstTo

		if (youAreDefeated) {
			this.playerButton.forEach( button => { button.setAttribute('disabled', true) })
			this.resetButton.removeAttribute('disabled')
			this.header.innerHTML = `Laced Jackal`
			this.opponentLabel.innerHTML = `Current Champion`
			localStorage.reigningChampion = this.activeOpponent.name
		}

		this.resultsMessage = youAreDefeated ? `You lost. <strong>Game over</strong>.` : `You win!`
	}

	draw(){
		if (this.cpuWins < (this.firstTo - 1) && this.playerWins < (this.firstTo - 1)) {
			this.cpuWins++
			this.playerWins++
			this.playerOutput.innerText = this.playerWins
			this.cpuOutput.innerText = this.cpuWins
		}

		this.resultsMessage = `Draw game!`
	}

	reset(){
		this.playerWins = 0
		this.cpuWins = 0
		this.gameCount = 1

		this.opponents.forEach( opponent => {
			opponent.isDefeated = false
		})

		this.opponentName.innerHTML = localStorage.reigningChampion === this.activeOpponent.name ? `${this.activeOpponent.name} 👑` : this.activeOpponent.name
		this.playerButton.forEach( button => button.removeAttribute('disabled') )
		this.countOutput.forEach( count => count.innerText = 0 )
		this.outputContainer.innerHTML = ``
		this.opponentLabel.innerHTML = `Current opponent`
		this.resetButton.setAttribute('disabled', true)
		this.continueButton.setAttribute('disabled', true)

		if ( localStorage.reigningChampion) {
			if ( localStorage.reigningChampion === 'Laced Jackal') {
				this.header.innerHTML = `Laced Jackal 👑`
			} else {
				this.header.innerHTML = `Laced Jackal`
			}
		}
	}

	next() {
		this.activeOpponent.isDefeated = true

		if (this.activeOpponent) {			
			this.playerWins = 0
			this.cpuWins = 0
			this.cpuOutput.innerText = this.cpuWins
			this.playerOutput.innerText = this.playerWins

			this.opponentName.innerHTML = this.activeOpponent.name
		} else {
			this.congratulations()
		}

		this.playerButton.forEach( button => button.removeAttribute('disabled') )
		this.continueButton.setAttribute('disabled', true)
	}

	congratulations(){
		this.playerButton.forEach( button => button.setAttribute('disabled', true) )
		this.continueButton.setAttribute('disabled', true)
		this.resetButton.removeAttribute('disabled')
		this.opponentName.innerHTML = `No one. <strong>You are the champ!</strong>`

		this.header.innerHTML = `Laced Jackal 👑`
		localStorage.reigningChampion = `Laced Jackal`
	}
}

export default Game