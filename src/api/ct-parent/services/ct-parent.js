'use strict';

/**
 * ct-parent service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::ct-parent.ct-parent');
