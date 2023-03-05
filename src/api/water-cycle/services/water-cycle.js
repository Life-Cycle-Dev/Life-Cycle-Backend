'use strict';

/**
 * water-cycle service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::water-cycle.water-cycle');
