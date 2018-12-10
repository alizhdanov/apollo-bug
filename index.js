const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const {
  makeExecutableSchema,
  addMockFunctionsToSchema,
  mergeSchemas,
} = require('graphql-tools');

const chirpSchema = makeExecutableSchema({
  typeDefs: `
    type Chirp {
      id: ID!
      text: String
    }

    type Query {
      chirp: Chirp
    }
  `,
});

addMockFunctionsToSchema({ schema: chirpSchema });

const schema = mergeSchemas({
  schemas: [chirpSchema],
  resolvers: {
    Chirp: {
      id: {
        fragment: `... on Chirp { id }`,
        resolve(chirp) {
          // here I should be able to do some modifications
          return chirp.id;
        },
      },
      text: {
        fragment: `... on Chirp { text }`,
        resolve(chirp) {
          // here I should be able to do some modifications
          return chirp.text;
        },
      },
    },
  },
});

const server = new ApolloServer({
  schema,
});

const app = express();
server.applyMiddleware({ app });

const port = 4000;

app.listen({ port }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
);
