import { ApolloClient, InMemoryCache } from '@apollo/client';
import { LENS_API_URL } from 'utils';
import { setContext } from '@apollo/client/link/context';
// const API_URL = "https://api.lens.dev";

const authLink = setContext((_, { headers }) => {
  const token = window.localStorage.getItem('your-storage-key');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});
/* create the API client */
const client = new ApolloClient({
  uri: LENS_API_URL,
  cache: new InMemoryCache()
});

export default client;
