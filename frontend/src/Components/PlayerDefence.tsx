type DefenceFilterType = {}

const filterElems: (keyof DefenceFilterType)[] = []

const efficiencyMap = {
	"#": 2,
	"+": 1,
	"!": 0,
	"-": -1,
	"/": -2,
	"=": -2,
}

export default function PlayerDefence() {
	return (
		<div id="defence" className="w-full border-neutral-300 p-4">
			<h3 className="text-2xl mb-3">Defence</h3>
			<div className="grid lg:grid-cols-2  gap-3"></div>
		</div>
	)
}
