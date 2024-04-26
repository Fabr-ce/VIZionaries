import PlayerAttack from "./PlayerAttack"
import PlayerBlock from "./PlayerBlock"
import PlayerDefence from "./PlayerDefence"
import PlayerHead from "./PlayerHead"
import PlayerReception from "./PlayerReception"
import PlayerService from "./PlayerService"
import PlayerSet from "./PlayerSet"

export default function Player() {
	return (
		<div className="w-full h-full scroll-smooth">
			<PlayerHead />
			<div className="w-full h-full grid items-center justify-center grid-cols-1 xl:grid-cols-2 gap-7 p-5 px-4">
				<PlayerService />
				<PlayerAttack />
				<PlayerBlock />
				<PlayerDefence />
				<PlayerReception />
				<PlayerSet />
			</div>
		</div>
	)
}
