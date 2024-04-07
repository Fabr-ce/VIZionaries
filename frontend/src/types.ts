export type gameParams = any
export type roundDecision = { amount: number }
export type gameState = {
	id: number
	adminId: string | null
	nextRound: number
	treesLeft: number
	finishedGame: boolean
	runningRound: boolean
	inGameRules: boolean
	players: {
		socketId: string
		name: string
		decisions: roundDecision[]
		treeCount: number
	}[]
}
