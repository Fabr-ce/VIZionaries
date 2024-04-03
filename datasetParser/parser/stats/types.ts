export interface Point {
	aSPos: number
	aSNr: number
	aRot: [number, number, number, number, number, number]

	hSPos: number
	hSNr: number
	hRot: [number, number, number, number, number, number]

	score: [number, number]
	homePoint: boolean
	actions: Action[]
}

export interface Action {
	home: boolean
	player: number
	action: Actions
	actionType: string
	outcome: string
}

export interface Set extends Action {
	mbApproach?: string
	target?: SetTarget
	outcome: SetOutcomes
	skill?: SetSkill
	pos: number
	posExact?: ExactPos
}

export interface Serve extends Action {
	type: ServeType
	fromPos: number
	toPos: number
	toPosExact?: ExactPos
}

export interface Reception extends Action {
	serviceType: ServeType
	receptionType?: ReceptionType
	outcome: ReceptionOutcomes
}

export interface Attack extends Action {
	attackType: AttackType
	attackCombo?: string
	fromPos: number
	toPos: number
	toPosExact?: ExactPos
	attackSpeed?: AttackSpeed
	blockCount?: BlockCount
}

export interface Block extends Action {
	attackType: AttackType
	blockCount?: BlockCount
}

export interface Defence extends Action {
	attackType: AttackType
	defenceType?: DefenceType
}

export interface Substitution {
	score: [number, number]
	home: boolean
	nrOut: number
	nrIn: number
}

export enum Actions {
	Serve = "S",
	Reception = "R",
	Attack = "A",
	Block = "B",
	Defence = "D",
	Set = "E",
	Freeball = "F",
}

export enum ServeType {
	StandFloat = "H",
	JumpFloat = "M",
	JumpSpin = "Q",
	// not used
	Tense = "T",
	Super = "T",
	Fast = "N",
	Other = "O",
}
export enum ReceptionType {
	Left = "L",
	Right = "R",
	Low = "W",
	Set = "O",
	Middle = "M",
}

export enum AttackType {
	High = "H",
	Medium = "M",
	Quick = "Q",
	Tense = "T",
	Super = "U",
	Fast = "N",
	Other = "O", // other (custom)
}

export enum DefenceType {
	Spike = "S",
	Cover = "C",
	AfterBlock = "B",
}

export enum AttackSpeed {
	Hard = "H",
	Soft = "S",
	Tip = "T",
	PowerTip = "P",
}

export enum SetTarget {
	Center = "C",
	Back = "B",
	Front = "F",
	Pipe = "P",
	Dump = "S",
	// to handle errors
	None = "-",
}

export enum SetSkill {
	OneHand = "1",
	TwoHands = "2",
	Bump = "3",
	Other = "4",
	Underhand = "5",
}

export enum SetOutcomes {
	Perfect = "#",
	Good = "+",
	Excl = "!",
	Poor = "-",
	Overpass = "/",
	Error = "=",
}

export enum MBApproach {
	Front = "K1",
	Back = "K2",
	Shoot = "K7",
	Push = "KC",
}

export enum AttackOutcomes {
	Error = "=",
	Blocked = "/",
	Transition = "-",
	Covered = "!",
	Good = "+",
	Point = "#",
}

export enum ReceptionOutcomes {
	Perfect = "#",
	Good = "+",
	Okay = "!",
	Bad = "-",
	Overpass = "/",
	Error = "=",
}

export enum BlockCount {
	noBlock = "0",
	oneBlock = "1",
	twoBlock = "2",
	threeBlock = "3",
	holeBlock = "4",
}

export enum ExactPos {
	A = "A",
	B = "B",
	C = "C",
	D = "D",
}
