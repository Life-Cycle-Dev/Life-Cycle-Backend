'use strict';

/**
 * system-param service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::system-param.system-param');
