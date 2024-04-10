import { matchData } from "../../parser/types"
import { MeanScoreObserver, ScoreObserver } from "./observer"

export const getAveragePlayPerPosition = (matchArray: matchData[], oberserver: ScoreObserver[]) => {
	const nums: number[] = []
	for (const match of matchArray) {
		for (const sets of match.sets) {
			for (const point of sets) {
				for (const action of point.actions) {
					for (const obs of oberserver) {
						obs.addAction(action, point)
					}
				}
			}
		}
	}
}
