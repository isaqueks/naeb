const { crud } = require("../crud");

module.exports = {
    handler: async (req) => {

        const { name, age } = req.params;
        if (!name || !age || !Number(age)) {
            throw new Error('name and age (Number) missing!');
        }

        await crud.insert({
            name,
            age: Number(age)
        });

    },
    method: 'GET',
    route: '/createUser/:name/:age'
}