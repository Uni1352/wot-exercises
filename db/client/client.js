const { ApolloClient, InMemoryCache, HttpLink } = require('@apollo/client');
const fetch = require('cross-fetch');

const uri = 'http://192.168.43.61:4000/graphql';
const link = new HttpLink({ uri, fetch });
const cache = new InMemoryCache({ addTypename: false });
const client = new ApolloClient({ link, cache });

module.exports = client;