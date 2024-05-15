import { Action, Actions, Attack, Point, Reception, Set } from "../../parser/stats/types"
import { DataAggregation } from "./observer"

export const setMeanObserver = []

type SetList = Partial<Set> | { playerId: string; attackScore: boolean; pointWon: boolean }

export class GeneralSet extends DataAggregation<SetList> {
	action: Actions = Actions.Set
	include(action: Action, point: Point): boolean {
		return true
	}
	mapToValue(action: Action, point: Point, playerId: string): SetList {
		const index = point.actions.indexOf(action)
		const prevAction = point.actions[index - 1]
		const nextAction = point.actions[index + 1]
		const beforeAttack = nextAction?.action === Actions.Attack
		const afterReception = prevAction?.action === Actions.Reception
		const attackScore = beforeAttack ? (nextAction as Attack).outcome === "#" : false
		const reception = afterReception ? (prevAction as Reception).outcome : null
		const pointWon = point.homePoint === action.home

		const { outcome, mbApproach, pos, posExact, skill, target } = action as Set
		return {
			mbApproach,
			pos,
			posExact,
			skill,
			target,
			outcome,
			playerId,
			attackScore,
			reception,
			pointWon,
		} as SetList
	}
}

export const setAggregations = [new GeneralSet("./aggregation/data/GeneralSet.json")]
