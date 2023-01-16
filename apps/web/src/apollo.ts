import { ApolloClient, InMemoryCache, from, HttpLink } from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import { LENS_API_URL } from 'utils';
import { setContext } from '@apollo/client/link/context';
// const API_URL = "https://api.lens.dev";

const httpLink = new HttpLink({
  uri: LENS_API_URL,
  fetchOptions: 'no-cors',
  fetch
});

const authLink = setContext((_, { headers }) => {
  const token = window.localStorage.getItem('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

// RetryLink is a link that retries requests based on the status code returned.
const retryLink = new RetryLink({
  delay: {
    initial: 100
  },
  attempts: {
    max: 2,
    retryIf: (error) => Boolean(error)
  }
});

/* create the API client */
const client = new ApolloClient({
  link: from([authLink, retryLink, httpLink]),
  cache: new InMemoryCache()
});

export default client;
