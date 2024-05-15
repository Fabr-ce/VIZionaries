import { Action, Actions, Attack, Point, Reception, Block } from "../../parser/stats/types"
import { DataAggregation } from "./observer"

export const blockMeanObserver = []

type BlockList = Partial<Block> | { playerId: string }

export class GeneralBlock extends DataAggregation<BlockList> {
	action: Actions = Actions.Block
	include(action: Action, point: Point): boolean {
		return true
	}
	mapToValue(action: Action, point: Point, playerId: string): BlockList {
		const { outcome, blockCount, attackType } = action as Block
		return { outcome, blockCount, attackType, playerId }
	}
}

export const blockAggregations = [new GeneralBlock("./aggregation/data/GeneralBlock.json")]
