class Wrestler {
	// Return whichever action to wrestler, via the player or the CPU, goes for
	// Set up in returning an object so adding extra conditions and actions easier
	// e.g. - Someone cheating and pulling out a gun would beat everything

	constructor( details = {} ){
		this.name = details.name
		this.actionProbability = details.actionProbability
		this.isDefeated = details.isDefeated
	}

	get grapple(){
		return {
			name: this.name,
			type: 'grapple',
			beats: 'strike',
			losesTo: ['grapple', 'taunt'],
			textOutput: `${this.name} went for the grapple!`,
		}
	}

	get strike() {
		return {
			name: this.name,
			type: 'strike',
			beats: 'taunt',
			losesTo: ['strike', 'grapple'],
			textOutput: `${this.name} threw a strike!`,
		}
	}

	get taunt() {
		return {
			name: this.name,
			type: 'taunt',
			beats: 'grapple',
			losesTo: ['strike', 'taunt'],
			textOutput: `${this.name} taunted!`,
		}
	}

	get gun() {
		return {
			name: this.name,
			type: 'gun',
			beats: ['grapple', 'taunt', 'strike'],
			losesTo: ['skip'],
			textOutput: `${this.name} pulled out a gun!`,
		}
	}

	get skip(){
		return {
			name: this.name,
			type: 'skip',
			beats: ['grapple', 'taunt', 'strike', 'gun'],
			losesTo: [],
			textOutput: `${this.name} cheated!`,
		}
	}

	move(){
		const arrayedActions = []
		for (const [key, value] of Object.entries(this.actionProbability)) {
			let i

			for (i = 0; i < value; i++) {
				arrayedActions.push(key)
			}
		}
		const condensedArray = [...new Set(arrayedActions)]
		const needsCollapsing = condensedArray.length === 1 && arrayedActions.length >= 1

		const actions = needsCollapsing ? condensedArray : arrayedActions

		const chooseAction = Math.floor(Math.random() * (actions.length - 1))
		const action = this[actions[chooseAction]]

		return action
	}
}

export default Wrestler