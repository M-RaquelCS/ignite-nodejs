import http from "node:http";

// GET /users => Buscando usuários no banc-end
// POST /users => Criar um usuário no back-end

// Stateful - Stateless

// Cabeçalhos (Requisição/resposta) => Metadados

// HTTP Status Code

const users = [];

const server = http.createServer((req, res) => {
	const { method, url } = req;

	const buffers = []

	for await (const chunk of req) {
		buffers.push(chunk)
	}

	try {
		req.body = JSON.parse(Buffer.concat(buffers).toString())
	} catch {
		req.body = null
	}

	if (method === "GET" && url === "/users") {
		return res
			.setHeader("Content-type", "application/json")
			.end(JSON.stringify(users));
	}

	if (method === "POST" && url === "/users") {
		const { name, email } = req.body
		users.push({
			id: 1,
			name,
			email
		});

		return res.writeHead(201).end();
	}

	return res.writeHead(404).end();
});

server.listen(3333);
