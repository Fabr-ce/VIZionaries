import { useMemo, useState } from "react"

import attacks from "../data/GeneralAttackFull.json"
import { useLocation } from "react-router-dom"
import AreaPlot from "./AreaPlot"
import FilterElem from "./FilterElem"
import AttackDiverging from "./DivergingChart"
import EfficiencyTable from "./EfficiencyTable"
import { filterDataset, filterSelfDataset } from "../helper/filterDataset"

export type attackData = typeof attacks

type AttackFilterType = {
	attackType?: string | null
	attackSpeed?: string | null
	blockCount?: string | null

	outcome?: string | null
	fromPos?: number | null
}

const filterElems: (keyof AttackFilterType)[] = ["attackType", "attackSpeed", "blockCount", "outcome", "fromPos"]

const efficiencyMap = {
	"#": 2,
	"+": 1,
	"!": 0,
	"-": -1,
	"/": -2,
	"=": -2,
}

export default function PlayerAttack() {
	const location = useLocation()
	const params = location.state ?? {}
	const [filter, changeFilter] = useState<AttackFilterType>({})

	const unfilteredOwn = useMemo(() => filterSelfDataset(attacks, params), [params])
	const filteredData = useMemo(
		() =>
			filterDataset(attacks, params).filter(a => {
				for (const filterElem of filterElems) {
					if (filter[filterElem] && filter[filterElem] !== a[filterElem]) return false
				}
				return true
			}),
		[filter, params]
	)

	const ownData = useMemo(
		() => (filteredData.length === attacks.length ? unfilteredOwn : filterSelfDataset(filteredData, params)),
		[filteredData, params, unfilteredOwn]
	)

	return (
		<div id="attack" className="w-full border-neutral-300 p-4">
			<h3 className="text-2xl mb-3">Attack</h3>
			{filteredData.length === 0 ? (
				<div className="alert alert-info">No attack data found for the current filter</div>
			) : (
				<div className="grid lg:grid-cols-2  gap-3">
					<div className="bg-base-200 w-full h-full p-4 rounded">
						<FilterElem
							title="Speed"
							data={unfilteredOwn}
							type="attackSpeed"
							active={filter.attackSpeed}
							onClick={aSpeed =>
								changeFilter(old => ({
									...old,
									attackSpeed: old.attackSpeed === aSpeed ? null : aSpeed,
								}))
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
							sorting={["#", "/", "+", "!", "-", "="]}
							display={["Pt", "Blk", "+", "!", "-", "Err"]}
						/>
					</div>
					<div className="bg-base-200 w-full h-full p-4 rounded">
						<FilterElem
							title="From Pos"
							data={unfilteredOwn}
							type="fromPos"
							active={filter.fromPos}
							onClick={fromPos =>
								changeFilter(old => ({ ...old, fromPos: old.fromPos === fromPos ? null : fromPos }))
							}
							sorting={[2, 9, 3, 8, 4]}
							display={["Right", "A-Zone", "Middle", "Pipe", "Left"]}
						/>
					</div>
					<div className="bg-base-200 w-full h-full p-4 rounded">
						<FilterElem
							title="Set Type"
							data={unfilteredOwn}
							type="attackType"
							active={filter.attackType}
							onClick={attackType =>
								changeFilter(old => ({
									...old,
									attackType: old.attackType === attackType ? null : attackType,
								}))
							}
							sorting={["H", "M", "Q", "T", "O"]}
							display={["High", "Medium", "Quick", "Tense", "Other"]}
						/>
					</div>
					<div className="w-full h-full p-4 rounded bg-base-200">
						<AreaPlot data={ownData} />
					</div>

					<EfficiencyTable
						data={filteredData}
						filterLimit={0.1 * unfilteredOwn.length < filteredData.length ? 5 : null}
					/>
					<div className="w-full h-full p-4 rounded bg-base-200">
						<AttackDiverging data={filteredData} efficiencyMap={efficiencyMap} />
					</div>
				</div>
			)}
		</div>
	)
}
