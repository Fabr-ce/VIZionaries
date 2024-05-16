import classNames from "classnames"
import { useMemo, useState } from "react"
import { getPlayer } from "../helper/playerHelper"
import * as d3 from "d3"
import { useNavigate, useParams } from "react-router-dom"

export default function EfficiencyTable({
	showTopN = 10,
	efficiencyMap = {
		"#": 2,
		"+": 1,
		"!": 0,
		"-": -1,
		"/": -2,
		"=": -2,
	},
	filterLimit = 10,
	data,
}: {
	showTopN?: number
	efficiencyMap?: { [key: string]: number }
	filterLimit: number | null
	data: { outcome: string; playerId: string }[]
}) {
	const navigate = useNavigate()
	const { playerId } = useParams()
	const [offset, changeOffset] = useState(0)

	const randStr = Math.random() + ""

	const generalEfficiency = useMemo(() => {
		const f = d3.format(".2f")
		return d3
			.rollups(
				data,
				v => {
					const mean = d3.mean(v, d => efficiencyMap[d.outcome]) ?? 0
					return { mean, number: v.length, format: f(mean) }
				},
				d => d.playerId
			)
			.filter(v => filterLimit === null || v[1].number >= filterLimit)
			.sort((a, b) => b[1].mean - a[1].mean || b[1].number - a[1].number)
	}, [data, efficiencyMap, filterLimit])

	const selfIndex = useMemo(() => generalEfficiency.findIndex(a => a[0] === playerId), [generalEfficiency, playerId])

	const topN = useMemo(() => {
		const firstN = generalEfficiency
			.slice(offset, showTopN + offset)
			.map(([playerId, value], i) => ({ playerId, value, rank: i + 1 + offset }))
		if (selfIndex !== -1 && (selfIndex < offset || selfIndex >= showTopN + offset)) {
			const [playerId, value] = generalEfficiency[selfIndex]
			const playerObj = { playerId, value, rank: selfIndex + 1 }
			if (selfIndex < offset) firstN.unshift(playerObj)
			else if (selfIndex >= showTopN + offset) firstN.push(playerObj)
		}
		return firstN
	}, [generalEfficiency, selfIndex, offset, showTopN])

	const nrPages = Math.ceil(generalEfficiency.length / showTopN)

	return (
		<div className="flex flex-col justify-between h-[36.8rem] bg-base-200 w-full p-4 rounded">
			<table className="table w-full rounded bg-base-200">
				<thead>
					<tr>
						<th>Rank</th>
						<th>Position</th>
						<th>Player</th>
						<th>Count</th>
						<th>Efficiency %</th>
					</tr>
				</thead>
				<tbody>
					{topN.map(d => (
						<tr
							key={d.playerId}
							className={classNames("table-row cursor-pointer", {
								"bg-accent/20 hover:bg-accent/30": d.playerId === playerId,
								"hover:bg-base-300": d.playerId !== playerId,
							})}
							onClick={() => navigate("/players/" + d.playerId)}
						>
							<td>{d.rank}</td>
							<td>{getPlayer(d.playerId)?.position}</td>
							<td>{getPlayer(d.playerId)?.firstName + " " + getPlayer(d.playerId)?.lastName}</td>
							<td>{d.value.number}</td>
							<td>{d.value.format}</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className="flex justify-evenly w-full">
				{new Array(nrPages).fill(0).map((p, i) => (
					<input
						key={i}
						defaultValue={offset / showTopN + 1 + ""}
						className="join-item btn btn-square flex-grow"
						type="radio"
						name={"page" + randStr}
						aria-label={i + 1 + ""}
						onChange={() => changeOffset(i * showTopN)}
						checked={i * showTopN === offset}
					/>
				))}
			</div>
		</div>
	)
}
