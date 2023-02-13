'use strict';

/**
 * exercise-type service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::exercise-type.exercise-type');
