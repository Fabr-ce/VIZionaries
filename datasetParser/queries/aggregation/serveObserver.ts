import { Action, Actions, Point, Serve } from "../../parser/stats/types"
import { matchData } from "../../parser/types"
import { VolleyPosition } from "../types"
import { DataAggregation, MeanScoreObserver } from "./observer"
import fs from "fs/promises"

export class AceServe extends MeanScoreObserver {
	static position = [VolleyPosition.Outside, VolleyPosition.Middle, VolleyPosition.Opposite, VolleyPosition.Setter]
	name = "aceServe"
	action = Actions.Serve

	getScore(action: Action, point: Point): number | null {
		return action.outcome === "#" ? 1 : 0
	}
}

export class FaultServe extends MeanScoreObserver {
	static position = [VolleyPosition.Outside, VolleyPosition.Middle, VolleyPosition.Opposite, VolleyPosition.Setter]
	name = "faultServe"
	action = Actions.Serve

	getScore(action: Action, point: Point): number | null {
		return action.outcome === "=" ? 1 : 0
	}
}

export class EffServe extends MeanScoreObserver {
	static position = [VolleyPosition.Outside, VolleyPosition.Middle, VolleyPosition.Opposite, VolleyPosition.Setter]
	name = "effServe"
	action = Actions.Serve

	getScore(action: Action, point: Point): number | null {
		if (action.outcome === "#") return 1
		if (action.outcome === "=") return -1
		return 0
	}
}

export const serveMeanObserver = [AceServe, FaultServe, EffServe]

type ServiceList = Partial<Serve> | { playerId: string }

export class GeneralServe extends DataAggregation<ServiceList> {
	action: Actions = Actions.Serve
	include(action: Action, point: Point): boolean {
		return true
	}
	mapToValue(action: Action, point: Point, playerId: string): ServiceList {
		const { type, fromPos, toPos, toPosExact, outcome } = action as Serve
		return {
			type,
			fromPos,
			toPos,
			toPosExact,
			outcome,
			playerId,
		} as ServiceList
	}
}

type PlayerList = {
	number: number
	code: string
	firstName: string
	lastName: string
	isLibero: boolean
	team: string
}

export class GeneralPlayer extends DataAggregation<PlayerList> {
	action: Actions = Actions.Serve
	players: Map<string, PlayerList> = new Map()

	setMatch(match: matchData) {
		for (const homeTeam of match.homeTeam.players) {
			const { code, firstName, isLibero, lastName, number } = homeTeam
			this.players.set(homeTeam.code, {
				code,
				firstName: firstName.toLowerCase().replace(/(^\w)|([-\s]\w)/g, m => m.toUpperCase()),
				isLibero,
				lastName: lastName.toLowerCase().replace(/(^\w)|([-\s]\w)/g, m => m.toUpperCase()),
				number,
				team: match.homeTeam.name,
			})
		}
		for (const awayTeam of match.awayTeam.players) {
			const { code, firstName, isLibero, lastName, number } = awayTeam
			this.players.set(awayTeam.code, {
				code,
				firstName: firstName.toLowerCase().replace(/(^\w)|([-\s]\w)/g, m => m.toUpperCase()),
				isLibero,
				lastName: lastName.toLowerCase().replace(/(^\w)|([-\s]\w)/g, m => m.toUpperCase()),
				number,
				team: match.awayTeam.name,
			})
		}
	}

	async export() {
		const data = JSON.stringify(Array.from(this.players.values()))
		await fs.writeFile(this.path, data)
	}

	include(action: Action, point: Point): boolean {
		return false
	}
	mapToValue(action: Action, point: Point, playerId: string): PlayerList {
		return {} as PlayerList
	}
}

export const serveAggregations = [
	new GeneralServe("./aggregation/data/GeneralServe.json"),
	new GeneralPlayer("./aggregation/data/GeneralPlayer.json"),
]
