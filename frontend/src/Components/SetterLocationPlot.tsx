import * as Plot from "@observablehq/plot"
import { useEffect, useMemo, useRef } from "react"
import { convertToSetterArea, AreaSetType } from "../helper/convertToArea"
import markings from "../helper/volleyballMarkings"

export default function SetterLocationPlot({ data, colorBy }: { data: AreaSetType[]; colorBy?: string | null }) {
	colorBy ||= "percent"
	const containerRef = useRef<HTMLDivElement>(null)

	const areaData = useMemo(() => convertToSetterArea(data), [data])

	useEffect(() => {
		const plot = Plot.plot({
			className: "w-full",
			height: 640,
			axis: null,

			x: { domain: [-0.5, 6.5], label: "Y-pos" },
			y: { domain: [-0.5, 6.5] },
			color: { type: "linear", scheme: "ylgnbu", legend: true, label: "Attempts" },
			marks: [
				Plot.rect(areaData, {
					x: "x",
					y: "y",
					fill: colorBy,
					interval: 2,
					opacity: 0.8,
				}),
				Plot.text(areaData, {
					text: d =>
						[
							d.percent + "% (n:" + d.count + ")",
							"Attack: " + d.directScore + "%",
							"Point: " + d.ptScore + "%",
						].join("\n"),
					textAnchor: "middle",
					lineAnchor: "middle",
					fillOpacity: 1,
					fill: d => (d[colorBy] > 30 ? "white" : "black"),
					fontSize: 20,
					x: d => d.x + 1,
					y: d => d.y + 1,
				}),
				...markings({}),
			],
		})

		containerRef.current?.append(plot)
		return () => plot.remove()
	}, [areaData, colorBy])

	return <div className="flex justify-center align-center w-full" ref={containerRef} />
}
