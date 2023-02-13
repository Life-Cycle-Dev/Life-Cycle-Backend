'use strict';

/**
 * eat-cycle service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::eat-cycle.eat-cycle');
