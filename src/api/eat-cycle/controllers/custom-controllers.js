'use strict';
const axios = require("axios");
const uploader = require('./../../../../helper/uploader');

module.exports = {
    getFood: async (ctx) => {
        try {
            const { query } = ctx.request.query;
            const path = process.env.FOOD_ENDPOINT_API;
            const appId = process.env.FOOD_API_APP_ID;
            const appKey = process.env.FOOD_API_APP_KEY;
            const url = `${path}/api/food-database/parser?app_id=${appId}&app_key=${appKey}&ingr=${query}`
            const response = await axios.get(url);

            ctx.status = 200;
            ctx.body = {
                query: query,
                result: response.data.parsed
            };
        } catch (error) {
            ctx.status = 500
            ctx.body = error
        }
    },
    insertFood: async (ctx) => {
        try {
            const authHeader = ctx.request.header.authorization;
            if (!authHeader) {
                return ctx.badRequest('Unauthorized');
            }

            const token = authHeader && authHeader.split(' ')[1];
            const decoded = await strapi.plugins['users-permissions'].services.jwt.verify(token);

            if (!decoded) {
                return ctx.badRequest('Invalid token');
            }

            const { foodId, amount } = ctx.request.body;
            const path = process.env.FOOD_ENDPOINT_API;
            const appId = process.env.FOOD_API_APP_ID;
            const appKey = process.env.FOOD_API_APP_KEY;
            const url = `${path}/api/food-database/parser?app_id=${appId}&app_key=${appKey}&ingr=${foodId}`
            const response = await axios.get(url);

            if(!response.data.parsed) {
                return ctx.badRequest('Food not found');
            }

            const food = response.data.parsed[0];
            
            if(!food) {
                return ctx.badRequest('Food not found');
            }

            let imgId = null
            if(food.food.image) {
                const img = await uploader.uploadToLibrary(food.food.image);
                imgId = img.id;
            }

            const entry = await strapi.entityService.create('api::eat-cycle.eat-cycle', {
                data: {
                    user: decoded.id,
                    date: new Date(),
                    name: food.food.label,
                    amount: amount,
                    calorie: (food.food.nutrients.ENERC_KCAL / 100) * amount,
                    publishedAt: new Date(),
                    img: imgId
                },
            });          

            ctx.status = 200;
            ctx.body = entry;
        } catch (error) {
            console.log(error);
            ctx.status = 500
            ctx.body = error
        }
    }
};
