import { useEffect, useRef } from "react"
import * as d3 from "d3"

const BarChart = () => {
	const svgRef = useRef(null)

	useEffect(() => {
		const svg = d3.select(svgRef.current)

		// set the dimensions and margins of the graph
		const width = 450
		const height = 450
		const margin = 40

		// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
		const outerRadius = Math.min(width, height) / 2 - margin
		const innerRadius = 2

		// append the svg object to the div called 'my_dataviz'
		const g = svg
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

		// set the color scale

		const data = [1, 1, 2, 3, 5, 8, 13, 21]
		const pieChart = d3.pie().padAngle(0.03)
		const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius)

		g.selectAll("whatever")
			.data(pieChart(data))
			.enter()
			.append("path")
			.attr("d", arc as any)
			//.attr("fill", d => color(d.data.key) as string)
			.attr("stroke", "black")
			.style("stroke-width", "2px")
			.style("opacity", 0.7)

		/*

			typeCounts = d3.rollup(
				data,
				v => v.length,
				d => d.outcome);

			usedData = Array.from(typeCounts, ([type, count]) => ({ type, count }));




Plot.plot({
    title: "Service Type",
    x: {label: "Service Type"},
    color: {
      scheme: "PiYG",
      type: "ordinal"
    },
    marks: [
          Plot.barY(usedData, {
            x: "type",
            y: "count",
            fill:d => d.type === "=",
            sort: {x: "y", reverse: true},
          }),
       Plot.ruleY([0])
    ]
})


plt = Plot.plot({
  x: {percent: true},
  marks: [
    Plot.barX(usedData, Plot.stackX({x: "count", fillOpacity: 0.3, inset: 0.5})),
    Plot.textX(usedData, Plot.stackX({x: "count", text: "type", inset: 0.5})),
    Plot.ruleX([0, 1])
  ]
});






			*/
	}, [])

	return <svg ref={svgRef}></svg>
}

export default BarChart
