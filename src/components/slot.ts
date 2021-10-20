import { assert } from "console";
import * as _ from "lodash";
import {
	consecutiveCount as getConsecutiveCount,
	shiftArray,
} from "../utils/arraysUtils";

const MIN_REEL_ROW_SHIFT = 1;
const onlyAlphaCharactersRegExp = new RegExp("^(?=.*[a-zA-Z])[A-Za-z]+$");
interface IWinningRule {
	symbol: string;
	combinations: ICombination[];
}

interface ICombination {
	countToWin: number;
	coins: number;
}

export interface IWinningDescription {
	rowIndex;
	symbol: string;
	wonCoins: number;
}

export interface SlotConfig {
	symbols: string[];
	reels: string[][];
	rules: IWinningRule[];
	purse: number;
	stake: number;
}

export default class Slot {
	public symbols: string[];
	public reels: string[][];
	public initReels: string[][];
	public winningRules: IWinningRule[];
	public purse: number;
	public stake: number;

	public constructor(config: SlotConfig) {
		// Check config
		const undefinedProperties = [
			config.symbols,
			config.rules,
			config.reels,
			config.purse,
			config.stake,
		].filter((element) => element === undefined);
		if (undefinedProperties.length > 0)
			throw `Undefined Properties ${undefinedProperties}`;

		// Check only accepted symbols
		const validSymbols = config.symbols.every(
			(symbol) => onlyAlphaCharactersRegExp.exec(symbol) !== null
		);
		if (!validSymbols) throw `Wrong Symbols ${config.symbols}`;

		//Check all reels have the same size
		const sameSizeReels = config.reels.every(
			(reel) => reel.length === config.reels[0].length
		);
		if (!sameSizeReels) throw `Mismatch Reels size ${config.reels}`;

		// Ensures symbols are uniques
		this.symbols = _.uniq(config.symbols);

		this.winningRules = config.rules;
		this.reels = config.reels;
		this.purse = config.purse;
		this.stake = config.stake;

		this.initReels = this.reels;
	}

	private get rows(): string[][] {
		return this.reels.reduce(
			(prev: string[][], next: string[]) =>
				next.map((item: string, i: number) =>
					(prev[i] || []).concat(next[i])
				),
			[]
		);
	}

	public spin(): {
		reels: string[][];
		purse: number;
		winnings: {
			wonAmount: number;
			winningsDescription: IWinningDescription[];
		};
	} {
		const updatedReels: string[][] = [];
		for (const reel of this.reels) {
			const reelCopy = [...reel];

			// random offset to shift the rows
			const randomOffset: number = Math.floor(
				Math.random() * reel.length - 1 + MIN_REEL_ROW_SHIFT
			);

			updatedReels.push(shiftArray(reelCopy, randomOffset));
		}

		this.reels = updatedReels;
		const winnings = this.getWins();

		this.purse -= this.stake;
		this.purse += winnings.wonAmount;

		return {
			reels: this.reels,
			purse: this.purse,
			winnings,
		};
	}

	public getWins(): {
		wonAmount: number;
		winningsDescription: IWinningDescription[];
	} {
		const rows = this.rows;
		let winningsDescription: IWinningDescription[] = [];
		let wonAmount: number = 0;

		for (let rowIndex: number = 0; rowIndex < rows.length; rowIndex++) {
			const winningRule = this.getWinningRule(rows[rowIndex]);
			if (winningRule !== null) {
				winningsDescription.push({
					rowIndex,
					symbol: winningRule.rule.symbol,
					wonCoins:
						winningRule.rule.combinations[
							winningRule.combinationIndex
						].coins,
				});
				wonAmount +=
					winningRule.rule.combinations[winningRule.combinationIndex]
						.coins;
			}
		}

		return { wonAmount, winningsDescription };
	}

	private getWinningRule(row: string[]): {
		rule: IWinningRule;
		combinationIndex: number;
	} {
		const consecutiveCount = getConsecutiveCount(row);

		for (const winningRule of this.winningRules) {
			if (consecutiveCount[winningRule.symbol]) {
				for (
					let combinationIndex: number = 0;
					combinationIndex < winningRule.combinations.length;
					combinationIndex++
				) {
					if (
						winningRule.combinations[combinationIndex]
							.countToWin === consecutiveCount[winningRule.symbol]
					) {
						return { rule: winningRule, combinationIndex };
					}
				}
			}
		}
		return null;
	}
}
