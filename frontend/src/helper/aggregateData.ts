import aggregation from "../data/GeneralAggregation.json"

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
