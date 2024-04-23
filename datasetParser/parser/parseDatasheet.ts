import { enumFromString, enumFromStringRequired, getRotations } from "./stats/helpers"
import { StatParser } from "./stats/statParser"
import { SetTarget } from "./stats/types"
import { matchDetails, SetType, TeamInfo } from "./types"

const parseDatasheet = (data: string) => {
	const lines = data.trim().split("\n")

	const matchDetails: matchDetails = {} as matchDetails
	const homeTeamInfo: TeamInfo = {} as TeamInfo
	const awayTeamInfo: TeamInfo = {} as TeamInfo

	homeTeamInfo.players = []
	awayTeamInfo.players = []

	const statParser = new StatParser()

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]

		if (line.includes("[3MATCH]")) {
			var details = splitLine(lines[i + 1])
			matchDetails.date = details[0]
			matchDetails.time = details[1]
			matchDetails.tournament = details[3]
			matchDetails.matchNr = details[7]
			i += 1
		} else if (line.includes("[3TEAMS]")) {
			processTeamInfo(lines[i + 1], homeTeamInfo)
			processTeamInfo(lines[i + 2], awayTeamInfo)
			i += 2
		} else if (line.includes("[3COMMENTS]")) {
			i += 1
		} else if (line.includes("[3SET]")) {
			const setLines = lines.slice(i + 1, i + 6)
			matchDetails.score = processSetScore(setLines)
			i += 5
		} else if (line.includes("[3PLAYERS-H]")) {
			while (isPlayerRow(lines[i + 1])) {
				homeTeamInfo.players.push(processPlayer(lines[i + 1]))
				i += 1
			}
		} else if (line.includes("[3PLAYERS-V]")) {
			while (isPlayerRow(lines[i + 1])) {
				awayTeamInfo.players.push(processPlayer(lines[i + 1]))
				i += 1
			}
		} else if (line.includes("[3ATTACKCOMBINATION]")) {
			while (!lines[i + 1].startsWith("[")) {
				const line = lines[i + 1].split(";")
				const code = line[0]
				const target = line[8]
				statParser.attackCombinations.set(code, enumFromStringRequired(SetTarget, target))
				i += 1
			}
		} else if (line.includes("[3SCOUT]")) {
			//start of real stats
			for (var j = i + 1; j < lines.length; j++) {
				const scoutData = splitLine(lines[j])
				const splitedLine = lines[j].split(";;")
				const rots = splitedLine[splitedLine.length - 1]
				const [hRot, aRot] = getRotations(splitLine(rots))
				statParser.parseStatLine(scoutData[0], hRot, aRot)
				i = j
			}
		} else {
			//do nothing
		}
	}
	statParser.setMatchDetails(matchDetails)
	statParser.setHomeTeamInfo(homeTeamInfo)
	statParser.setAwayTeamInfo(awayTeamInfo)
	return statParser
}

const splitLine = (line: string) => {
	return line.split(";")
}

const isPlayerRow = function (line: string) {
	const playerData = splitLine(line)
	return playerData[0] == "0" || playerData[0] == "1"
}

const processPlayer = (line: string) => {
	const data = splitLine(line)
	return {
		number: parseInt(data[1]),
		code: data[8],
		lastName: data[9],
		firstName: data[10],
		isLibero: data[12] === "L",
	}
}

const processSetScore = (sets: string[]) => {
	const setData: SetType[] = []
	const parseSetRes = (score: string): null | [number, number] => {
		const vals = score.split("-")
		if (vals.length === 1) return null
		return [parseInt(vals[0]), parseInt(vals[1])]
	}

	for (const set of sets) {
		const data = splitLine(set)
		const final = parseSetRes(data[4])
		if (!final) continue
		const intermediate: SetType["intermediate"] = []
		for (const str of data.slice(1, 4)) {
			const score = parseSetRes(str)
			if (score) intermediate.push(score)
		}

		setData.push({ final, intermediate })
	}

	return setData
}

const processTeamInfo = (line: string, teamInfo: TeamInfo) => {
	const data = splitLine(line)
	teamInfo.code = data[0]
	teamInfo.name = data[1]
	teamInfo.headCoach = data[3]
	teamInfo.assistantCoach = data[4]
}

export default parseDatasheet
