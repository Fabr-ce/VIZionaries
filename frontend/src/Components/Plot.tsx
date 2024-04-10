import * as Plot from "@observablehq/plot"
import { useEffect, useRef } from "react"
import penguins from "../penguins.json"

export default function ExamplePlot() {
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const plot = Plot.plot({
			marks: [Plot.dot(penguins, { x: "culmen_length_mm", y: "culmen_depth_mm" })],
			className: "w-full",
		})
		containerRef.current?.append(plot)
		return () => plot.remove()
	}, [])

	return <div className="flex justify-center align-center w-full" ref={containerRef} />
}
