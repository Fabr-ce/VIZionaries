import { matchData } from "../../parser/types"
import { getAveragePlayPerPosition } from "./aggregators"
import { MeanScoreObserver } from "./observer"
import serveObserver from "./serveObserver"
import attackObserver from "./attackObserver"
import { VolleyPosition } from "../types"

const observer = [...serveObserver, ...attackObserver]

const computeAggregations = (matchData: matchData[]) => {
	const observerList: MeanScoreObserver[] = []
	for (const obs of observer) {
		observerList.push(...obs.createObserver())
	}

	getAveragePlayPerPosition(matchData, observerList)

	const results: { [pos in VolleyPosition]: { [k: string]: number[] } } = {
		[VolleyPosition.Outside]: {},
		[VolleyPosition.Setter]: {},
		[VolleyPosition.Opposite]: {},
		[VolleyPosition.Middle]: {},
		[VolleyPosition.Libero]: {},
	}
	for (const obs of observerList) {
		results[obs.position][obs.name] = obs.getAggregation()
	}
	return results
}

export default computeAggregations
