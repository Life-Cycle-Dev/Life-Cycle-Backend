const { validateHeaderUser, 
        validateRequireFields } = require("../../../common/request-helper");
const { getPreviousDate,
        parseDateTime,
        parseDate } = require("../../../common/function");

module.exports = {

    insertTimeSleep: async (ctx) => {
        try {
            const user = await validateHeaderUser(ctx);
            const requireFields = ['bedTime'];

            if(!user || !validateRequireFields(ctx, requireFields)) {
                return
            }

            const { bedTime, wakeUpTime } = ctx.request.body;
            const date = getPreviousDate(bedTime);

            const existingSleepCycle = await strapi.entityService.findMany('api::sleep-cycle.sleep-cycle', {
                filters: { date: date, user: user.id },
                populate: { user: true },
                limit: 1
            });

            if(existingSleepCycle.length > 0) {
                ctx.status = 400
                ctx.body = {
                    message: `Sleep cycle already exists with date=${existingSleepCycle[0].date} and userId=${user.id}`,
                    sleepCycleId: existingSleepCycle[0].id
                }
                return
            }

            let prepareData = {
                user: user.id,
                publishedAt: new Date(),
                bedTime: parseDateTime(bedTime),
                date: date
            }

            if(wakeUpTime) {
                const validate = new Date(bedTime).valueOf() < new Date(wakeUpTime).valueOf();
                if(!validate) {
                    ctx.status = 400
                    ctx.body = `Bed time must be less than wake up time`
                    return
                }
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
            const requireFields = ['id'];

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
                ctx.body = `Sleep cycle not found with sleepCycleId=${id} and userId=${user.id}`
                return
            }

            let prepareData = {
                wakeUpTime: parseDateTime(wakeUpTime)
            }

            if(bedTime && wakeUpTime){
                const validate = new Date(bedTime).valueOf() < new Date(wakeUpTime).valueOf();
                if(!validate) {
                    ctx.status = 400
                    ctx.body = `Bed time must be less than wake up time`
                    return
                }
                prepareData.bedTime = parseDateTime(bedTime);
            } else if(wakeUpTime) {
                const validate = new Date(existingSleepCycle.bedTime).valueOf() < new Date(wakeUpTime).valueOf();
                if(!validate) {
                    ctx.status = 400
                    ctx.body = `Bed time must be less than wake up time`
                    return
                }
            } else if(bedTime) {
                prepareData.bedTime = parseDateTime(bedTime);
                prepareData.wakeUpTime = null;
            } else {
                ctx.status = 400
                ctx.body = `Bed time or wake up time must be provided`
                return
            }

            await strapi.entityService.update('api::sleep-cycle.sleep-cycle', id, {
                data: prepareData
            });

            const afterSleepCycle = await strapi.entityService.findMany('api::sleep-cycle.sleep-cycle', {
                filters: { id: id, user: user.id },
                populate: { sleepCycleLines: true },
                limit: 1
            });

            const totalSleepTime = new Date(afterSleepCycle[0].wakeUpTime).valueOf() - new Date(afterSleepCycle[0].bedTime).valueOf();

            ctx.status = 200
            ctx.body = {
                ...afterSleepCycle[0],
                totalSleepTime: totalSleepTime < 0 ? 0 : totalSleepTime
            }
        } catch (error) {
            ctx.status = 500
            ctx.body = error.message
        }
    },

    getSummary: async (ctx) => {
        try {
            const user = await validateHeaderUser(ctx);

            if(!user) {
                return
            }

            const startDate = parseDate(ctx.request.query.startDate || new Date().valueOf());
            const endDate = parseDate(ctx.request.query.endDate || new Date(startDate).valueOf() + 6 * 24 * 60 * 60 * 1000);

            let sleepCycle = await strapi.entityService.findMany('api::sleep-cycle.sleep-cycle', {
                filters: { 
                    user: user.id,
                    $and: [
                        {$or: [
                            {date: { $gt: startDate }},
                            {date: startDate},
                        ]},
                        {$or: [
                            {date: { $lt: endDate }},
                            {date: endDate},
                        ]}
                    ],
                },
                sort: { date: 'asc' },
                populate: { sleepCycleLines: true },
            });

            sleepCycle = sleepCycle.map((item) => {
                const totalSleepTime = new Date(item.wakeUpTime).valueOf() - new Date(item.bedTime).valueOf();
                return {
                    ...item,
                    totalSleepTime: totalSleepTime < 0 ? 0 : totalSleepTime
                }
            })

            ctx.status = 200
            ctx.body = sleepCycle     
        } catch (error) {
            ctx.status = 500
            ctx.body = error.message
        }
    }

}