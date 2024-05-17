import { useLocation } from "react-router-dom"
import { useMemo } from "react"
import aggregation from "../data/GeneralAggregation.json"
import * as d3 from "d3"
import { getPlayer } from "../helper/playerHelper"
import SpyderChart from "./SpyderChart"

const posMap: { [key: string]: string } = {
	S: "Setter",
	M: "Middle",
	A: "Outside",
	O: "Opposite",
	L: "Libero",
}

export default function PlayerSummary() {
	const location = useLocation()
	const { playerId, teamId, position } = useMemo(() => location.state ?? {}, [location.state])

	const playerData = useMemo(() => aggregation[playerId as keyof typeof aggregation] ?? null, [playerId])
	const filteredData = useMemo(() => {
		const players = Object.keys(aggregation)
		if (teamId || position) {
			return aggregateValues(
				players
					.filter(p => {
						const player = getPlayer(p)
						if (teamId && player.team !== teamId) return false
						if (position && player.position !== position) return false
						return true
					})
					.map(p => aggregation[p as keyof typeof aggregation])
			)
		}
		return null
	}, [playerId, teamId, position])
	const allData = useMemo(() => {
		const players = Object.keys(aggregation)
		return aggregateValues(players.map(p => aggregation[p as keyof typeof aggregation]))
	}, [])

	const [names, data] = useMemo(() => {
		const names = ["All"]
		const data = [allData]
		if (filteredData) {
			names.push(position && teamId ? teamId + " " + posMap[position] : posMap[position] || teamId)
			data.push(filteredData)
		}
		if (playerData) {
			const player = getPlayer(playerId)!
			names.push(player.firstName + " " + player.lastName)
			data.push(playerData)
		}
		return [names, data]
	}, [playerData, filteredData, allData, teamId, playerId, position])

	return (
		<div id="summary" className="w-ful">
			Summary
			<SpyderChart data={data} names={names} />
		</div>
	)
}

type AggregateType = {
	[key: string]: { mean: number; number: number; format: string }
}

const aggregateValues = (data: AggregateType[]) => {
	if (data.length === 1) return data[0]
	const f = d3.format(".2f")
	const result = {
		serve: { mean: 0, number: 0, format: "" },
		attack: { mean: 0, number: 0, format: "" },
		block: { mean: 0, number: 0, format: "" },
		defence: { mean: 0, number: 0, format: "" },
		reception: { mean: 0, number: 0, format: "" },
		set: { mean: 0, number: 0, format: "" },
	}
	for (const player of data as (typeof result)[]) {
		for (const action of Object.keys(player) as (keyof typeof player)[]) {
			result[action].number += player[action].number
			result[action].mean += player[action].mean * player[action].number
		}
	}

	for (const action of Object.keys(result) as (keyof typeof result)[]) {
		result[action].mean /= result[action].number
		result[action].format = f(result[action].mean)
	}
	return result
}
