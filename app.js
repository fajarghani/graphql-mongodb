const {
	GraphQLServer
} = require("graphql-yoga");

const resolvers = require('./graphql/resolver');

const server = new GraphQLServer({
	typeDefs: "./graphql/schema.graphql",
	resolvers,
	context: request => {
		return {
			...request
		};
	}
});

server.start(() => console.log(`Server is running on http://localhost:4000`));