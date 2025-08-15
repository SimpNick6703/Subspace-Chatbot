import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { nhost } from '../lib/nhost';

// HTTP link for queries and mutations
const httpLink = createHttpLink({
  uri: 'https://grmalwkuarajksiwwncj.hasura.ap-south-1.nhost.run/v1/graphql',
});

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: 'wss://grmalwkuarajksiwwncj.hasura.ap-south-1.nhost.run/v1/graphql',
    connectionParams: () => {
      const accessToken = nhost.auth.getAccessToken();
      return {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      };
    },
  })
);

// Auth link to add authorization header
const authLink = setContext((_, { headers }) => {
  const accessToken = nhost.auth.getAccessToken();
  console.log('Apollo auth link - Access token:', accessToken ? 'Present' : 'Missing');
  return {
    headers: {
      ...headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
});

// Split link to route queries/mutations to HTTP and subscriptions to WebSocket
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

// Apollo Client instance
export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      messages: {
        keyFields: ['id'],
      },
      chats: {
        keyFields: ['id'],
        fields: {
          messages: {
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
