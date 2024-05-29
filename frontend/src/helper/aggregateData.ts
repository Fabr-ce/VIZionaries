import aggregation from "../data/GeneralAggregation.json"
import * as d3 from "d3"

type dataType = [
	string,
	{
		mean: number
		number: number
		format: string
	}
][]

type aggregationEntry = {
	mean: number
	number: number
	format: string
}

type aggregationType = {
	[playerId: string]: {
		[action: string]: aggregationEntry
	}
}

// first step
/*
const dataList: dataType[] = []

export const addTable = (data: dataType) => {
	dataList.push(data)
	console.log(JSON.stringify(dataList))
}
*/

// second step
/*
const aggregationObject: aggregationType = {}

for (const action in aggregation) {
	for (const [playerId, data] of aggregation[action as keyof typeof aggregation] as dataType) {
		const aggPlayer = aggregationObject[playerId]
		if (!aggPlayer) aggregationObject[playerId] = { [action]: data }
		else aggregationObject[playerId][action] = data
	}
}
console.log(JSON.stringify(aggregationObject))
*/

// convert

const f = d3.format(".2f")

const newAggregationObject: any = {}
for (const playerId of Object.keys(aggregation)) {
	const newPlayer = { ...aggregation[playerId as keyof typeof aggregation] }
	for (const action of Object.keys(newPlayer)) {
		const playerAction: any = newPlayer[action as keyof typeof newPlayer]
		if (action === "serve") playerAction.mean /= 3
		else playerAction.mean /= 2
		playerAction.format = f(playerAction.mean)
	}
	newAggregationObject[playerId] = newPlayer
}
console.log(JSON.stringify(newAggregationObject))
