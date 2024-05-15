import { Action, Actions, Attack, Point, Reception } from "../../parser/stats/types"
import { DataAggregation } from "./observer"

export const receptionMeanObserver = []

type ReceptionList = Partial<Reception> | { playerId: string }

export class GeneralReception extends DataAggregation<ReceptionList> {
	action: Actions = Actions.Reception
	include(action: Action, point: Point): boolean {
		return true
	}
	mapToValue(action: Action, point: Point, playerId: string): ReceptionList {
		const { outcome, serviceType, receptionType } = action as Reception
		return { outcome, serviceType, receptionType, playerId }
	}
}

export const receptionAggregations = [new GeneralReception("./aggregation/data/GeneralReception.json")]
