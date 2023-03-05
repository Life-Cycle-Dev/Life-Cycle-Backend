'use strict';

/**
 * sleep-cycle service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::sleep-cycle.sleep-cycle');
