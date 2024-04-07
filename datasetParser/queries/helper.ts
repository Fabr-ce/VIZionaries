import { Action, Point } from "../parser/stats/types"
import { VolleyPosition } from "./types"

export const getPositionFromAction = (action: Action, point: Point) => {
	const setterRotation = action.home ? point.hSPos : point.aSPos
	const teamRotation = action.home ? point.hRot : point.aRot
	return getPositionFromNumber(action.player, setterRotation, teamRotation)
}

export const getPositionFromNumber = (playerNumber: number, setterRotation: number, teamRotation: Point["aRot"]) => {
	const playerPosition = teamRotation.findIndex(p => p === playerNumber) + 1
	// S A M O A M
	if (playerPosition === 0) return VolleyPosition.Libero
	const setterOffset = (playerPosition - setterRotation + 6) % 6
	switch (setterOffset) {
		case 0:
			return VolleyPosition.Setter
		case 1:
			return VolleyPosition.Outside
		case 2:
			return VolleyPosition.Middle
		case 3:
			return VolleyPosition.Opposite
		case 4:
			return VolleyPosition.Outside
		case 5:
			return VolleyPosition.Middle
		default:
			throw new Error("Position not found")
	}
}
