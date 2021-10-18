import axios from "axios";
import { NextFunction, Request, Response, Router } from "express";
import Slot from "../../components/slot";
import SlotsControler from "../../controllers/slots/slots";

class SlotsRouter {
	private _router = Router();
	private _controller = SlotsControler;

	get router() {
		return this._router;
	}

	constructor() {
		this._configure();
	}

	/**
	 * Connect routes to their matching controller endpoints.
	 */
	private _configure() {
		this._router.get(
			"/init",
			(req: Request, res: Response, next: NextFunction) => {
				const { reels, purse } = this._controller.init();
				res.status(200).json({ reels, purse });
			}
		);

		// Question 3
		this._router.get(
			"/spin",
			async (req: Request, res: Response, next: NextFunction) => {
				try {
					const spinresult = await this._controller.spin();
					res.status(200).send(spinresult);
				} catch (e) {
					res.status(500).send(
						"ERROR: Did you init the slot ? (http://[server]/api/slots/init)"
					);
					console.log(e);
				}
			}
		);
	}
}

export = new SlotsRouter().router;
