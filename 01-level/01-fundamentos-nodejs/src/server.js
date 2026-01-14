import http from "node:http";

// GET /users => Buscando usuários no banc-end
// POST /users => Criar um usuário no back-end

// Stateful - Stateless

// Cabeçalhos (Requisição/resposta) => Metadados

const users = [];

const server = http.createServer((req, res) => {
	const { method, url } = req;

	if (method === "GET" && url === "/users") {
		return res
			.setHeader("Content-type", "application/json")
			.end(JSON.stringify(users));
	}

	if (method === "POST" && url === "/users") {
		users.push({
			id: 1,
			name: "John Doe",
			email: "johndoe@example.com",
		});

		return res.end("Criação de usuário");
	}

	return res.end("Hello World");
});

server.listen(3333);
