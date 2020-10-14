import select from "./helpers/select.js"
import Game from "./logic/game.js"
import Wrestler from "./logic/wrestler.js"

// If object is destrutured, it loses its scope
// Either use self when destructuring functions that would normally use `this`
// or use self and destructure it at your hearts content
const game = new Game()

game.init()

if (localStorage.reigningChampion) {
	if (localStorage.reigningChampion === 'Laced Jackal') game.header.innerHTML += ` 👑`
}

game.playerButton.forEach( item => {

	item.addEventListener('click', e => {

		const wrestler_container = select('.game-output__container')
		const wrestlersAction = item.getAttribute('data-action')

		if (game.activeOpponent !== undefined) {
			game.play(game.playerCharacter[wrestlersAction])
			wrestler_container.innerHTML += game.results
		}

		if ( game.activeOpponent === undefined ) game.congratulations()
	})

})

game.continueButton.addEventListener('click', e => game.next() )

game.resetButton.addEventListener('click', e => game.reset() )