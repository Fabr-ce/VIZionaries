type ReceptionFilterType = {}

const filterElems: (keyof ReceptionFilterType)[] = []

const efficiencyMap = {
	"#": 2,
	"+": 1,
	"!": 0,
	"-": -1,
	"/": -2,
	"=": -2,
}

export default function PlayerReception() {
	return (
		<div id="reception" className="w-full border-neutral-300 p-4">
			<h3 className="text-2xl mb-3">Reception</h3>
			<div className="grid lg:grid-cols-2  gap-3"></div>
		</div>
	)
}
