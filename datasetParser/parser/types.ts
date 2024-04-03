import { Point } from "./stats/types"

export type matchDetails = {
	date?: string
	time?: string
	tournament?: string
	matchNr?: string
	score: SetType[]
}

export type SetType = {
	intermediate: [number, number][]
	final: [number, number]
}

export interface TeamInfo {
	code: number
	name: string
	headCoach?: string
	assistantCoach?: string
	players: PlayerType[]
}

export interface PlayerType {
	number: number
	code: number
	lastName: string
	firstName: string
	isLibero: boolean
}

export type matchData = {
	matchDetails: matchDetails
	homeTeam: TeamInfo
	awayTeam: TeamInfo
	sets: Point[][]
}
