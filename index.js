const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const app = express();

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://cienki.auth0.com/.well-known/jwks.json`
  }),
  audience: 'https://react-demo.com',
  issuer: `https://cienki.auth0.com/`,
  algorithms: ['RS256']
});

app.use(checkJwt);

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Friends {
    name: String
  }

  type Query {
    hello: String
    friends: [Friends]
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (root, args, context) => 'Hello world!',
    friends: (root, args, context) => {
      return [
        { name: 'John' },
        { name: 'Paul' },
        { name: 'George' },
        { name: 'Ringo' }
      ];
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.applyMiddleware({ app });

app.listen({ port: 4000 });
console.log('Listening on 4000');
