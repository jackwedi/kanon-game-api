import { Router } from "express";
import countriesRouter from "./countries/countriesRouter";
import slotsRouter from "./slots/slotsRouter";

class MasterRouter {
	private _router = Router();
	private _subrouterCountries = countriesRouter;
	private _subrouterSlots = slotsRouter;

	get router() {
		return this._router;
	}

	constructor() {
		this._configure();
	}

	/**
	 * Connect routes to their matching routers.
	 */
	private _configure() {
		this._router.use("/countries", this._subrouterCountries);
		this._router.use("/slots", this._subrouterSlots);
	}
}

export = new MasterRouter().router;
