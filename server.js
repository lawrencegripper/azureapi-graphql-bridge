const express = require('express');
const app = express();
const graphqlHTTP = require('express-graphql');
const graphQLSchema = require('swagger-to-graphql');
const voyager = require('graphql-voyager/middleware');

const proxyUrl = 'https://management.azure.com';
const pathToSwaggerSchema = './containerService.json';
const customHeaders = {
  // Authorization: 'Basic YWRkOmJhc2ljQXV0aA=='
}

graphQLSchema(pathToSwaggerSchema, proxyUrl, customHeaders).then(schema => {
  app.use('/graphql', graphqlHTTP(() => {
    return {
      schema,
      graphiql: true
    };
  }));

  app.use("/voyager", voyager.express({ endpointUrl: '/graphql' }));

  app.listen(3009, 'localhost', () => {
    console.info('http://localhost:3009/graphql');
  });
}).catch(e => {
  console.log(e);
})