'use strict';

/**
 * ct-child service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::ct-child.ct-child');
