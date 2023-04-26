const {
  validateHeaderUser,
  validateRequireFields,
} = require("../../../common/request-helper");
const { parseDateTime } = require("../../../common/function");

module.exports = {
    async insertTimeCycleLine(ctx) {
        try {
            const user = await validateHeaderUser(ctx);
            const requireFields = ['sleepCycleId', 'startTime', 'endTime'];

            if(!user || !validateRequireFields(ctx, requireFields)) {
                return
            }

            const { sleepCycleId, startTime, endTime } = ctx.request.body;

            const existingSleepCycle = await strapi.entityService.findMany('api::sleep-cycle.sleep-cycle', {
                filters: { id: sleepCycleId, user: user.id },
                limit: 1
            });

            if(existingSleepCycle.length === 0) {
                ctx.status = 404
                ctx.body = `Sleep cycle not found with id=${sleepCycleId} userId=${user.id}`
                return
            }

            if(new Date(endTime).valueOf() < new Date(startTime).valueOf()) {
                ctx.status = 400
                ctx.body = `startTime must be less than endTime`
                return
            }
            
            const minTime = new Date(existingSleepCycle[0].bedTime).valueOf();

            if(new Date(startTime).valueOf() < minTime) {
                ctx.status = 400
                ctx.body = `startTime and endTime must be between bedTime and wakeUpTime`
                return
            }

            const existingSleepCycleLine = await strapi.entityService.findMany('api::sleep-cycle-line.sleep-cycle-line', {
                filters: { 
                        sleepCycle: sleepCycleId, 
                        $or: [
                            {startTime: { $gt: parseDateTime(startTime) }},
                            {startTime: startTime}
                        ],
                        $or: [
                            {endTime: { $lt: parseDateTime(endTime) }},
                            {endTime: endTime}
                        ]
                    },
                limit: 1
            });

            if(existingSleepCycleLine.length > 0) {
                ctx.status = 400
                ctx.body = `Sleep cycle line already exists with startTime=${existingSleepCycleLine[0].startTime} beetween endTime=${existingSleepCycleLine[0].endTime}`
                return
            }

            let prepareData = {
                sleepCycle: sleepCycleId,
                startTime: parseDateTime(startTime),
                endTime: parseDateTime(endTime),
                publishedAt: new Date()
            }

            await strapi.entityService.create('api::sleep-cycle-line.sleep-cycle-line', {
                data: prepareData
            });

            const afterSleepCycle = await strapi.entityService.findMany('api::sleep-cycle.sleep-cycle', {
                filters: { id: sleepCycleId, user: user.id },
                populate: { sleepCycleLines: true },
                limit: 1
            });

            ctx.status = 200
            ctx.body = afterSleepCycle[0]  
        } catch (error) {
            ctx.status = 500
            ctx.body = error.message
        }
    }
};
