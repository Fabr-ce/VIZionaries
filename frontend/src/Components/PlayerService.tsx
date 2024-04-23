import { useMemo, useState } from "react"
import * as d3 from "d3"

import serves from "../data/GeneralServeFull.json"
import { useNavigate, useParams } from "react-router-dom"
import playersList from "../data/players.json"
import classNames from "classnames"
import ServicePlot from "./ServicePlot"
import FilterElem from "./FilterElem"

export type serveData = typeof serves

type ServiceFilterType = {
	outcome?: string | null
	type?: string | null
	fromPos?: number | null
}

const efficiencyMap = {
	"#": 2,
	"/": 2,
	"+": 1,
	"!": 0,
	"-": -1,
	"=": -2,
}

const showTopN = 10

const players = d3.index(playersList, (p: any) => p.code)

export default function PlayerService() {
	const navigate = useNavigate()
	const { playerId } = useParams()
	const [filter, changeFilter] = useState<ServiceFilterType>({})

	const unfilteredOwn = useMemo(() => (playerId ? serves.filter(s => s.playerId === playerId) : serves), [playerId])
	const filteredServes = useMemo(
		() =>
			serves.filter(s => {
				if (filter.outcome && filter.outcome !== s.outcome) return false
				if (filter.type && filter.type !== s.type) return false
				if (filter.fromPos && filter.fromPos !== s.fromPos) return false
				return true
			}),
		[filter, serves]
	)
	const generalEfficiency = useMemo(() => {
		const f = d3.format(".2f")
		return d3
			.rollups(
				filteredServes,
				v => {
					const mean = d3.mean(v, d => efficiencyMap[d.outcome as keyof typeof efficiencyMap]) ?? 0
					return { mean, number: v.length, format: f(mean) }
				},
				d => d.playerId
			)
			.filter(v => v[1].number >= 5)
			.sort((a, b) => b[1].mean - a[1].mean)
	}, [filteredServes])

	const topN = useMemo(() => {
		const firstN = generalEfficiency
			.slice(0, showTopN)
			.map(([playerId, value], i) => ({ playerId, value, rank: i + 1 }))
		const isInTop = generalEfficiency.findIndex(a => a[0] === playerId)
		if (isInTop >= -1 && isInTop >= showTopN) {
			const [playerId, value] = generalEfficiency[isInTop]
			firstN.push({ playerId, value, rank: isInTop + 1 })
		}
		return firstN
	}, [generalEfficiency, playerId])

	const ownServes = useMemo(
		() => (playerId ? filteredServes.filter(s => s.playerId === playerId) : filteredServes),
		[filteredServes, playerId]
	)

	// console.log(filteredServes, generalEfficiency, ownServes)

	return (
		<div id="service" className="w-full border-y border-neutral-300 p-4">
			<h3 className="text-2xl mb-3">Service</h3>
			<div className="grid lg:grid-cols-2  gap-3">
				<div className="bg-base-200 w-full h-full p-4 rounded">
					<FilterElem
						data={unfilteredOwn}
						type="type"
						active={filter.type}
						sorting={["M", "Q"]}
						onClick={type => changeFilter(old => ({ ...old, type: old.type === type ? null : type }))}
					/>
				</div>
				<div className="bg-base-200 w-full h-full p-4 rounded">
					<FilterElem
						data={unfilteredOwn}
						type="outcome"
						active={filter.outcome}
						onClick={outcome =>
							changeFilter(old => ({ ...old, outcome: old.outcome === outcome ? null : outcome }))
						}
						sorting={["#", "/", "+", "!", "-", "="]}
					/>
				</div>
				<div className="w-full h-full p-4 rounded bg-base-200">
					<ServicePlot data={ownServes} />
				</div>
				<table className="table w-full rounded bg-base-200">
					<thead>
						<tr>
							<th>Rank</th>
							<th>Id</th>
							<th>Number</th>
							<th>Efficiency %</th>
						</tr>
					</thead>
					<tbody>
						{topN.map(d => (
							<tr
								key={d.playerId}
								className={classNames("table-row cursor-pointer", {
									"bg-accent/20 hover:bg-accent/30": d.playerId === playerId,
									"hover:bg-base-300": d.playerId !== playerId,
								})}
								onClick={() => navigate("/" + d.playerId)}
							>
								<td>{d.rank}</td>
								<td>{players.get(d.playerId)?.firstName + " " + players.get(d.playerId)?.lastName}</td>
								<td>{d.value.number}</td>
								<td>{d.value.format}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
