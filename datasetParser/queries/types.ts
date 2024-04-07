import { Action, Point } from "../parser/stats/types"

export enum VolleyPosition {
	Outside = "A",
	Opposite = "O",
	Setter = "S",
	Middle = "M",
	Libero = "L",
}

export type AggregatorFunction = (action: Action, point: Point) => (number | null)[]

export type AverageAggreation = {
	avg: number
	std: number
}
