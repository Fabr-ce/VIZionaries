import * as Plot from "@observablehq/plot"
import * as d3 from "d3"
import { useEffect, useRef } from "react"

type spyderInput = {
	[key: string]: { mean: number; number: number; format: string }
}

export default function SpyderChart({
	data,
	labels,
	names,
}: {
	data: spyderInput[]
	labels: string[]
	names: string[]
}) {
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const points = data.flatMap((d, i) => {
			return Object.keys(d).map(a => ({ name: names[i], key: a, value: (d[a].mean + 2) / 4 }))
		})

		console.log(points)

		/*
		const points = [
			{ name: "test", key: "service", value: 0.3 },
			{ name: "test", key: "reception", value: 0.2 },
			{ name: "test", key: "block", value: 0.1 },
		]
		*/

		const longitude = d3
			.scalePoint(new Set(Plot.valueof(points, "key")), [180, -180])
			.padding(0.5)
			.align(1)

		const plot = Plot.plot({
			width: 450,
			projection: {
				type: "azimuthal-equidistant",
				rotate: [0, -90],
				// Note: 0.625° corresponds to max. length (here, 0.5), plus enough room for the labels
				domain: d3.geoCircle().center([0, 90]).radius(0.625)(),
			},
			color: { legend: true },
			marks: [
				// grey discs
				Plot.geo([0.5, 0.4, 0.3, 0.2, 0.1], {
					geometry: r => d3.geoCircle().center([0, 90]).radius(r)(),
					stroke: "black",
					fill: "black",
					strokeOpacity: 0.3,
					fillOpacity: 0.03,
					strokeWidth: 0.5,
				}),

				// white axes
				Plot.link(longitude.domain(), {
					x1: longitude,
					y1: 90 - 0.57,
					x2: 0,
					y2: 90,
					stroke: "white",
					strokeOpacity: 0.5,
					strokeWidth: 2.5,
				}),

				// tick labels
				Plot.text([0.3, 0.4, 0.5], {
					x: 180,
					y: d => 90 - d,
					dx: 2,
					textAnchor: "start",
					text: d => `${100 * d}%`,
					fill: "currentColor",
					stroke: "white",
					fontSize: 8,
				}),

				// axes labels
				Plot.text(longitude.domain(), {
					x: longitude,
					y: 90 - 0.57,
					text: Plot.identity,
					lineWidth: 5,
				}),

				// areas
				Plot.area(points, {
					x1: ({ key }) => longitude(key),
					y1: ({ value }) => 90 - value,
					x2: 0,
					y2: 90,
					fill: "name",
					stroke: "name",
					curve: "cardinal-closed",
				}),

				// points
				Plot.dot(points, {
					x: ({ key }) => longitude(key),
					y: ({ value }) => 90 - value,
					fill: "name",
					stroke: "white",
				}),

				// interactive labels
				Plot.text(
					points,
					Plot.pointer({
						x: ({ key }) => longitude(key),
						y: ({ value }) => 90 - value,
						text: d => `${(100 * d.value).toFixed(0)}%`,
						textAnchor: "start",
						dx: 4,
						fill: "currentColor",
						stroke: "white",
						maxRadius: 10,
					})
				),
			],
		})

		//const boxes = d3.selectAll(plot.querySelectorAll("g[aria-label='bar'] g, g[aria-label='fy-axis tick label'] g"))

		containerRef.current?.append(plot)
		return () => plot.remove()
	}, [data])

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
