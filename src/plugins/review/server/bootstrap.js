'use strict';

const { registerActions } = require('./permissions/review');
module.exports = async ({ strapi }) => {

  // Check if the plugin users-permissions is installed because the navigation needs it
  if (Object.keys(strapi.plugins).indexOf("users-permissions") === -1) {
    throw new Error(
      "In order to make the review plugin work the users-permissions plugin is required",
    );
  }
  await registerActions(strapi);
};
