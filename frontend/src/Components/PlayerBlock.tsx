import { useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import blocks from "../data/GeneralBlockFull.json"
import FilterElem from "./FilterElem"
import EfficiencyTable from "./EfficiencyTable"
import DivergingChart from "./DivergingChart"
import { filterDataset, filterSelfDataset } from "../helper/filterDataset"

type BlockFilterType = {
	outcome?: string | null
	attackType?: string | null
	blockCount?: number | null
}

const filterElems: (keyof BlockFilterType)[] = ["attackType", "blockCount", "outcome"]

const efficiencyMap = {
	"#": 2,
	"+": 1,
	"!": 0,
	"-": -1,
	"=": -2,
}

export default function PlayerBlock() {
	const location = useLocation()
	const params = useMemo(() => location.state ?? {}, [location.state])
	const [filter, changeFilter] = useState<BlockFilterType>({})

	const unfilteredOwn = useMemo(() => filterSelfDataset(blocks, params), [params])
	const filteredData = useMemo(
		() =>
			filterDataset(blocks, params).filter(b => {
				for (const filterElem of filterElems) {
					if (filter[filterElem] && filter[filterElem] !== b[filterElem]) return false
				}
				return true
			}),
		[filter, params]
	)

	return (
		<div id="block" className="w-full border-neutral-300 p-4">
			<h3 className="text-2xl mb-3 text-center">Block</h3>
			{filteredData.length === 0 ? (
				<div className="alert alert-info">No block data found for the current filter</div>
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
							sorting={["H", "M", "Q", "T", "O"]}
							display={["High", "Medium", "Quick", "Tense", "Other"]}
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
							sorting={["#", "+", "!", "-", "="]}
							display={["Pt", "+", "!", "-", "Err"]}
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
