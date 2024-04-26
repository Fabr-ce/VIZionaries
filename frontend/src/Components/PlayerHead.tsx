import playerAttack from "../images/player_attack.png"
import playerBlock from "../images/player_block.png"
import playerDefence from "../images/player_defense.png"
import playerReception from "../images/player_reception.png"
import playerService from "../images/player_service.png"
import playerSet from "../images/player_set.png"

const navigationIcons = [
	{
		name: "Service",
		image: playerService,
		href: "#service",
	},
	{
		name: "Attack",
		image: playerAttack,
		href: "#attack",
	},
	{
		name: "Block",
		image: playerBlock,
		href: "#block",
	},
	{
		name: "Defence",
		image: playerDefence,
		href: "#defence",
	},
	{
		name: "Reception",
		image: playerReception,
		href: "#reception",
	},
	{
		name: "Set",
		image: playerSet,
		href: "#set",
	},
]

export default function PlayerHead() {
	return (
		<div className="flex flex-col justify-center items-center w-full gap-2">
			<div className="rounded-full bg-neutral-200 w-36 h-36"></div>
			<div className="text-3xl font-bold w-full text-center">Name Name</div>

			<div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-5">
				{navigationIcons.map(nav => (
					<a href={nav.href} key={nav.name}>
						<button className="bg-accent rounded p-4">
							<img className="h-20" src={nav.image} alt={nav.name} />
						</button>
					</a>
				))}
			</div>
		</div>
	)
}
