import PlayerHead from "./PlayerHead"
import PlayerService from "./PlayerService"

export default function Player() {
	return (
		<div className="w-full h-full flex items-center justify-center flex-col gap-7 p-5 px-4 scroll-smooth">
			<PlayerHead />
			<PlayerService />
		</div>
	)
}
