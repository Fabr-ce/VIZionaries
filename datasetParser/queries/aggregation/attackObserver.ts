import { Action, Actions, Point } from "../../parser/stats/types"
import { VolleyPosition } from "../types"
import { MeanScoreObserver } from "./observer"

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

const attackObserver = [PointAttack, FaultAttack, EffAttack]

export default attackObserver
