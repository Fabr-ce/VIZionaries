import * as d3 from "d3"
import { getPlayer } from "./playerHelper"

type FilterParams = Readonly<{
	playerId?: string
	teamId?: string
	position?: string
}>

export const filterSelfDataset = <T extends { playerId: string }>(
	data: T[],
	{ playerId, teamId, position }: FilterParams
) => {
	if (teamId || position) data = filterDataset(data, { playerId, teamId, position })
	return playerId ? data.filter(d => d.playerId === playerId) : data
}

export const filterDataset = <T extends { playerId: string }>(data: T[], { teamId, position }: FilterParams) => {
	const playerGroups = d3.groups(data, d => d.playerId)
	return playerGroups
		.filter(([pId, _]) => {
			const player = getPlayer(pId)
			if (!player) return false
			if (teamId && player.team !== teamId) return false
			if (position && player.position !== position) return false
			return true
		})
		.flatMap(([_, val]) => val)
}
