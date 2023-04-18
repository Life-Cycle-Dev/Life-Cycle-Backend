
const validateHeaderUser = async (ctx) => {
    const authHeader = ctx.request.header.authorization;
    if (!authHeader) {
        ctx.badRequest('Unauthorized');
        return false
    }

    const token = authHeader && authHeader.split(' ')[1];
    const user = await strapi.plugins['users-permissions'].services.jwt.verify(token);

    if (!user) {
        ctx.badRequest('Invalid token');
        return false
    }
    return user
}

const validateRequireFields = (ctx, fields) => {
    const body = ctx.request.body;
    const missingFields = fields.filter(field => !body[field]);
    if (missingFields.length > 0) {
        ctx.badRequest(`missing fields ${missingFields.join(', ')}`);
        return false;
    }
    return true;
}


module.exports = {
    validateHeaderUser,
    validateRequireFields
}