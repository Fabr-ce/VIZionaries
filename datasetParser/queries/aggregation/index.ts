import { matchData } from "../../parser/types"
import { getAveragePlayPerPosition } from "./aggregators"
import { MeanScoreObserver, ScoreObserver } from "./observer"
import serveObserver from "./serveObserver"
import attackObserver from "./attackObserver"
import { VolleyPosition } from "../types"

// mean score observers
const meanScoreConstructors = [...serveObserver, ...attackObserver]
const meanScoreObservers: MeanScoreObserver[] = []
for (const obs of meanScoreConstructors) {
	meanScoreObservers.push(...obs.createObserver())
}

// table observers
const tableScoreObservers: ScoreObserver[] = []

const computeMeanAggregations = (matchData: matchData[]) => {
	const totalObservers: ScoreObserver[] = [...meanScoreObservers, ...tableScoreObservers]
	getAveragePlayPerPosition(matchData, totalObservers)

	const meanResults = computeMeanResults(meanScoreObservers)
	const tableResults = computeTableResults(tableScoreObservers)

	return { meanResults, tableResults }
}

const computeTableResults = (observers: ScoreObserver[]) => {}

const computeMeanResults = (observers: MeanScoreObserver[]) => {
	const results: { [pos in VolleyPosition]: { [k: string]: number[] } } = {
		[VolleyPosition.Outside]: {},
		[VolleyPosition.Setter]: {},
		[VolleyPosition.Opposite]: {},
		[VolleyPosition.Middle]: {},
		[VolleyPosition.Libero]: {},
	}
	for (const obs of observers) {
		results[obs.position][obs.name] = obs.getAggregation()
	}
	return results
}

export default computeMeanAggregations
