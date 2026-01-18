import { randomUUID } from "node:crypto";
import { Database } from "./database/db.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const db = new Database();

export const routes = [
	{
		method: "POST",
		path: buildRoutePath("/tasks"),
		handler: (req, res) => {
			const { title, description } = req.body;

			const hasTitle = typeof title === "string" && title.trim() !== "";
			const hasDescription =
				typeof description === "string" && description.trim() !== "";

			if (!hasTitle || !hasDescription) {
				return res
					.writeHead(400, { "Content-Type": "application/json" })
					.end(JSON.stringify({ error: "Informe title e/ou description." }));
			}
			const now = new Date();

			const task = {
				id: randomUUID(),
				title,
				description,
				created_at: now,
				updated_at: now,
				completed_at: null,
			};

			db.insert("tasks", task);
			return res.writeHead(201).end();
		},
	},
	{
		method: "GET",
		path: buildRoutePath("/tasks"),
		handler: (req, res) => {
			const { search } = req.query;
			const tasks = db.select(
				"tasks",
				search
					? {
							title: search,
							description: search,
						}
					: null,
			);

			if (!tasks.length) {
				return res
					.writeHead(400, { "Content-Type": "application/json" })
					.end(JSON.stringify({ error: "Sem nenhuma atividade cadastrada." }));
			}

			return res
				.writeHead(200, { "Content-Type": "application/json" })
				.end(JSON.stringify(tasks));
		},
	},
	{
		method: "PUT",
		path: buildRoutePath("/tasks/:id"),
		handler: async (req, res) => {
			const { id } = req.params;
			const { title, description } = req.body;

			const hasTitle = typeof title === "string" && title.trim() !== "";
			const hasDescription =
				typeof description === "string" && description.trim() !== "";

			if (!hasTitle || !hasDescription) {
				return res
					.writeHead(400, { "Content-Type": "application/json" })
					.end(JSON.stringify({ error: "Informe title e/ou description." }));
			}

			const updateData = await db.update("tasks", id, {
				title,
				description,
				updated_at: new Date(),
			});

			if (!updateData) {
				return res
					.writeHead(404, { "Content-Type": "application/json" })
					.end(JSON.stringify({ error: "Taks não existe" }));
			}

			return res.writeHead(204).end();
		},
	},
	{
		method: "DELETE",
		path: buildRoutePath("/tasks/:id"),
		handler: (req, res) => {
			const { id } = req.params;

			const hasId = typeof id === "string" && id.trim() !== "";

			if (!hasId) {
				return res
					.writeHead(400, { "Content-Type": "application/json" })
					.end(JSON.stringify({ error: "Informe um Id válido." }));
			}

			db.delete("tasks", id);

			return res.writeHead(204).end();
		},
	},
	{
		method: "PATCH",
		path: buildRoutePath("/tasks/:id/complete"),
		handler: async (req, res) => {
			const { id } = req.params;

			const hasId = typeof id === "string" && id.trim() !== "";

			if (!hasId) {
				return res
					.writeHead(400, { "Content-Type": "application/json" })
					.end(JSON.stringify({ error: "Informe um id válido." }));
			}

			const updateData = await db.update("tasks", id, {
				updated_at: new Date(),
				completed_at: new Date(),
			});

			if (!updateData) {
				return res
					.writeHead(404, { "Content-Type": "application/json" })
					.end(JSON.stringify({ error: "Taks não existe" }));
			}

			return res.writeHead(204).end();
		},
	},
];
