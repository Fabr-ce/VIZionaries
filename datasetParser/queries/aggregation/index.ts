import { matchData } from "../../parser/types"
import { aggregateAll } from "./aggregators"
import { DataAggregation, MeanScoreObserver, ScoreObserver } from "./observer"
import { serveMeanObserver, serveAggregations } from "./serveObserver"
import { attackMeanObserver, attackAggregations } from "./attackObserver"
import { setMeanObserver, setAggregations } from "./setObserver"
import { blockMeanObserver, blockAggregations } from "./blockObserver"
import { defenceMeanObserver, defenceAggregations } from "./defenceObserver"
import { receptionMeanObserver, receptionAggregations } from "./receptionObserver"
import { VolleyPosition } from "../types"

// mean score observers
const meanScoreConstructors = [
	...serveMeanObserver,
	...attackMeanObserver,
	...setMeanObserver,
	...blockMeanObserver,
	...defenceMeanObserver,
	...receptionMeanObserver,
]
const meanScoreObservers: MeanScoreObserver[] = []
for (const obs of meanScoreConstructors) {
	meanScoreObservers.push(...obs.createObserver())
}

// table observers
const tableScoreObservers: DataAggregation<any>[] = [
	...attackAggregations,
	...serveAggregations,
	...setAggregations,
	...blockAggregations,
	...defenceAggregations,
	...receptionAggregations,
]

const computeMeanAggregations = (matchData: matchData[]) => {
	const totalObservers: ScoreObserver[] = [...meanScoreObservers, ...tableScoreObservers]
	aggregateAll(matchData, totalObservers)

	const meanResults = computeMeanResults(meanScoreObservers)
	const tableResults = computeTableResults(tableScoreObservers)

	return { meanResults, tableResults }
}

const computeTableResults = async (observers: DataAggregation<any>[]) => {
	for (const observer of observers) {
		await observer.export()
	}
}

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
