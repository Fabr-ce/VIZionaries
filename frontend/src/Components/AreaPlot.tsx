import * as Plot from "@observablehq/plot"
import { useEffect, useRef } from "react"
import serves from "../data/GeneralServe.json"

export default function ExamplePlot() {
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const xyTransisition = serves
			.filter((s: any) => s.type === "Q" && s.outcome === "#")
			.map((s: any) => {
				const pos = targetPos(s.toPos, s.toPosExact)

				return { x: pos[0], y: pos[1] }
			})

		const baseLine: { x: number; y: number }[] = []
		for (let i = 0; i < 6; i++) {
			for (let x = 0; x < 6; x++) {
				baseLine.push({ x: x, y: i })
			}
		}
		xyTransisition.push(...baseLine)

		const plot = Plot.plot({
			className: "w-full",
			height: 640,
			axis: null,

			x: { domain: [0, 6], label: "Y-pos" },
			y: { domain: [0, 6] },
			color: { type: "linear", scheme: "ylgnbu", legend: true, label: "Service Attempts" },
			marks: [
				Plot.rect(
					xyTransisition,
					Plot.bin(
						{ fill: "count" },
						{
							x: "x",
							y: "y",

							interval: 1,
						}
					)
				),
				Plot.gridX({ interval: 6, strokeOpacity: 0.01 }),
				Plot.gridY({ interval: 6, strokeOpacity: 0.01 }),
			],
		})

		containerRef.current?.append(plot)
		return () => plot.remove()
	}, [])

	return <div className="flex justify-center align-center w-full" ref={containerRef} />
}

const serveFromToScale = (from: string) => {
	// 5 7 6 9 1
	switch (parseInt(from)) {
		case 5:
			return 1.5
		case 7:
			return 3
		case 6:
			return 4.5
		case 9:
			return 6
		case 1:
			return 7.5
	}
}

const targetPos = (pos: number, posExact: string = ["A", "B", "C", "D"][Math.floor(Math.random() * 4)]) => {
	if (pos === null) return [-1, -1]
	/*
	1 6 5
	9 8 7
	2 3 4

	C B
	D A
	*/

	const r1 = [4, 3, 2]
	const r2 = [7, 8, 9]
	const r3 = [5, 6, 1]

	let x, y
	if (r1.includes(pos)) {
		x = 2 * r1.indexOf(pos) + 1
		y = 5
	} else if (r2.includes(pos)) {
		x = 2 * r2.indexOf(pos) + 1
		y = 3
	} else if (r3.includes(pos)) {
		x = 2 * r3.indexOf(pos) + 1
		y = 1
	} else {
		console.log("Pos:", pos)
		throw new Error("Position not found")
	}

	if (posExact) {
		const e1 = ["C", "B"]
		const e2 = ["D", "A"]
		if (e1.includes(posExact)) {
			x += 0.5 * (2 * e1.indexOf(posExact) - 1)
			y -= 0.5
		} else if (e2.includes(posExact)) {
			x += 0.5 * (2 * e2.indexOf(posExact) - 1)
			y += 0.5
		} else {
			console.log("ExactPos:", pos)
			throw new Error("ExactPos not found")
		}
	}

	return [x, y]
}
