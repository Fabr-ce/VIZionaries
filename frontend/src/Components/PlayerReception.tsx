import { useMemo, useState } from "react"
import receptions from "../data/GeneralReceptionFull.json"
import FilterElem from "./FilterElem"
import DivergingChart from "./DivergingChart"
import EfficiencyTable from "./EfficiencyTable"
import { filterDataset, filterSelfDataset } from "../helper/filterDataset"
import { useLocation } from "react-router-dom"

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
	const location = useLocation()
	const params = useMemo(() => location.state ?? {}, [location.state])
	const [filter, changeFilter] = useState<ReceptionFilterType>({})

	const unfilteredOwn = useMemo(() => filterSelfDataset(receptions, params), [params])

	const filteredData = useMemo(
		() =>
			filterDataset(receptions, params).filter(a => {
				for (const filterElem of filterElems) {
					if (filter[filterElem] && filter[filterElem] !== a[filterElem]) return false
				}
				return true
			}),
		[filter, params]
	)

	return (
		<div id="reception" className="w-full border-neutral-300 p-4">
			<h3 className="text-2xl mb-3 text-center">Reception</h3>
			{filteredData.length === 0 ? (
				<div className="alert alert-info">No reception data found for the current filter</div>
			) : (
				<div className="grid lg:grid-cols-2  gap-3">
					<div className="bg-base-200 w-full h-full p-4 rounded">
						<FilterElem
							title="Reception Type"
							data={unfilteredOwn}
							type="receptionType"
							active={filter.receptionType}
							onClick={rType =>
								changeFilter(old => ({
									...old,
									receptionType: old.receptionType === rType ? null : rType,
								}))
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
							sorting={["#", "+", "!", "-", "/", "="]}
							display={["Perf", "+", "!", "-", "Ovr", "Err"]}
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
