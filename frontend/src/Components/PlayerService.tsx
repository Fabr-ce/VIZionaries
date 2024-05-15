import { useMemo, useState } from "react"
import * as d3 from "d3"

import serves from "../data/GeneralServe.json"
import { useNavigate, useParams } from "react-router-dom"
import classNames from "classnames"
import AreaPlot from "./AreaPlot"
import FilterElem from "./FilterElem"
import getPlayer from "../helper/getPlayer"
import DivergingChart from "./DivergingChart"
import EfficiencyTable from "./EfficiencyTable"

export type serveData = typeof serves

type ServiceFilterType = {
	outcome?: string | null
	type?: string | null
	fromPos?: number | null
}

const efficiencyMap = {
	"#": 3,
	"/": 2,
	"+": 1,
	"!": 0,
	"-": -1,
	"=": -2,
}

const showTopN = 10

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
		[filter]
	)

	const generalEfficiency = useMemo(() => {
		const f = d3.format(".2f")
		return (
			d3
				.rollups(
					filteredServes,
					v => {
						const mean = d3.mean(v, d => efficiencyMap[d.outcome as keyof typeof efficiencyMap]) ?? 0
						return { mean, number: v.length, format: f(mean) }
					},
					d => d.playerId
				)
				//.filter(v => v[1].number >= 5)
				.sort((a, b) => b[1].mean - a[1].mean || b[1].number - a[1].number)
		)
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

	return (
		<div id="service" className="w-full border-neutral-300 p-4">
			<h3 className="text-2xl mb-3">Service</h3>
			<div className="grid lg:grid-cols-2  gap-3">
				<div className="bg-base-200 w-full h-full p-4 rounded">
					<FilterElem
						title="Type"
						data={unfilteredOwn}
						type="type"
						active={filter.type}
						sorting={["M", "Q"]}
						display={["Float", "Spin"]}
						onClick={type => changeFilter(old => ({ ...old, type: old.type === type ? null : type }))}
					/>
				</div>
				<div className="bg-base-200 w-full h-full p-4 rounded">
					<FilterElem
						title="Outcome"
						data={unfilteredOwn}
						type="outcome"
						active={filter.outcome}
						onClick={outcome =>
							changeFilter(old => ({ ...old, outcome: old.outcome === outcome ? null : outcome }))
						}
						sorting={["#", "/", "+", "!", "-", "="]}
						display={["Pt", "/", "+", "!", "-", "Err"]}
					/>
				</div>
				<div className="w-full h-full p-4 rounded bg-base-200">
					<AreaPlot data={ownServes} />
				</div>
				<EfficiencyTable
					data={filteredServes}
					efficiencyMap={efficiencyMap}
					filterLimit={0.1 * unfilteredOwn.length < filteredServes.length ? 5 : null}
				/>
				<div className="w-full h-full p-4 rounded bg-base-200">
					<DivergingChart data={filteredServes} efficiencyMap={efficiencyMap} />
				</div>
			</div>
		</div>
	)
}
