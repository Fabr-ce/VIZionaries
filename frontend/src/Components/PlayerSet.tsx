import SetterLocationPlot from "./SetterLocationPlot"
import sets from "../data/GeneralSetFull.json"
import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import FilterElem from "./FilterElem"
import EfficiencyTable from "./EfficiencyTable"
import { filterDataset, filterSelfDataset } from "../helper/filterDataset"

type SetFilterType = {
	colorBy: string
	target?: string | null
	outcome?: string | null
	reception?: string | null
}

const filterElems: (keyof Omit<SetFilterType, "colorBy">)[] = ["target", "outcome", "reception"]

const efficiencyMap = {
	"#": 2,
	"+": 1,
	"!": 0,
	"-": -1,
	"/": -2,
	"=": -2,
}

export default function PlayerSet() {
	const params = useParams()
	const [filter, changeFilter] = useState<SetFilterType>({ colorBy: "percent" })

	const unfilteredOwn: { reception: string | null }[] = useMemo(() => filterSelfDataset(sets, params), [params])
	const filteredData = useMemo(
		() =>
			filterDataset(sets, params).filter(s => {
				for (const filterElem of filterElems) {
					if (filter[filterElem] && filter[filterElem] !== s[filterElem]) return false
				}
				return true
			}),
		[filter, params]
	)

	return (
		<div id="set" className="w-full border-neutral-300 p-4">
			<h3 className="text-2xl mb-3">Set</h3>
			{filteredData.length === 0 ? (
				<div className="alert alert-info">No attack data found for the current filter</div>
			) : (
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
							display={["Count", "Attack", "Point"]}
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
			)}
		</div>
	)
}
