import { NextFunction, query, Request, Response, Router } from "express";
import Slot from "../../components/slot";
import CountriesController from "../../controllers/countries/countries";

class CountriesRouter {
	private _router = Router();
	private _controller = CountriesController;

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
			"/",
			(req: Request, res: Response, next: NextFunction) => {
				res.status(200).json(this._controller.defaultMethod());
			}
		);

		// Question 1
		this._router.get(
			"/unique/:searchString",
			async (req: Request, res: Response, next: NextFunction) => {
				try {
					const result = await this._controller.getUnique(
						req.params.searchString
					);
					res.status(200).send(result);
				} catch (e) {
					res.status(404).send(e);
				}
			}
		);

		// Question 2
		this._router.get(
			"/search/:searchString",
			async (req: Request, res: Response, next: NextFunction) => {
				try {
					const result = await this._controller.search(
						req.params.searchString
					);
					res.status(200).send(result);
				} catch (e) {
					console.log(e);
				}
			}
		);
	}
}

export = new CountriesRouter().router;
