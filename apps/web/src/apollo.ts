import { ApolloClient, InMemoryCache } from '@apollo/client';
import { LENS_API_URL } from 'utils';
// const API_URL = "https://api.lens.dev";

/* create the API client */
const client = new ApolloClient({
  uri: LENS_API_URL,
  cache: new InMemoryCache()
});

export default client;
