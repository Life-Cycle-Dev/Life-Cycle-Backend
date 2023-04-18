const { validateHeaderUser, 
        validateRequireFields } = require("../../../common/request-helper");
const { getPreviousDate,
        parseDateTime } = require("../../../common/function");

module.exports = {

    insertTimeSleep: async (ctx) => {
        try {
            const user = await validateHeaderUser(ctx);
            const requireFields = ['bedTime'];

            if(!user || !validateRequireFields(ctx, requireFields)) {
                return
            }

            const { bedTime, wakeUpTime } = ctx.request.body;
            const date = getPreviousDate(new Date(bedTime).valueOf());

            const existingSleepCycle = await strapi.entityService.findMany('api::sleep-cycle.sleep-cycle', {
                filters: { date: date, user: user.id },
                populate: { user: true },
                limit: 1
            });

            if(existingSleepCycle.length > 0) {
                ctx.status = 400
                ctx.body = `Sleep cycle already exists with date=${existingSleepCycle[0].date} and user=${existingSleepCycle[0].user.name}`
                return
            }

            let prepareData = {
                user: user.id,
                publishedAt: new Date(),
                bedTime: parseDateTime(bedTime),
                date: date
            }

            if(wakeUpTime) {
                prepareData.wakeUpTime = parseDateTime(wakeUpTime);
            }

            const entry = await strapi.entityService.create('api::sleep-cycle.sleep-cycle', {
                data: prepareData
            });

            ctx.status = 200
            ctx.body = entry
        } catch (error) {
            ctx.status = 500
            ctx.body = error.message
        }
    },

    updateTimeSleep: async (ctx) => {
        try {
            const user = await validateHeaderUser(ctx);
            const requireFields = ['id', 'wakeUpTime'];

            if(!user || !validateRequireFields(ctx, requireFields)) {
                return
            }

            const { bedTime, wakeUpTime, id } = ctx.request.body;

            const existingSleepCycle = await strapi.entityService.findOne('api::sleep-cycle.sleep-cycle', id,
                { populate: { user: true } }
            );

            if(!existingSleepCycle) {
                ctx.status = 400
                ctx.body = `Sleep cycle not found with id=${id}`
                return
            }

            if(existingSleepCycle.user.id !== user.id) {
                ctx.status = 400
                ctx.body = `Sleep cycle not found with id=${id} and user=${user.name}`
                return
            }

            let prepareData = {
                wakeUpTime: parseDateTime(wakeUpTime)
            }

            if(bedTime){
                const validate = new Date(bedTime).valueOf() < new Date(wakeUpTime).valueOf();
                if(!validate) {
                    ctx.status = 400
                    ctx.body = `Bed time must be less than wake up time`
                    return
                }
                prepareData.bedTime = parseDateTime(bedTime);
            }

            const updated = await strapi.entityService.update('api::sleep-cycle.sleep-cycle', id, {
                data: prepareData
            });

            ctx.status = 200
            ctx.body = updated
        } catch (error) {
            ctx.status = 500
            ctx.body = error.message
        }
    }


}