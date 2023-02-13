'use strict';

/**
 * exercise-cycle service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::exercise-cycle.exercise-cycle');
