import { useMemo, useState } from "react"

import serves from "../data/GeneralServeFull.json"
import AreaPlot from "./AreaPlot"
import FilterElem from "./FilterElem"
import DivergingChart from "./DivergingChart"
import EfficiencyTable from "./EfficiencyTable"
import { filterDataset, filterSelfDataset } from "../helper/filterDataset"
import { useLocation } from "react-router-dom"

export type serveData = typeof serves

type ServiceFilterType = {
	outcome?: string | null
	type?: string | null
	fromPos?: number | null
}

const efficiencyMap = {
	"#": 1,
	"/": 0.6,
	"+": 0.3,
	"!": 0,
	"-": -0.3,
	"=": -0.6,
}

export default function PlayerService() {
	const location = useLocation()
	const params = useMemo(() => location.state ?? {}, [location.state])
	const [filter, changeFilter] = useState<ServiceFilterType>({})

	const unfilteredOwn = useMemo(() => filterSelfDataset(serves, params), [params])
	const filteredData = useMemo(
		() =>
			filterDataset(serves, params).filter(s => {
				if (filter.outcome && filter.outcome !== s.outcome) return false
				if (filter.type && filter.type !== s.type) return false
				if (filter.fromPos && filter.fromPos !== s.fromPos) return false
				return true
			}),
		[filter, params]
	)

	const ownData = useMemo(
		() => (filteredData.length === serves.length ? unfilteredOwn : filterSelfDataset(filteredData, params)),
		[filteredData, params, unfilteredOwn]
	)

	return (
		<div id="service" className="w-full border-neutral-300 p-4">
			<h3 className="text-2xl mb-3 text-center">Service</h3>
			{filteredData.length === 0 ? (
				<div className="alert alert-info">No serve data found for the current filter</div>
			) : (
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
						<AreaPlot data={ownData} />
					</div>
					<EfficiencyTable
						data={filteredData}
						efficiencyMap={efficiencyMap}
						filterLimit={0.1 * unfilteredOwn.length < filteredData.length ? 5 : null}
					/>
					<div className="w-full h-full p-4 rounded bg-base-200">
						<DivergingChart
							data={filteredData}
							efficiencyMap={efficiencyMap}
							limitNumber={0.1 * unfilteredOwn.length < filteredData.length ? 10 : 1}
						/>
					</div>
				</div>
			)}
		</div>
	)
}
