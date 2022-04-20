'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi
      .plugin('search')
      .service('myService')
      .getWelcomeMessage();
  },
};
