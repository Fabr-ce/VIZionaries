import { useMemo, useState } from "react"
import * as d3 from "d3"

import rawAttacks from "../data/GeneralAttack.json"
import { useNavigate, useParams } from "react-router-dom"
import classNames from "classnames"
import AreaPlot from "./AreaPlot"
import FilterElem from "./FilterElem"
import getPlayer from "../helper/getPlayer"
import AttackDiverging from "./DivergingChart"
import EfficiencyTable from "./EfficiencyTable"

const attacks = rawAttacks.map(a => ({ ...a, setType: a.attackCombo?.[0] ?? "O" }))

export type attackData = typeof attacks

type AttackFilterType = {
	attackType?: string | null
	setType?: string | null
	attackSpeed?: string | null
	blockCount?: string | null

	outcome?: string | null
	fromPos?: number | null
}

const filterElems: (keyof AttackFilterType)[] = [
	"attackType",
	"setType",
	"attackSpeed",
	"blockCount",
	"outcome",
	"fromPos",
]

const efficiencyMap = {
	"#": 2,
	"+": 1,
	"!": 0,
	"-": -1,
	"/": -2,
	"=": -2,
}

export default function PlayerAttack() {
	const { playerId } = useParams()
	const [filter, changeFilter] = useState<AttackFilterType>({})

	const unfilteredOwn = useMemo(() => (playerId ? attacks.filter(a => a.playerId === playerId) : attacks), [playerId])
	const filteredData = useMemo(
		() =>
			attacks.filter(a => {
				for (const filterElem of filterElems) {
					if (filter[filterElem] && filter[filterElem] !== a[filterElem]) return false
				}
				return true
			}),
		[filter]
	)

	const ownData = useMemo(
		() => (playerId ? filteredData.filter(s => s.playerId === playerId) : filteredData),
		[filteredData, playerId]
	)

	return (
		<div id="attack" className="w-full border-neutral-300 p-4">
			<h3 className="text-2xl mb-3">Attack</h3>
			<div className="grid lg:grid-cols-2  gap-3">
				<div className="bg-base-200 w-full h-full p-4 rounded">
					<FilterElem
						title="Speed"
						data={unfilteredOwn}
						type="attackSpeed"
						active={filter.attackSpeed}
						onClick={aSpeed =>
							changeFilter(old => ({ ...old, attackSpeed: old.attackSpeed === aSpeed ? null : aSpeed }))
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
						title="Set speed"
						data={unfilteredOwn}
						type="setType"
						active={filter.setType}
						onClick={setType =>
							changeFilter(old => ({ ...old, setType: old.setType === setType ? null : setType }))
						}
						sorting={["X", "V", "H", "P", "O"]}
						display={["Quick", "Medium", "High", "SetTip", "Other"]}
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
		</div>
	)
}
