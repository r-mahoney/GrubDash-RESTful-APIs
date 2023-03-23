const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");


//dishes middlewarre has all the same functionality as orders with the exception of validate price
function list(req, res, next) {
    res.send({ data: dishes })
}

function bodyDataHas(propertyName) {
    return function (req, res, next) {
        const { data = {} } = req.body;
        if (data[propertyName]) {
            return next()
        } else {
            next({
                status: 400,
                message: `Must include a ${propertyName}.`
            })
        }
    }
}

function validatePrice(req, res, next) {
    const { data: { price } = {} } = req.body;
    //checks that the supplied price is both > 0 and an integer. If it isnt, go into error handling
    if(price < 1 || !Number.isInteger(price)) {
        next({
            status: 400,
            message: "Dish must have a price that is an integer greater than 0."
        })
    }
    next()
}

function create(req, res, next) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
        id: nextId(),
        name,
        description,
        price,
        image_url
    }
    dishes.push(newDish);
    res.status(201).json({ data: newDish })
}

function dishExists(req, res, next) {
    const { dishId } = req.params;
    const dishIndex = dishes.findIndex(dish => dish.id === (dishId));

    if (dishIndex > -1) {
        res.locals.dish = dishes[dishIndex];
        res.locals.index = dishIndex;
        next();
    } else {
        next({
            status: 404,
            message: `Not found: Dish ID ${dishId}`
        })
    }
}

function idMatches(req, res, next) {
    if(bodyDataHas("id")){
        const {data: {id}} = req.body;
        if(id && id !== req.params.dishId) {
            next({
                status: 400,
                message: `Dish id does not match route id. Dish: ${id}, Route: ${req.params.dishId}`
            })
        }
    }
    next();
}

function update(req, res, next) {
    const dish = res.locals.dish;
    const index = res.locals.index;
    const { data: { name, description, price, image_url } = {} } = req.body;

    const updatedDish = {
        ...dish,
        name, description, price, image_url
    }

    dishes.splice(index, 1, updatedDish);
    res.json({data : updatedDish});
}

function read(req, res, next) {
    const dish = res.locals.dish;

    res.json({ data: dish })
}

module.exports = {
    list,
    create: [
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        validatePrice,
        create
    ],
    read: [
        dishExists,
        read
    ],
    update: [
        dishExists,
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        idMatches,
        validatePrice,
        update
    ]
}