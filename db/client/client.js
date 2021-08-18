const { ApolloClient, InMemoryCache, HttpLink, split, gql } = require('@apollo/client');
const { getMainDefinition } = require('@apollo/client/utilities');
const { SubscriptionClient } = require('subscriptions-transport-ws');
const fetch = require('cross-fetch');
const ws = require('ws');

const uri = 'http://192.168.43.61:4000/graphql';
const httpLink = new HttpLink({ uri, fetch });
const wsLink = new SubscriptionClient(
  'ws://192.168.43.61:4000/graphql', { reconnect: true }, ws);

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);
const cache = new InMemoryCache({ addTypename: false });
const client = new ApolloClient({ link, cache });

module.exports = client;