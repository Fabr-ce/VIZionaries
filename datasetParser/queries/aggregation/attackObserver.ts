import { Action, Actions, Attack, AttackOutcomes, Point } from "../../parser/stats/types"
import { VolleyPosition } from "../types"
import { DataAggregation, MeanScoreObserver } from "./observer"

export class PointAttack extends MeanScoreObserver {
	static position = [VolleyPosition.Outside, VolleyPosition.Middle, VolleyPosition.Opposite, VolleyPosition.Setter]
	name = "pointAttack"
	action = Actions.Attack

	getScore(action: Action, point: Point): number | null {
		return action.outcome === "#" ? 1 : 0
	}
}

export class FaultAttack extends MeanScoreObserver {
	static position = [VolleyPosition.Outside, VolleyPosition.Middle, VolleyPosition.Opposite, VolleyPosition.Setter]
	name = "faultAttack"
	action = Actions.Attack

	getScore(action: Action, point: Point): number | null {
		return action.outcome === "=" ? 1 : 0
	}
}

export class EffAttack extends MeanScoreObserver {
	static position = [VolleyPosition.Outside, VolleyPosition.Middle, VolleyPosition.Opposite, VolleyPosition.Setter]
	name = "effAttack"
	action = Actions.Attack

	getScore(action: Action, point: Point): number | null {
		if (action.outcome === "#") return 1
		if (action.outcome === "=") return -1
		return 0
	}
}

export const attackMeanObserver = [PointAttack, FaultAttack, EffAttack]

type AttackList = Partial<Attack> | { playerId: string }

export class GeneralAttack extends DataAggregation<AttackList> {
	action: Actions = Actions.Attack
	include(action: Action, point: Point): boolean {
		return true
	}
	mapToValue(action: Action, point: Point, playerId: string): AttackList {
		const { attackType, attackCombo, fromPos, toPos, toPosExact, attackSpeed, blockCount, outcome } =
			action as Attack
		return {
			attackType,
			attackCombo,
			fromPos,
			toPos,
			toPosExact,
			attackSpeed,
			blockCount,
			outcome,
			playerId,
		} as AttackList
	}
}

export const attackAggregations = [new GeneralAttack("./aggregation/data/GeneralAttack.json")]
