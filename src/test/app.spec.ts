import Slot, { SlotConfig } from "../components/slot";
import { consecutiveCount, shiftArray } from "../utils/arraysUtils";
const slotConfig = require("./slotConfig.json");

describe("Test Slot Constructor", () => {
	let slot: Slot;
	let copyConfig: SlotConfig;
	beforeEach(() => {
		slot = new Slot(slotConfig);
		copyConfig = { ...slotConfig };
	});

	test("not defined config should be initialized", () => {
		copyConfig.symbols = ["A", "B", "C", "D"];
		slot = new Slot(copyConfig);
		expect(slot.purse).toBeDefined();
		expect(slot.initReels).toBeDefined();
		expect(slot.reels).toBeDefined();
		expect(slot.stake).toBeDefined();
		expect(slot.winningRules).toBeDefined();
	});

	test("symbols should be uniques", () => {
		copyConfig.symbols = ["A", "B", "C", "D", "D"];
		slot = new Slot(copyConfig);
		expect(slot.symbols).toStrictEqual(["A", "B", "C", "D"]);
	});

	test("should throw on wrong symbols", () => {
		expect(() => {
			copyConfig.symbols = ["A", "B", "C?", "D", "D"];
			new Slot(copyConfig);
		}).toThrow(`Wrong Symbols A,B,C?,D,D`);

		expect(() => {
			copyConfig.symbols = ["A", "B", "C", "D4", "D"];
			new Slot(copyConfig);
		}).toThrow(`Wrong Symbols A,B,C,D4,D`);

		expect(() => {
			copyConfig.symbols = ["A2", "\n"];
			new Slot(copyConfig);
		}).toThrow(`Wrong Symbols A2,\n`);
	});

	test("should throw on mismatched reels size", () => {
		expect(() => {
			copyConfig.symbols = ["A", "B"];
			copyConfig.reels = [["A"], ["A", "B"]];
			new Slot(copyConfig);
		}).toThrow(`Mismatch Reels size A,A,B`);
	});

	test("should throw on undefined properties", () => {
		expect(() => {
			copyConfig.symbols = undefined;
			new Slot(copyConfig);
		}).toThrow(`Undefined Properties`);
	});
});

describe("Test utils", () => {
	test("shiftArray should shift array by the specified offset", () => {
		const targetArray = ["A", "B", "C"];

		const shift1 = shiftArray(targetArray, 1);
		expect(shift1).toEqual(["C", "A", "B"]);

		const shift2 = shiftArray(targetArray, 2);
		expect(shift2).toEqual(["B", "C", "A"]);

		const shift3 = shiftArray(["A", "B", "C", "D", "E"], 5);
		expect(shift3).toEqual(["A", "B", "C", "D", "E"]);
	});

	test("consecutiveCount should count occurence of consecutive element of an array", () => {
		const test1Array = ["A", "A", "B", "B", "C", "B"];
		expect(consecutiveCount(test1Array)).toEqual({ A: 2, B: 2, C: 1 });

		const test2Array = ["A", "B", "B", "B", "C", "A", "A"];
		expect(consecutiveCount(test2Array)).toEqual({
			A: 2,
			B: 3,
			C: 1,
		});
	});
});

describe("Test Slot spin", () => {
	let slot: Slot = new Slot({
		purse: 20,
		reels: [
			["A", "B", "C", "A", "B", "C"],
			["A", "A", "A", "A", "A", "B"],
			["C", "A", "A", "A", "A", "A"],
		],
		rules: [{ symbol: "A", combinations: [{ coins: 20, countToWin: 3 }] }],
		stake: 1,
		symbols: ["A", "B", "C"],
	});

	test("spin should maintain initial order of symbols", () => {
		slot.spin();
		const { reels } = slot.spin();

		for (let reelIndex = 0; reelIndex < reels.length; reelIndex++) {
			let tryCount = reels[reelIndex].length;
			let currentShift = [...reels[reelIndex]];

			// Stops when either all tries have been used or if the shifted reel equals the init
			while (
				tryCount > 0 &&
				!currentShift.every(
					(value, index) => value === slot.initReels[reelIndex][index]
				)
			) {
				currentShift = shiftArray(currentShift, 1);
				tryCount -= 1;
			}

			expect(currentShift).toEqual(slot.initReels[reelIndex]);
		}
	});

	test("getWin should take into account all rules of the slot and only count consecutive symbols", () => {
		slot = new Slot({
			purse: 20,
			reels: [
				["A", "B", "A", "C"],
				["A", "B", "B", "A"],
				["A", "A", "B", "C"],
			],
			rules: [
				{
					symbol: "A",
					combinations: [
						{ coins: 20, countToWin: 2 },
						{ coins: 40, countToWin: 3 },
					],
				},
				{ symbol: "B", combinations: [{ coins: 10, countToWin: 2 }] },
				{ symbol: "C", combinations: [{ coins: 5, countToWin: 2 }] },
			],
			stake: 1,
			symbols: ["A", "B", "C"],
		});
		expect(slot.getWins()).toEqual({
			wonAmount: 60,
			winningsDescription: [
				{ rowIndex: 0, wonCoins: 40, symbol: "A" },
				{ rowIndex: 1, wonCoins: 10, symbol: "B" },
				{ rowIndex: 2, wonCoins: 10, symbol: "B" },
			],
		});
	});
});
