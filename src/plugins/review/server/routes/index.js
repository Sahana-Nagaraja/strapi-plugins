module.exports = [
  {
    method: 'GET',
    path: '/content-status/:slug',
    handler: 'myController.index',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/content-status/:kind/:slug',
    handler: 'myController.createContentStatus',
    config: {
      policies: [],
    },
  },
  {
    method: 'DELETE',
    path: '/content-status/:id',
    handler: 'myController.deleteContentStatus',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/content-status',
    handler: 'myController.index',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/user-role/:id',
    handler: 'myController.fetchAuthenticatedUser',
    config: {
      policies: [],
    },
  },
];
