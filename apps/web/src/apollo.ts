import {
  ApolloClient,
  InMemoryCache,
  from,
  HttpLink,
  ApolloLink,
  fromPromise,
  toPromise
} from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import { LENS_API_URL } from 'utils';
import axios from 'axios';
import { LS_KEYS } from 'utils';
import parseJwt from '@lib/parseJwt';
import result from 'lens';
import { publicationKeyFields } from '@lib/keyFields';
import { cursorBasedPagination } from '@lib/cursorBasedPagination';
// const API_URL = "https://api.lens.dev";

const REFRESH_AUTHENTICATION_MUTATION = `
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      accessToken
      refreshToken
    }
  }
`;

const httpLink = new HttpLink({
  uri: LENS_API_URL,
  fetchOptions: 'no-cors',
  fetch
});

const clearStorage = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem(LS_KEYS.LENSFOILIO_STORE);
  localStorage.removeItem(LS_KEYS.TRANSACTION_STORE);
  localStorage.removeItem(LS_KEYS.MESSAGE_STORE);
};

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken || accessToken === 'undefined') {
    clearStorage();
    return forward(operation);
  }

  const expiringSoon = Date.now() >= parseJwt(accessToken)?.exp * 1000;

  if (!expiringSoon) {
    operation.setContext({
      headers: {
        'x-access-token': accessToken ? `Bearer ${accessToken}` : ''
      }
    });

    return forward(operation);
  }

  return fromPromise(
    axios(LENS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        operationName: 'Refresh',
        query: REFRESH_AUTHENTICATION_MUTATION,
        variables: {
          request: { refreshToken: localStorage.getItem('refreshToken') }
        }
      })
    })
      .then(({ data }) => {
        const accessToken = data?.data?.refresh?.accessToken;
        const refreshToken = data?.data?.refresh?.refreshToken;
        operation.setContext({
          headers: {
            'x-access-token': `Bearer ${accessToken}`
          }
        });

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        return toPromise(forward(operation));
      })
      .catch(() => {
        return toPromise(forward(operation));
      })
  );
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

const cache = new InMemoryCache({
  possibleTypes: result.possibleTypes,
  typePolicies: {
    Post: { keyFields: publicationKeyFields },
    Comment: { keyFields: publicationKeyFields },
    Mirror: { keyFields: publicationKeyFields },
    Query: {
      fields: {
        timeline: cursorBasedPagination(['request', ['profileId']]),
        feed: cursorBasedPagination(['request', ['profileId', 'feedEventItemTypes']]),
        feedHighlights: cursorBasedPagination(['request', ['profileId']]),
        explorePublications: cursorBasedPagination(['request', ['sortCriteria', 'metadata']]),
        publications: cursorBasedPagination([
          'request',
          ['profileId', 'collectedBy', 'commentsOf', 'publicationTypes', 'metadata']
        ]),
        nfts: cursorBasedPagination(['request', ['ownerAddress', 'chainIds']]),
        notifications: cursorBasedPagination(['request', ['profileId', 'notificationTypes']]),
        followers: cursorBasedPagination(['request', ['profileId']]),
        following: cursorBasedPagination(['request', ['address']]),
        search: cursorBasedPagination(['request', ['query', 'type']]),
        profiles: cursorBasedPagination([
          'request',
          ['profileIds', 'ownedBy', 'handles', 'whoMirroredPublicationId']
        ]),
        whoCollectedPublication: cursorBasedPagination(['request', ['publicationId']]),
        whoReactedPublication: cursorBasedPagination(['request', ['publicationId']]),
        mutualFollowersProfiles: cursorBasedPagination([
          'request',
          ['viewingProfileId', 'yourProfileId', 'limit']
        ])
      }
    }
  }
});

/* create the API client */
const client = new ApolloClient({
  link: from([authLink, retryLink, httpLink]),
  // cache: new InMemoryCache()
  cache
});

export default client;
