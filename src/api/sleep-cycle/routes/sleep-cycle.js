'use strict';

/**
 * sleep-cycle router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::sleep-cycle.sleep-cycle');
