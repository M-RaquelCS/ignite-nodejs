import fs from "node:fs/promises";

const databasePath = new URL("./db.json", import.meta.url);

export class Database {
	#database = {};

	constructor() {
		fs.readFile(databasePath, "utf8")
			.then((data) => {
				this.#database = JSON.parse(data);
			})
			.catch(async () => {
				await this.#persist();
			});
	}

	async #persist() {
		await fs.writeFile(databasePath, JSON.stringify(this.#database));
	}

	// POST
	async insert(table, data) {
		if (Array.isArray(this.#database[table])) {
			this.#database[table].push(data);
		} else {
			this.#database[table] = [data];
		}

		await this.#persist();
		return data;
	}

	// GET and GET with params
	select(table, search) {
		let data = this.#database[table] ?? [];

		if (search) {
			data = data.filter((row) => {
				return Object.entries(search).some(([key, value]) => {
					return row[key].toLowerCase().includes(value.toLowerCase());
				});
			});
		}

		return data;
	}

	// PUT and PATCH
	update(table, id, data) {
		const collection = this.#database[table] ?? [];
		const rowIndex = collection.findIndex((row) => row.id === id);

		if (rowIndex > -1) {
			this.#database[table][rowIndex] = {
				...collection[rowIndex],
				...data,
				id,
			};
			this.#persist();
			return this.#database[table][rowIndex];
		}

		return; // caso não encontre o registro
	}

	// DELETE
	delete(table, id) {
		const rowIndex = this.#database[table].findIndex((row) => row.id === id);

		if (rowIndex > -1) {
			this.#database[table].splice(rowIndex, 1);
			this.#persist();
		}

		return;
	}
}
