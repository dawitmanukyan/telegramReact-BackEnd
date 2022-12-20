const mymodel = require('../models').User;

const findall = async (req,res) => {
    try {
        let items = await mymodel.findAll();
        return res.json(items);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {findall};