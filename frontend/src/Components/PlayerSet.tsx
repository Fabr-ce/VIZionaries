import SetterLocationPlot from "./SetterLocationPlot"
import sets from "../data/GeneralSet.json"
import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import FilterElem from "./FilterElem"
import EfficiencyTable from "./EfficiencyTable"

type SetFilterType = {
	colorBy: string
	target?: string | null
	outcome?: string | null
	reception?: string | null
}

const filterElems: (keyof SetFilterType)[] = ["target", "outcome", "reception"]

const efficiencyMap = {
	"#": 2,
	"+": 1,
	"!": 0,
	"-": -1,
	"/": -2,
	"=": -2,
}

export default function PlayerSet() {
	const navigate = useNavigate()
	const { playerId } = useParams()
	const [filter, changeFilter] = useState<SetFilterType>({ colorBy: "percent" })

	const unfilteredOwn: { reception: string | null }[] = useMemo(
		() => (playerId ? sets.filter(s => s.playerId === playerId) : sets),
		[playerId]
	)
	const filteredData = useMemo(
		() =>
			sets.filter(s => {
				if (filter.outcome && filter.outcome !== s.outcome) return false
				if (filter.target && filter.target !== s.target) return false
				if (filter.reception !== undefined && filter.reception !== s.reception) return false
				return true
			}),
		[filter]
	)

	const ownSets = useMemo(
		() => (playerId ? filteredData.filter(s => s.playerId === playerId) : filteredData),
		[filteredData, playerId]
	)

	return (
		<div id="set" className="w-full border-neutral-300 p-4">
			<h3 className="text-2xl mb-3">Set</h3>
			<div className="grid lg:grid-cols-2  gap-3">
				<div className="bg-base-200 w-full h-full p-4 rounded">
					<FilterElem<string | null>
						title="Reception"
						data={unfilteredOwn}
						type="reception"
						active={filter.reception}
						sorting={["#", "+", "!", "-", "/", "=", null]}
						display={["#", "+", "!", "-", "/", "=", "K2"]}
						onClick={type =>
							changeFilter(old => ({ ...old, reception: old.reception === type ? undefined : type }))
						}
					/>
				</div>
				<div className="bg-base-200 w-full h-full p-4 rounded">
					<FilterElem
						title="Color By"
						data={[{ colorBy: "percent" }, { colorBy: "directScore" }, { colorBy: "ptScore" }]}
						type="colorBy"
						active={filter.colorBy}
						sorting={["percent", "directScore", "ptScore"]}
						display={["Count", "Attack", "Win"]}
						onClick={type => type && changeFilter(old => ({ ...old, colorBy: type }))}
					/>
				</div>
				<div className="bg-base-200 w-full h-full p-4 rounded">
					<SetterLocationPlot data={filteredData} colorBy={filter.colorBy} />
				</div>
				<EfficiencyTable
					data={filteredData}
					efficiencyMap={efficiencyMap}
					filterLimit={0.1 * unfilteredOwn.length < filteredData.length ? 5 : null}
				/>
			</div>
		</div>
	)
}
