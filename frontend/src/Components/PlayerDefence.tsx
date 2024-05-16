import { useParams } from "react-router-dom"
import FilterElem from "./FilterElem"
import { useMemo, useState } from "react"
import defence from "../data/GeneralDefenceFull.json"
import EfficiencyTable from "./EfficiencyTable"
import DivergingChart from "./DivergingChart"
import { filterDataset, filterSelfDataset } from "../helper/filterDataset"

type DefenceFilterType = {
	outcome?: string | null
	attackType?: string | null
	defenceType?: string | null
}

const filterElems: (keyof DefenceFilterType)[] = ["attackType", "defenceType", "outcome"]

const efficiencyMap = {
	"#": 2,
	"+": 1,
	"!": 0,
	"-": -1,
	"/": -2,
	"=": -2,
}

export default function PlayerDefence() {
	const params = useParams()
	const [filter, changeFilter] = useState<DefenceFilterType>({})

	const unfilteredOwn = useMemo(() => filterSelfDataset(defence, params), [params])
	const filteredData = useMemo(
		() =>
			filterDataset(defence, params).filter(d => {
				for (const filterElem of filterElems) {
					if (filter[filterElem] && filter[filterElem] !== d[filterElem]) return false
				}
				return true
			}),
		[filter, params]
	)

	return (
		<div id="defence" className="w-full border-neutral-300 p-4">
			<h3 className="text-2xl mb-3">Defence</h3>
			{filteredData.length === 0 ? (
				<div className="alert alert-info">No defence data found for the current filter</div>
			) : (
				<div className="grid lg:grid-cols-2  gap-3">
					<div className="bg-base-200 w-full h-full p-4 rounded">
						<FilterElem
							title="Attack Type"
							data={unfilteredOwn}
							type="attackType"
							active={filter.attackType}
							onClick={aType =>
								changeFilter(old => ({ ...old, attackType: old.attackType === aType ? null : aType }))
							}
							sorting={["H", "S", "T", "P"]}
							display={["Hard", "Soft", "Tip", "P"]}
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
							sorting={["#", "+", "!", "-", "/", "="]}
							display={["Pt", "+", "!", "-", "Ovr", "Err"]}
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
			)}
		</div>
	)
}
