import * as Plot from "@observablehq/plot"
import { useEffect, useMemo, useRef } from "react"
import { serveData } from "./PlayerService"
import * as d3 from "d3"

const serviceOrder = ["#", "/", "+", "!", "-", "="]

export default function ServiceFilter({ data }: { data: serveData }) {
	const containerRef = useRef<HTMLDivElement>(null)

	const serviceData = useMemo(() => {
		const aggregation = d3.rollup(
			data,
			v => v.length,
			d => d.outcome
		)
		const result = []
		for (const ord of serviceOrder) {
			if (aggregation.has(ord)) result.push({ type: ord, count: (aggregation.get(ord) ?? 0) / data.length })
		}
		return result
	}, [data])

	useEffect(() => {
		const plot = Plot.plot({
			x: { percent: true, grid: true },
			marks: [
				Plot.barX(serviceData, Plot.stackX({ x: "count", fillOpacity: 0.8, inset: 0.5 })),
				Plot.textX(
					serviceData,
					Plot.stackX({
						x: "count",
						text: "type",
						inset: 0.5,
						fontSize: "1.3rem",
						fontWeight: "bold",
					})
				),
				Plot.ruleX([0, 1]),
				Plot.axisX({ label: "count", fontSize: "0.7rem" }),
			],
		})

		const boxes = d3.selectAll(plot.querySelectorAll("rect"))
		boxes.classed("cursor-pointer fill-primary/20", true)
		boxes.on("mouseover", (d, i) => {
			d3.select(d.target).classed("fill-primary/20", false).classed("fill-primary/70", true)
		})
		boxes.on("mouseout", (d, i) => {
			d3.select(d.target).classed("fill-primary/70", false).classed("fill-primary/20", true)
		})
		boxes.on("click", (d, i) => {
			alert("clicked " + i)
		})

		containerRef.current?.append(plot)
		return () => plot.remove()
	}, [serviceData])

	return <div className="flex justify-center align-center w-full" ref={containerRef} />
}
