import { Actions, Point, SetTarget } from "./types"

export const convertToAction = (action: string): Actions => {
	switch (action) {
		case Actions.Attack:
			return Actions.Attack
		case Actions.Block:
			return Actions.Block
		case Actions.Defence:
			return Actions.Defence
		case Actions.Freeball:
			return Actions.Freeball
		case Actions.Reception:
			return Actions.Reception
		case Actions.Serve:
			return Actions.Serve
		case Actions.Set:
			return Actions.Set
		default:
			throw new Error("Undefined Action found: " + action)
	}
}

export const convertToSetTarget = (target: string): SetTarget | undefined => {
	switch (target) {
		case SetTarget.Back:
			return SetTarget.Back
		case SetTarget.Center:
			return SetTarget.Center
		case SetTarget.Dump:
			return SetTarget.Dump
		case SetTarget.Front:
			return SetTarget.Front
		case SetTarget.Pipe:
			return SetTarget.Pipe
		default:
			return undefined
	}
}

export function enumFromString<T>(enm: { [s: string]: T }, value: string): T | undefined {
	if ((Object.values(enm) as unknown as string[]).includes(value)) return value as unknown as T
	else return undefined
}

export function enumFromStringRequired<T>(enm: { [s: string]: T }, value: string): T {
	const result = enumFromString(enm, value)
	if (result === undefined) {
		throw new Error("did not found the right enum: " + value)
	}
	return result
}

export function getRotations(rots: string[]): [Point["hRot"], Point["aRot"]] {
	const nrRot = rots.map(r => parseInt(r))
	const hRot: Point["hRot"] = [nrRot[0], nrRot[1], nrRot[2], nrRot[3], nrRot[4], nrRot[5]]
	const aRot: Point["hRot"] = [nrRot[6], nrRot[7], nrRot[8], nrRot[9], nrRot[10], nrRot[11]]

	return [hRot, aRot]
}
