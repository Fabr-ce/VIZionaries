import { Action, Actions, Point, Serve } from "../../parser/stats/types"
import { VolleyPosition } from "../types"
import { DataAggregation, MeanScoreObserver } from "./observer"

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

export const serveAggregations = [new GeneralServe("./aggregation/data/GeneralServe.json")]
