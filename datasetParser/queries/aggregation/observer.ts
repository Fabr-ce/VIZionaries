import { Action, Actions, Point } from "../../parser/stats/types"
import { getPositionFromAction } from "../helper"
import { VolleyPosition } from "../types"

export abstract class MeanScoreObserver {
	static readonly position: VolleyPosition[]
	abstract readonly name: string

	abstract readonly action: Actions
	readonly position: VolleyPosition

	private results: number[] = []

	constructor(position: VolleyPosition) {
		this.position = position
	}

	static createObserver() {
		const observers: MeanScoreObserver[] = []
		for (const pos of this.position) {
			observers.push(Reflect.construct(this, [pos]))
		}
		return observers
	}

	addAction(action: Action, point: Point): void {
		if (action.action !== this.action) return
		if (getPositionFromAction(action, point) !== this.position) return

		const score = this.getScore(action, point)

		if (score === null) return
		this.results.push(score)
	}

	getAggregation() {
		const totalSum = this.results.reduce((pre, curr) => pre + curr, 0)
		const mean = this.results.length === 0 ? 0 : totalSum / this.results.length
		const varianceSum = this.results.reduce((pre, curr) => pre + Math.pow(curr - mean, 2), 0)
		const variance = this.results.length === 0 ? 0 : varianceSum / this.results.length

		return [mean, variance]
	}

	abstract getScore(action: Action, point: Point): number | null
}

// Implementation Classes

/*
export class AttPointPerSet extends MeanScoreObserver {
	static position = [Position.A, Position.D, Position.M]
	static action = VolleyAction.AttPointPerSet

	getScore(player: FantasyResult, _: FantasyResult, game: Game): [number, number] {
		const setNr = this.getNrOfSets(game)
		const points = player.att[3]
		if (!points) return [0, 0]
		return [points / setNr, setNr]
	}
}

export class BlockPerSet extends MeanScoreObserver {
	static position = [Position.A, Position.D, Position.M, Position.S]
	static action = VolleyAction.BlockPerSet

	getScore(player: FantasyResult, _: FantasyResult, game: Game): [number, number] {
		const setNr = this.getNrOfSets(game)
		const points = player.bk
		if (!points) return [0, 0]
		return [points / setNr, setNr]
	}
}

//percent

export class RecePos extends MeanScoreObserver {
	static position = [Position.A, Position.L]
	static action = VolleyAction.RecePos

	public minAttemps = 5

	getScore(player: FantasyResult): [number, number] {
		return [player.rece[2], player.rece[0]]
	}
}

export class RecePerf extends MeanScoreObserver {
	static position = [Position.A, Position.L]
	static action = VolleyAction.RecePerf

	public minAttemps = 5

	getScore(player: FantasyResult): [number, number] {
		return [player.rece[3], player.rece[0]]
	}
}

export class AttPerc extends MeanScoreObserver {
	static position = [Position.A, Position.D, Position.M]
	static action = VolleyAction.AttPerc

	public minAttemps = 5

	getScore(player: FantasyResult): [number, number] {
		return [player.att[4], player.att[0]]
	}
}

export class AttEff extends MeanScoreObserver {
	static position = [Position.A, Position.D, Position.M]
	static action = VolleyAction.AttEff

	public minAttemps = 5

	getScore(player: FantasyResult): [number, number] {
		return [player.att[4] - player.att[2] - player.att[1], player.att[0]]
	}
}

export const observerTypes: (typeof MeanScoreObserver)[] = [
	AcePerSet,
	AttPointPerSet,
	RecePos,
	RecePerf,
	BlockPerSet,
	AttPerc,
	AttEff,
]
*/
