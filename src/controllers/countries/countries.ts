import axios from "axios";

class CountriesController {
	defaultMethod() {
		return {
			text: `You've reached the ${this.constructor.name} default method`,
		};
	}

	async getUnique(searchString: string) {
		const result = await axios.get(
			`https://restcountries.com/v3.1/name/${searchString}?fullText=true`
		);
		return result.data;
	}

	async search(searchString: string): Promise<any[]> {
		try {
			const result = await axios.get<any[]>(
				`https://restcountries.com/v3.1/name/${searchString}`
			);

			const data: any[] = result.data;
			return data.map((country) => ({
				name: country.name.common,
				flag: country.flags.png,
			}));
		} catch (e) {
			return e;
		}
	}
}

export = new CountriesController();
