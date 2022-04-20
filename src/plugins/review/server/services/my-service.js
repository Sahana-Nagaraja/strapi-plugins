'use strict';
const axios = require('axios');
module.exports = {
  async getContentStatus(slug, contentId) {
    if (contentId) {
      return await strapi.db.query("plugin::review.content-status").findOne({
        where: { contentType: slug, contentId },
        populate: { createdBy: true },
      });
    }
    else {
      return await strapi.db.query("plugin::review.content-status").findMany({
        where: { contentType: slug },
        populate: { createdBy: true },
      });
    }
  },
  async createContentStatus(data, slug, kind, user, config) {
    const contents = data.contents;
    const contentStatus = data.contentStatus;
    let existing = await module.exports.getContentStatus(slug, contents.id);
    if(existing) {
      throw new Error("Already In progres or in review. ");
    }
    if (contentStatus.status === "Approved") {
      const response = await axios.post(`http://localhost:1337/content-manager/${kind}/${slug}/${contents.id}/actions/publish`, contents, config);
      return await module.exports.createContentTypesStatus(response, slug, contentStatus, user);
    } else {
     return await module.exports.createContentTypesStatus(contents, slug, contentStatus, user);
    }
  },
  async createContentTypesStatus(response, slug, contentStatus, user) {
    return await strapi.entityService.create("plugin::review.content-status", {
      data: {
        contentId: response.id,
        contentType: slug,
        status: contentStatus.status,
        comments: contentStatus.comments,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        createdById: user.id,
        updatedById: user.id
      }, populate: '*'
    });
  },
  async updateContentStatus(data, user) {
    data.createdBy = data.userId ? data.userId : user.id;
    data.updatedBy = user.id;
    await strapi.entityService.update("plugin::review.content-status", data.id, {
      data: { data }, populate: '*'
    });
    console.log("create Status completed .");
    return data;
  }
};


