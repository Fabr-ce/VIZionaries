import { useMemo, useState } from "react"
import * as d3 from "d3"
import receptions from "../data/GeneralReception.json"
import { useParams } from "react-router-dom"
import FilterElem from "./FilterElem"
import DivergingChart from "./DivergingChart"
import EfficiencyTable from "./EfficiencyTable"

type ReceptionFilterType = {
	outcome?: string | null
	serviceType?: string | null
	receptionType?: string | null
}

const efficiencyMap = {
	"#": 2,
	"+": 1,
	"!": 0,
	"-": -1,
	"/": -2,
	"=": -2,
}

const filterElems: (keyof ReceptionFilterType)[] = ["serviceType", "outcome", "receptionType"]

export default function PlayerReception() {
	const { playerId } = useParams()
	const [filter, changeFilter] = useState<ReceptionFilterType>({})

	const unfilteredOwn = useMemo(
		() => (playerId ? receptions.filter(a => a.playerId === playerId) : receptions),
		[playerId]
	)
	const filteredData = useMemo(
		() =>
			receptions.filter(a => {
				for (const filterElem of filterElems) {
					if (filter[filterElem] && filter[filterElem] !== a[filterElem]) return false
				}
				return true
			}),
		[filter]
	)

	const generalEfficiency = useMemo(() => {
		const f = d3.format(".2f")
		return (
			d3
				.rollups(
					filteredData,
					v => {
						const mean = d3.mean(v, d => efficiencyMap[d.outcome as keyof typeof efficiencyMap]) ?? 0
						return { mean, number: v.length, format: f(mean) }
					},
					d => d.playerId
				)
				//.filter(v => v[1].number >= 5)
				.sort((a, b) => b[1].mean - a[1].mean || b[1].number - a[1].number)
		)
	}, [filteredData])

	const ownData = useMemo(
		() => (playerId ? filteredData.filter(s => s.playerId === playerId) : filteredData),
		[filteredData, playerId]
	)

	return (
		<div id="reception" className="w-full border-neutral-300 p-4">
			<h3 className="text-2xl mb-3">Reception</h3>
			<div className="grid lg:grid-cols-2  gap-3">
				<div className="bg-base-200 w-full h-full p-4 rounded">
					<FilterElem
						title="Reception Type"
						data={unfilteredOwn}
						type="receptionType"
						active={filter.receptionType}
						onClick={rType =>
							changeFilter(old => ({ ...old, receptionType: old.receptionType === rType ? null : rType }))
						}
						sorting={["M", "L", "R", "O", "W"]}
						display={["Middle", "Left", "Right", "Set", "Low"]}
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
						display={["Pt", "Ovr", "+", "!", "-", "Err"]}
					/>
				</div>
				<EfficiencyTable
					data={filteredData}
					efficiencyMap={efficiencyMap}
					filterLimit={0.1 * unfilteredOwn.length < filteredData.length ? 5 : null}
				/>
				<div className="w-full h-full p-4 rounded bg-base-200">
					<DivergingChart data={filteredData} efficiencyMap={efficiencyMap} />
				</div>
			</div>
		</div>
	)
}
