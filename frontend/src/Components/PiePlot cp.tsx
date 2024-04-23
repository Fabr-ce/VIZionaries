import React, { useState, useEffect, useRef } from "react"
import * as d3 from "d3"
import { AnyCnameRecord } from "dns"

const BarChart = () => {
	const svgRef = useRef(null)
	const [data, setData] = useState<{ name: string; value: number }[]>([
		{
			name: "A",
			value: 50,
		},
		{
			name: "B",
			value: 20,
		},
		{
			name: "C",
			value: 40,
		},
		{
			name: "D",
			value: 70,
		},
	])

	useEffect(() => {
		const svg = d3.select(svgRef.current)

		// set the dimensions and margins of the graph
		const width = 450
		const height = 450
		const margin = 40

		// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
		var radius = Math.min(width, height) / 2 - margin

		// append the svg object to the div called 'my_dataviz'
		svg.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

		// Create dummy data
		var data: { name: string; value: number }[] = [
			{ name: "a", value: 20 },
			{ name: "b", value: 40 },
			{ name: "c", value: 60 },
		]

		// set the color scale
		var color = d3
			.scaleOrdinal()
			.domain(data.map(d => d.name))
			.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])

		// Compute the position of each group on the pie:
		var pie = d3.pie<{ name: string; value: number }>().value(d => d.value)
		var data_ready = pie(data)

		// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
		svg.selectAll("whatever")
			.data(data_ready)
			.enter()
			.append("path")
			.attr("d", d3.arc().innerRadius(0).outerRadius(radius) as any)
			.attr("fill", d => color(d.data.name) as string)
			.attr("stroke", "black")
			.style("stroke-width", "2px")
			.style("opacity", 0.7)
	}, [data])

	return <svg ref={svgRef}></svg>
}

export default BarChart
