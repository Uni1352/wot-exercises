const { ApolloClient, InMemoryCache, HttpLink } = require('@apollo/client/core');
const fetch = require('cross-fetch');

const uri = 'http://192.168.43.61:4000';
const cache = new InMemoryCache();

const client = new ApolloClient({
  link: new HttpLink({ uri: uri, fetch }),
  cache: cache
});

module.exports = client;