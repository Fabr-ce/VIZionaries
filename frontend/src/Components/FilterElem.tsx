import * as Plot from "@observablehq/plot"
import { useEffect, useMemo, useRef } from "react"
import * as d3 from "d3"

type filterData<T> = { [key: string]: T | string | number | null | undefined }

export default function FilterElem<T>({
	data,
	type,
	sorting,
	active,
	onClick,
}: {
	data: filterData<T>[]
	type: string
	sorting: T[]
	active?: T | null
	onClick?: (key: T | null) => void
}) {
	const containerRef = useRef<HTMLDivElement>(null)

	const aggregationData = useMemo(() => {
		const aggregation = d3.rollup(
			data,
			v => v.length,
			d => d[type]
		)
		const result = []
		for (const ord of sorting) {
			if (aggregation.has(ord)) result.push({ type: ord, count: (aggregation.get(ord) ?? 0) / data.length })
		}
		return result
	}, [data])

	useEffect(() => {
		const plot = Plot.plot({
			x: { percent: true, grid: false },
			marks: [
				Plot.barX(aggregationData, Plot.stackX({ x: "count", fillOpacity: 0.8, inset: 0.5 })),
				Plot.textX(
					aggregationData,
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
			if (onClick) {
				const clickedType = aggregationData[i as number].type
				onClick(clickedType === active ? null : clickedType)
			}
		})

		containerRef.current?.append(plot)
		return () => plot.remove()
	}, [aggregationData])

	useEffect(() => {
		if (!containerRef.current) return
		const boxes = d3.selectAll(containerRef.current.querySelectorAll("rect"))
		boxes.classed("fill-secondary/80", false)
		if (!active) return
		const index = aggregationData.findIndex(e => e.type === active) + 1
		const box = d3.selectAll(containerRef.current.querySelectorAll("rect:nth-child(" + index + ")"))
		box.classed("fill-secondary/80", true)
	}, [active, aggregationData])

	return <div className="flex justify-center align-center w-full" ref={containerRef} />
}
