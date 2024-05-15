import * as Plot from "@observablehq/plot"

type markingType = {
	color?: string
	width?: number
}

const markings = ({ color = "white", width = 10 }: markingType) => {
	return [
		Plot.lineY([6, 0], { stroke: color, strokeWidth: width, x: [0, 0] }),
		Plot.lineY([6, 0], { stroke: color, strokeWidth: width, x: [6, 6] }),
		Plot.lineX([6, 0], { stroke: color, strokeWidth: width, y: [6, 6] }),
		Plot.lineX([6.1, -0.1], { stroke: color, strokeWidth: 3 * width, y: [0, 0] }),
		Plot.lineX([6, 0], { stroke: color, strokeWidth: width, y: [2, 2] }),
		Plot.lineY([6.4, 6.3], { stroke: color, strokeWidth: width, x: [0, 0] }),
		Plot.lineY([6.4, 6.3], { stroke: color, strokeWidth: width, x: [6, 6] }),
	]
}

export default markings
