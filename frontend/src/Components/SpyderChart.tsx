import * as Plot from "@observablehq/plot"
import * as d3 from "d3"
import { useEffect, useRef } from "react"

type spyderInput = {
	[key: string]: { mean: number; number: number; format: string }
}

const labels = ["serve", "attack", "reception", "block", "set", "defence"]

export default function SpyderChart({ data, names }: { data: spyderInput[]; names: string[] }) {
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const points = data.flatMap((d, i) => {
			return labels.map(a => ({
				name: names[i],
				key: a,
				value: ((d[a]?.mean ?? -2) + 2) / 8,
				count: d[a]?.number ?? 0,
			}))
		})

		console.log(data, points)

		const longitude = d3.scalePoint(labels, [180, -180]).padding(0.5).align(1)

		const plot = Plot.plot({
			width: 450,
			projection: {
				type: "azimuthal-equidistant",
				rotate: [0, -90],
				// Note: 0.625° corresponds to max. length (here, 0.5), plus enough room for the labels
				domain: d3.geoCircle().center([0, 90]).radius(0.625)(),
			},

			title: "Efficiency Summary",
			color: { legend: true, domain: names },
			marks: [
				// grey discs
				Plot.geo([0.5, 0.375, 0.25, 0.125], {
					geometry: r => d3.geoCircle().center([0, 90]).radius(r)(),
					stroke: "black",
					fill: "black",
					strokeOpacity: 0.4,
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
				Plot.text([0.125, 0.25, 0.375, 0.5], {
					x: 180,
					y: d => 90 - d,
					dx: 10,
					textAnchor: "start",
					text: d => `${8 * d - 2}`,
					fontWeight: "bold",
					fontSize: 15,
				}),

				// axes labels
				Plot.text(longitude.domain(), {
					x: longitude,
					y: 90 - 0.6,
					text: str => str.charAt(0).toUpperCase() + str.slice(1),
					lineWidth: 5,
					fontSize: 15,
				}),

				// areas
				Plot.area(points, {
					x1: ({ key }) => longitude(key),
					y1: ({ value }) => 90 - value,
					x2: 0,
					y2: 90,
					fillOpacity: 0.25,
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
						text: d => `${(8 * d.value - 2).toFixed(2)} (${d.count})`,
						textAnchor: "start",
						dx: 6,
						fill: "name",
						fontSize: 15,
						stroke: "white",
						maxRadius: 10,
					})
				),
			],
		})

		//const boxes = d3.selectAll(plot.querySelectorAll("g[aria-label='bar'] g, g[aria-label='fy-axis tick label'] g"))

		containerRef.current?.append(plot)
		return () => plot.remove()
	}, [data, names])

	return <div className="flex justify-center align-center w-full" ref={containerRef} />
}
