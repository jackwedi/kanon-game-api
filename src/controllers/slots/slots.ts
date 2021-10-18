import Slot, { IWinningDescription } from "../../components/slot";
const slotConfig = require("./question3SlotConfig");

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
