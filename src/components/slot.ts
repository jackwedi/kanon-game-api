import * as _ from "lodash";

const MIN_REEL_ROW_SHIFT = 1;

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
	reels?: string[][];
	rules?: IWinningRule[];
	purse?: number;
	stake?: number;
}

export default class Slot {
	public reels: string[][];
	public initReels: string[][];
	public winningRules: IWinningRule[];
	public purse: number;
	public stake: number;

	public constructor(config: SlotConfig) {
		// Check same sizes
		// Check only accepted symbols

		this.winningRules = config.rules ?? [];
		this.reels = config.reels ?? [];
		this.purse = config.purse ?? 20;
		this.stake = config.stake ?? 1;

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

			// updates the reel with th offsetted rows
			for (let oldIndex = 0; oldIndex < reel.length; oldIndex++) {
				const newIndex: number =
					(oldIndex + randomOffset) % reel.length;
				reelCopy[newIndex] = reel[oldIndex];
			}

			updatedReels.push(reelCopy);
		}

		this.reels = updatedReels;
		const winnings = this.getWins();

		this.purse -= this.stake;
		this.purse += winnings.wonAmount;

		return {
			reels: this.reels,
			purse: this.purse,
			winnings: this.getWins(),
		};
	}

	public addWinningRules(...winningRules: IWinningRule[]): void {
		this.winningRules.push(...winningRules);
	}

	public addReels(...reels: string[][]): void {
		this.reels.push(...reels);
		this.initReels.push(...reels);
	}

	private getWins(): {
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

	private consecutiveCount(row: string[]): any {
		const count = _.countBy(row);
		Object.keys(count).forEach((key) => (count[key] = 0));

		let lastCell: string = null;
		for (const cell of row) {
			if (lastCell && lastCell === cell) {
				count[cell] += 1;
			} else if (count[cell] < 2) {
				count[cell] = 1;
			}
			lastCell = cell;
		}

		return count;
	}

	private getWinningRule(row: string[]): {
		rule: IWinningRule;
		combinationIndex: number;
	} {
		const consecutiveCount = this.consecutiveCount(row);

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
