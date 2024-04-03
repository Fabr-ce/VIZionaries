import { matchDetails, TeamInfo } from "../types"
import { convertToAction, convertToSetTarget, enumFromString, enumFromStringRequired } from "./helpers"
import {
	Action,
	Actions,
	Attack,
	AttackOutcomes,
	AttackSpeed,
	AttackType,
	Block,
	BlockCount,
	Defence,
	DefenceType,
	ExactPos,
	MBApproach,
	Point,
	Reception,
	ReceptionOutcomes,
	ReceptionType,
	Serve,
	ServeType,
	Set,
	SetOutcomes,
	SetSkill,
	SetTarget,
	Substitution,
} from "./types"

export class StatParser {
	private sets: Point[][] = []
	private setPoints: Point[] = []
	private currentPoint: Point = {} as Point

	private lastAction: Action = {} as Action

	private matchDetailsInfo: matchDetails = {} as matchDetails
	private homeTeamInfo: TeamInfo = {} as TeamInfo
	private awayTeamInfo: TeamInfo = {} as TeamInfo

	public attackCombinations: Map<string, SetTarget> = new Map()

	parseStatLine(code: string, rotH: Point["hRot"], rotA: Point["aRot"]) {
		const homeTeam = code.substring(0, 1) === "*"
		const codeType = code.substring(1, 2)

		if (codeType === "P") {
			//setter number
			const nr = parseInt(code.substring(2, 4), 10)
			if (homeTeam) this.currentPoint.hSNr = nr
			else this.currentPoint.aSNr = nr
		} else if (codeType === "p") {
			//point
			const str = code.substring(2, 7).split(":")
			const homeScore = parseInt(str[0])
			const awayScore = parseInt(str[1])
			const lastHomeScore = this.setPoints.at(-1)?.score[0] || 0
			this.currentPoint.score = [homeScore, awayScore]
			this.currentPoint.hRot = rotH
			this.currentPoint.aRot = rotA
			this.currentPoint.homePoint = homeScore > lastHomeScore
			this.setPoints.push(this.currentPoint)
			this.currentPoint = {} as Point
		} else if (codeType === "z") {
			//setter position
			const pos = parseInt(code.substring(2, 3), 10)
			if (homeTeam) this.currentPoint.hSPos = pos
			else this.currentPoint.aSPos = pos
		} else if (codeType === "c") {
			// player substitution
		} else if (codeType === "*" && homeTeam) {
			//set finished
			this.sets.push(this.setPoints)
			this.setPoints = []
		} else if (codeType == "T") {
			// timeout
		} else if (codeType === "$") {
			//team code -> no distinct player
		} else {
			// main code
			const playerCode = code.substring(1, 3)
			const playerNumber = parseInt(playerCode, 10)
			const action = code.substring(3, 4)
			const actionType = code.substring(4, 5)
			const outcome = code.substring(5, 6)

			// advanced code
			const combination = code.substring(6, 8)
			const target = code.substring(8, 9)
			const startZone = code.substring(9, 10)
			const endZone = code.substring(10, 11)
			const endZoneDetail = code.substring(11, 12)

			// extended code
			const skillType = code.substring(12, 13)
			const players = code.substring(13, 14)

			let currentAction: Action
			try {
				currentAction = {
					action: convertToAction(action),
					actionType,
					outcome,
					player: playerNumber,
					home: homeTeam,
				}
			} catch (err) {
				return
			}

			try {
				if (action === Actions.Set) {
					const action: Set = {
						...currentAction,
						mbApproach: enumFromString(MBApproach, combination),
						target: enumFromString(SetTarget, target),
						pos: parseInt(endZone),
						posExact: enumFromString(ExactPos, endZoneDetail),
						skill: enumFromString(SetSkill, skillType),
						outcome: enumFromStringRequired(SetOutcomes, outcome),
					}
					currentAction = action
				} else if (action === Actions.Serve) {
					const action: Serve = {
						...currentAction,
						type: enumFromStringRequired(ServeType, actionType),
						fromPos: parseInt(startZone),
						toPos: parseInt(endZone),
						toPosExact: enumFromString(ExactPos, endZoneDetail),
					}
					currentAction = action
				} else if (action === Actions.Reception) {
					const action: Reception = {
						...currentAction,
						serviceType: enumFromStringRequired(ServeType, actionType),
						receptionType: enumFromString(ReceptionType, skillType),
						outcome: enumFromStringRequired(ReceptionOutcomes, outcome),
					}
					currentAction = action
				} else if (action === Actions.Attack) {
					const action: Attack = {
						...currentAction,
						attackType: enumFromStringRequired(AttackType, actionType),
						fromPos: parseInt(startZone),
						toPos: parseInt(endZone),
						toPosExact: enumFromString(ExactPos, endZoneDetail),
						attackSpeed: enumFromString(AttackSpeed, skillType),
						blockCount: enumFromString(BlockCount, players),
						outcome: enumFromStringRequired(AttackOutcomes, outcome),
					}
					currentAction = action

					if (this.attackCombinations.has(combination)) {
						action.attackCombo = combination
						if (this.lastAction && this.lastAction.action === Actions.Set) {
							const lastSet = this.lastAction as Set
							if (!lastSet.target) {
								lastSet.target = this.attackCombinations.get(combination)
							}
						}
					}
				} else if (action === Actions.Block) {
					const action: Block = {
						...currentAction,
						blockCount: enumFromString(BlockCount, players),
						attackType: enumFromStringRequired(AttackType, actionType),
					}
					currentAction = action
				} else if (action === Actions.Defence) {
					const action: Defence = {
						...currentAction,
						attackType: enumFromStringRequired(AttackType, actionType),
						defenceType: enumFromString(DefenceType, skillType),
					}
					currentAction = action
				}
			} catch (err) {
				console.log(code, err)
				return
			}

			if (this.currentPoint.actions) this.currentPoint.actions.push(currentAction)
			else this.currentPoint.actions = [currentAction]
			this.lastAction = currentAction
		}
	}

	public getData() {
		return {
			matchDetails: this.matchDetailsInfo,
			homeTeam: this.homeTeamInfo,
			awayTeam: this.awayTeamInfo,
			sets: this.getSets(),
		}
	}

	public getSets() {
		const sets: Point[][] = []
		for (const set of this.sets) {
			if (set.length > 0) {
				sets.push(set)
			}
		}
		return sets
	}

	public getSet(set: number) {
		return this.sets[set]
	}

	public getPoints() {
		const points: Point[] = []
		for (const set of this.sets) {
			points.push(...set)
		}
		return points
	}

	public setMatchDetails(match: matchDetails) {
		this.matchDetailsInfo = match
	}

	get matchDetails() {
		return this.matchDetailsInfo
	}

	public setHomeTeamInfo(teamInfo: TeamInfo) {
		this.homeTeamInfo = teamInfo
	}

	get homeTeam() {
		return this.homeTeamInfo
	}

	public setAwayTeamInfo(teamInfo: TeamInfo) {
		this.awayTeamInfo = teamInfo
	}

	get awayTeam() {
		return this.awayTeamInfo
	}
}
