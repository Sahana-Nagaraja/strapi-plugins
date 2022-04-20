'use strict';

module.exports = {
  async index(ctx) {
    let { slug } = ctx.request.params;
    let { contentId } = ctx.request.query;
    if (!slug) {
      throw new Error("Required Slug missing");
    }
    ctx.body = await strapi
      .plugin('review')
      .service('myService')
      .getContentStatus(slug, contentId);
  },

  async createContentStatus(ctx) {
    const { user } = ctx.state;
    let { slug, kind } = ctx.request.params;
    const { authorization } = ctx.request.headers;
    const config = {
      headers: {
        authorization: authorization,
      }
    };
    ctx.body = await strapi
      .plugin('review')
      .service('myService')
      .createContentStatus(ctx.request.body, slug, kind, user, config);
  },

  async updateContentStatus(ctx) {
    const { user } = ctx.state;
    ctx.body = await strapi
      .plugin('review')
      .service('myService')
      .updateContentStatus(ctx.request.body, user);
  },
  fetchAuthenticatedUser(ctx) {
    return strapi.query('plugin::users-permissions.admin_users').findOne(
      {
        where: { id: Number(ctx.request.params.id) },
        populate: { role: true },
      });
  },
  deleteContentStatus(ctx) {
    return strapi.query('plugin::review.content-status').delete(
      {
        where: { id: Number(ctx.request.params.id) }
      });
  }
  
};
