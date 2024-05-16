import players from "../data/GeneralPlayer.json"

const playerMap = new Map<string, (typeof players)[0]>()
const teamsList: string[] = []

if (playerMap.size === 0) {
	for (const player of players) {
		playerMap.set(player.code, player)
	}
}

if (teamsList.length === 0) {
	const teamGrouped = Array.from(new Set(players.map(p => p.team)))
	for (const team of teamGrouped) {
		teamsList.push(team)
	}
}

export const getPlayer = (code: string) => {
	return playerMap.get(code)!
}

export const getTeams = () => {
	return teamsList
}
