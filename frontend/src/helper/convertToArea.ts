import * as d3 from "d3"

export type AreaTargetType = {
	toPos?: number | null
	toPosExact?: string | null
}

export type AreaSetType = {
	pos?: number | null
	attackScore: boolean
	pointWon: boolean
}

type AreaResult = {
	cell: string
	x: number
	y: number
	count: number
}

/*
	1 6 5
	9 8 7
	2 3 4

	C B
	D A
	*/

const positions = [
	{ name: 1, xOff: 0, yOff: 0 },
	{ name: 6, xOff: 1, yOff: 0 },
	{ name: 5, xOff: 2, yOff: 0 },

	{ name: 9, xOff: 0, yOff: 1 },
	{ name: 8, xOff: 1, yOff: 1 },
	{ name: 7, xOff: 2, yOff: 1 },

	{ name: 2, xOff: 0, yOff: 2 },
	{ name: 3, xOff: 1, yOff: 2 },
	{ name: 4, xOff: 2, yOff: 2 },
]

const exactPositions = [
	{ name: "A", xOff: 0, yOff: 0 },
	{ name: "D", xOff: 1, yOff: 0 },
	{ name: "B", xOff: 0, yOff: 1 },
	{ name: "C", xOff: 1, yOff: 1 },
]

export const convertToTargetArea = (data: AreaTargetType[]) => {
	data = data.filter(d => !!d.toPos)
	const fieldBuckets = d3.rollup(
		data,
		v => v.length,
		d => d.toPos + (d.toPosExact ?? "")
	)

	//check for buckets with no exactPositions
	for (const pos of positions) {
		if (fieldBuckets.has(pos.name + "")) {
			// assign the values to exact subBuckets
			const count = Math.round((fieldBuckets.get(pos.name + "") ?? 0) / 4)
			for (const exactPos of exactPositions) {
				const newExactCount = (fieldBuckets.get(pos.name + exactPos.name) ?? 0) + count
				fieldBuckets.set(pos.name + exactPos.name, newExactCount)
			}
			fieldBuckets.delete(pos.name + "")
		}
	}

	const results: AreaResult[] = []
	for (const pos of positions) {
		for (const exactPos of exactPositions) {
			const count = fieldBuckets.get(pos.name + exactPos.name) ?? 0
			const x = pos.xOff * 2 + exactPos.xOff
			const y = (2 - pos.yOff) * 2 + (1 - exactPos.yOff)
			results.push({ cell: pos.name + exactPos.name, count, x, y })
		}
	}

	return results
}

export const convertToSetterArea = (data: AreaSetType[]) => {
	data = data.filter(d => !!d.pos)

	const fieldBuckets = d3.rollup(
		data,
		v => ({
			percent: Math.round((100 * v.length) / data.length),
			count: v.length,
			directScore: Math.round((100 * v.filter(s => s.attackScore).length) / v.length),
			ptScore: Math.round((100 * v.filter(s => s.pointWon).length) / v.length),
		}),
		d => d.pos
	)

	const results: AreaResult[] = []
	for (const pos of positions) {
		const result = fieldBuckets.get(pos.name) ?? { percent: 0, count: 0, directScore: 0, ptScore: 0 }
		const x = pos.xOff * 2
		const y = (2 - pos.yOff) * 2
		results.push({ cell: pos.name + "", ...result, x, y })
	}

	return results
}
