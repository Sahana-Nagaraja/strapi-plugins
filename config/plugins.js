const path = require('path');

module.exports = ({ env }) => ({
  'review': {
    enabled: true,
    resolve: './src/plugins/review'
  },
  'search': {
    enabled: true,
    resolve: './src/plugins/search'
  },
  "meilisearch": {
    config: {
      host: "http://localhost:7700",
      apiKey: "stMiliesearch",
    }
  },
  'graphql': {
    enabled: true,
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 7,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
      },
    },
  },

  "comments": {
    enabled: true,
    config: {
      badWords: false,
      moderatorRoles: ["Authenticated"],
      approvalFlow: ['api::page.page'],
      enabledCollections: ["api::page.page"],
      entryLabel: {
        '*': ['Title', 'title', 'Name', 'name', 'Subject', 'subject'],
        'api::page.page': ['MyField'],
      },
      reportReasons: {
        'MY_CUSTOM_REASON': 'MY_CUSTOM_REASON',
      },
      gql: {
        // ...
      },
    },
  },
});