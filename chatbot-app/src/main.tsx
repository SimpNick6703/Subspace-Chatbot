import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { NhostProvider } from '@nhost/react';
import { nhost } from './lib/nhost';
import { apolloClient } from './graphql/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NhostProvider nhost={nhost}>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </NhostProvider>
  </React.StrictMode>,
);
