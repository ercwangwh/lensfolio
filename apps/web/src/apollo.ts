import { ApolloClient, InMemoryCache } from "@apollo/client";

const API_URL = "https://api.lens.dev";

/* create the API client */
const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
});

export default client;
