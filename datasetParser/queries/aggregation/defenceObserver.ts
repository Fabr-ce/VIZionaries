import { Action, Actions, Point, Defence } from "../../parser/stats/types"
import { DataAggregation } from "./observer"

export const defenceMeanObserver = []

type DefenceList = Partial<Defence> | { playerId: string }

export class GeneralDefence extends DataAggregation<DefenceList> {
	action: Actions = Actions.Defence
	include(action: Action, point: Point): boolean {
		return true
	}
	mapToValue(action: Action, point: Point, playerId: string): DefenceList {
		const { outcome, attackType, defenceType } = action as Defence
		return { outcome, attackType, defenceType, playerId }
	}
}

export const defenceAggregations = [new GeneralDefence("./aggregation/data/GeneralDefence.json")]
