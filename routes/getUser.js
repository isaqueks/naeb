const { crud } = require("../crud");

module.exports = {
    handler: async (req) => {

        const { name } = req.params;
        if (!name) {
            throw new Error('name missing!');
        }

        const user = await crud.get({ name });
        return user;

    },
    method: 'GET',
    route: '/getUser/:name'
}