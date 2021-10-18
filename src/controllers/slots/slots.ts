import Slot, { IWinningDescription, SlotConfig } from "../../components/slot";
const slotConfig: SlotConfig = {
	stake: 1,
	symbols: ["cherry", "apple", "banana", "lemon"],
	reels: [
		[
			"cherry",
			"lemon",
			"apple",
			"lemon",
			"banana",
			"banana",
			"lemon",
			"lemon",
		],
		[
			"lemon",
			"apple",
			"lemon",
			"lemon",
			"cherry",
			"apple",
			"banana",
			"lemon",
		],
		[
			"lemon",
			"apple",
			"lemon",
			"apple",
			"cherry",
			"lemon",
			"banana",
			"lemon",
		],
	],
	rules: [
		{
			symbol: "cherry",
			combinations: [
				{ coins: 50, countToWin: 3 },
				{ coins: 40, countToWin: 2 },
			],
		},
		{
			symbol: "apple",
			combinations: [
				{ coins: 20, countToWin: 3 },
				{ coins: 10, countToWin: 2 },
			],
		},
		{
			symbol: "banana",
			combinations: [
				{ coins: 15, countToWin: 3 },
				{ coins: 5, countToWin: 2 },
			],
		},
		{
			symbol: "lemon",
			combinations: [{ coins: 3, countToWin: 3 }],
		},
	],
};

class SlotsController {
	public slot: Slot;
	defaultMethod() {
		return {
			text: `You've reached the ${this.constructor.name} default method`,
		};
	}

	init(): Slot {
		return (this.slot = new Slot(slotConfig));
	}

	spin(): {
		reels: string[][];
		purse: number;
		winnings: {
			wonAmount: number;
			winningsDescription: IWinningDescription[];
		};
	} {
		return this.slot.spin();
	}
}

export = new SlotsController();
