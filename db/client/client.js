const { ApolloClient, InMemoryCache, HttpLink } = require('@apollo/client/core');
const fetch = require('cross-fetch');

const uri = 'http://192.168.43.61:4000';
const cache = new InMemoryCache();

const client = new ApolloClient({
  link: new HttpLink({ uri: uri, fetch }),
  cache: cache
});

client.mutate({
  mutation: gql(`mutation Mutation{
    addPirData(presence:${val}){
      createAt
    }
  }`)
});

client
  .query(gql(`query Query {
              pirValues {
                presence
                createAt
              }
            }`))
  .then(result => {
    console.info(JSON.stringify(result));
  });

module.exports = client;