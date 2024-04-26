import * as Plot from "@observablehq/plot"
import { useEffect, useMemo, useRef } from "react"
import convertToArea, { AreaType } from "../helper/convertToArea"

export default function AreaPlot({ data }: { data: AreaType[] }) {
	const containerRef = useRef<HTMLDivElement>(null)

	const areaData = useMemo(() => convertToArea(data), [data])

	useEffect(() => {
		const plot = Plot.plot({
			className: "w-full",
			height: 640,
			axis: null,

			x: { domain: [0, 6], label: "Y-pos" },
			y: { domain: [0, 6] },
			color: { type: "linear", scheme: "ylgnbu", legend: true, label: "Attempts" },
			marks: [
				Plot.rect(areaData, {
					x: "x",
					y: "y",
					fill: "count",
					interval: 1,
				}),
				Plot.gridX({ interval: 6, strokeOpacity: 0.01 }),
				Plot.gridY({ interval: 6, strokeOpacity: 0.01 }),
				//Plot.text(serviceData, { text: "cell", x: "x", y: "y" }),
			],
		})

		containerRef.current?.append(plot)
		return () => plot.remove()
	}, [areaData])

	return <div className="flex justify-center align-center w-full" ref={containerRef} />
}
