import { matchData } from "../../parser/types"
import { MeanScoreObserver, ScoreObserver } from "./observer"

export const aggregateAll = (matchArray: matchData[], observer: ScoreObserver[]) => {
	for (const match of matchArray) {
		for (const obs of observer) {
			if (obs.setMatch) {
				obs.setMatch(match)
			}
		}
		for (const sets of match.sets) {
			for (const point of sets) {
				for (const action of point.actions) {
					for (const obs of observer) {
						obs.addAction(action, point)
					}
				}
			}
		}
	}
}
