import { useLocation } from "react-router-dom"
import { useMemo } from "react"
import aggregation from "../data/GeneralAggregation.json"
import * as d3 from "d3"
import { getPlayer } from "../helper/playerHelper"
import SpyderChart from "./SpyderChart"

export default function PlayerSummary() {
	const location = useLocation()
	const { playerId, teamId, position } = useMemo(() => location.state ?? {}, [location.state])

	const playerData = useMemo(() => aggregation[playerId as keyof typeof aggregation] ?? null, [playerId])
	const filteredData = useMemo(() => {
		const players = Object.keys(aggregation)
		if (teamId || position) {
			return players
				.filter(p => {
					const player = getPlayer(p)
					if (teamId && player.team !== teamId) return false
					if (position && player.position !== position) return false
					return true
				})
				.map(p => aggregation[p as keyof typeof aggregation])
		}
		return players.map(p => aggregation[p as keyof typeof aggregation])
	}, [playerId, teamId, position])
	const aggregatedData = useMemo(() => {
		if (filteredData.length === 1) return filteredData[0]
		const f = d3.format(".2f")
		const result = {
			serve: { mean: 0, number: 0, format: "" },
			attack: { mean: 0, number: 0, format: "" },
			block: { mean: 0, number: 0, format: "" },
			defence: { mean: 0, number: 0, format: "" },
			reception: { mean: 0, number: 0, format: "" },
			set: { mean: 0, number: 0, format: "" },
		}
		for (const player of filteredData as (typeof result)[]) {
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
	}, [filteredData])

	console.log(playerData, aggregatedData)
	const [names, data] = useMemo(() => {
		const names = []
		const data = []
		if (playerData) {
			names.push("test")
			data.push(playerData)
		}
		if (aggregatedData) {
			names.push("all")
			data.push(aggregatedData)
		}
		return [names, data]
	}, [playerData, aggregatedData])

	return (
		<div id="summary" className="w-ful">
			Summary
			<SpyderChart data={data} labels={["service", "reception", "block"]} names={names} />
		</div>
	)
}
