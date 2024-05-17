import PlayerAttack from "./PlayerAttack"
import PlayerBlock from "./PlayerBlock"
import PlayerDefence from "./PlayerDefence"
import PlayerHead from "./PlayerHead"
import PlayerReception from "./PlayerReception"
import PlayerService from "./PlayerService"
import PlayerSet from "./PlayerSet"
import PlayerSummary from "./PlayerSummary"

export default function Player() {
	return (
		<div className="w-full h-full scroll-smooth">
			<PlayerHead />
			<PlayerSummary />
			<div className="w-full h-full grid justify-center grid-cols-1 2xl:grid-cols-2 gap-7 p-5 px-4">
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
