import players from "../data/GeneralPlayer.json"

const playerMap = new Map<string, (typeof players)[0]>()

if (playerMap.size === 0) {
	for (const player of players) {
		playerMap.set(player.code, player)
	}
}

const getPlayer = (code: string) => {
	return playerMap.get(code)!
}

export default getPlayer
