import * as Plot from "@observablehq/plot"
import * as d3 from "d3"
import { useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { getPlayer } from "../helper/playerHelper"

export default function DivergingChart({
	data,
	efficiencyMap,
}: {
	data: { outcome: string; playerId: string }[]
	efficiencyMap: { [key: string]: number }
}) {
	const { playerId } = useParams()
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const basicArr: [string, number][] = Array.from(Object.keys(efficiencyMap)).map(e => [
			e,
			-Math.sign(efficiencyMap[e]),
		])
		const { order, offset } = Likert(basicArr)

		const aggregations = d3
			.groups(data, d => d.playerId)
			.flatMap(([pId, elems]) => {
				if (elems.length < 5 && pId !== playerId) return []
				const results: any[] = []
				for (const outcome of order) {
					const filtered = elems.filter(e => e.outcome === outcome).length
					results.push({
						playerId: pId,
						outcome,
						perc: filtered / elems.length,
						count: filtered,
						countTotal: elems.length,
					})
				}
				return results
			})

		const normalize = true

		const plot = Plot.plot({
			className: "w-full",
			marginLeft: 200,
			marginBottom: 50,
			title: "Outcome Distribution (min. 5 attemps)",
			x: normalize ? { tickFormat: "%", label: "action (%)" } : { tickFormat: Math.abs, label: "# of actions" },
			y: { tickSize: 0 },
			color: { domain: order, scheme: "RdBu", legend: true },
			style: { fontSize: "1.2rem" },
			marks: [
				Plot.barX(aggregations, {
					x: "perc",
					fy: d => getPlayer(d.playerId).lastName + " (" + d.countTotal + ")",
					fill: "outcome",
					fillOpacity: d => (playerId == null || playerId === d.playerId ? 1 : 0.3),
					stroke: "#000",

					sort: {
						fy: "data",
						reduce: (d: typeof aggregations) =>
							d.reduce(
								(pre, curr) =>
									pre - efficiencyMap[curr.outcome as keyof typeof efficiencyMap] * curr.perc,
								0
							) -
							0.0001 *
								d.reduce(
									(pre, curr) =>
										pre +
										curr.count *
											Math.sign(efficiencyMap[curr.outcome as keyof typeof efficiencyMap]),
									0
								),
					},
					strokeWidth: 0.5,
					offset,
					order,
				}),

				Plot.ruleX([0]),
			],
		})

		//const boxes = d3.selectAll(plot.querySelectorAll("g[aria-label='bar'] g, g[aria-label='fy-axis tick label'] g"))

		containerRef.current?.append(plot)
		return () => plot.remove()
	}, [data, playerId, efficiencyMap])

	return <div className="flex justify-center align-center w-full" ref={containerRef} />
}

function Likert(data: [string, number][]) {
	const map = new Map(data)
	return {
		order: Array.from(map.keys()),
		offset(I: number[][][], X1: number[], X2: number[], Z: string[]) {
			for (const stacks of I) {
				for (const stack of stacks) {
					const k = d3.sum(stack, i => (X2[i] - X1[i]) * (1 - (map.get(Z[i]) ?? 0))) / 2
					for (const i of stack) {
						X1[i] -= k
						X2[i] -= k
					}
				}
			}
		},
	}
}
