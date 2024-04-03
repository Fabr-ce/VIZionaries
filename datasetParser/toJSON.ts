import * as fs from "fs/promises"
import parseDatasheet from "./parser/parseDatasheet"
import { matchData } from "./parser/types"

const toJSON = async (path: string) => {
	console.log("called")
	const directory = await fs.readdir(path)

	const dataset: matchData[] = []
	for (const filePath of directory) {
		if (!filePath.endsWith(".dvw")) continue
		console.log(filePath)

		const file = await fs.readFile(path + "/" + filePath)
		const data = file.toString()

		const stats = parseDatasheet(data)
		const matchData = stats.getData()
		dataset.push(matchData)
	}

	await fs.writeFile("./dataVolley.json", JSON.stringify(dataset, null, 2))
}

export default toJSON
