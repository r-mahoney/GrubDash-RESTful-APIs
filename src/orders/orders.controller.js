const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

function list(req, res, next) {
    //respond will all orders data
    res.json({ data: orders })
}

function bodyDataHas(propertyName) {
    //create a function that takes in a property name and then returns a middleware function that checks if the
    //request body has that property and if, goes into error handling
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

function idMatches(req, res, next) {
    //uses bodyDataHas function to check if "id" was included in request
    //if it is then it much match orderId parameter exactly
    if (bodyDataHas("id")) {
        const { data: { id } } = req.body;
        if (id && id !== req.params.orderId) {
            next({
                status: 400,
                message: `Order id does not match route id. Order: ${id}, Route: ${req.params.orderId}`
            })
        }
    }
    next();
}

function validateDishArray(req, res, next) {
    const { data: { dishes } = {} } = req.body;

    //cjeck if dishes is an arrray. if not, go to error handling
    if (!Array.isArray(dishes) || !dishes.length) {
        next({
            status: 400,
            message: "Order must include at least one dish"
        })
    } else {
        //if dishes is an array, check that dishes has a quantity, that quantity is > 0
        //and the quantity is an integer
        const correctQuantity = dishes.every(({ quantity }) => (
            quantity && quantity > 0 && Number.isInteger(quantity)
        ));
        if (!correctQuantity) {
            //if the .every method ffails, ffind the index in the dishes array where it failed
            //pass the index into error handling
            const index = dishes.findIndex(({ quantity }) => (
                !quantity || quantity < 1 || !Number.isInteger(quantity)
            ))
            next({
                status: 400,
                message: `Dish ${index} must have a quantity that is an integer greater than 0`
            })
        }
    }
    next();
}

function create(req, res, next) {
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
    const newOrder = {
        //create a new order with the data passed into the request
        //create an id with the supplied nextId method
        id: nextId(),
        deliverTo, mobileNumber, status, dishes
    }
    orders.push(newOrder);
    res.status(201).json({ data: newOrder })
}

function orderExists(req, res, next) {
    const { orderId } = req.params;
    const orderIndex = orders.findIndex(order => order.id === orderId)

    if (orderIndex > -1) {
        //if therrre is an index in orders with the above logic,
        //pass index and order into res.locals to store as local variables to use later
        res.locals.index = orderIndex;
        res.locals.order = orders[orderIndex];
        next();
    } else {
        next({
            status: 404,
            message: `Not found: Order ID ${orderId}`
        })
    }
}

function read(req, res, next) {
    const order = res.locals.order;
    //pull order from locally storred variables and respond with that single order

    res.json({ data: order })
}

function update(req, res, next) {
    const order = res.locals.order;
    const index = res.locals.index
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;

    const updatedOrder = {
        //spread contents of order and only update the data from the request body, since we dont pass id
        //even if it is included, it cant be updated in the request
        ...order,
        deliverTo, mobileNumber, status, dishes
    }
    orders.splice(index, 1, updatedOrder);
    //remove the old order from the array and replace it with the updated order
    res.json({ data: updatedOrder })
}

function orderPending(req, res, next) {
    const { index } = res.locals

    if (orders[index].status !== "pending") {
        //check if order is pending to use as middleware in other crudl methods
        next({
            status: 400,
            message: "An order cannot be deleted unless it is pending."
        })
    }
    next()
}

function invalidStatus(req, res, next) {
    const { data: { status } = {} } = req.body;

    if (status === "invalid") {
        //check if status is invalid to use as middleware in other crudl methods
        next({
            status: 400,
            message: "Can not update an oprderr with an invalid status"
        })
    }
    next()
}

function destroy(req, res, next) {
    const index = res.locals.index;
    orders.splice(index, 1);
    //removes order at locally stored index from orders array
    res.sendStatus(204)
}

module.exports = {
    list,
    create: [
        //export create functionality with included middleware to validate data before we create an order
        bodyDataHas("deliverTo"),
        bodyDataHas("mobileNumber"),
        bodyDataHas("dishes"),
        validateDishArray,
        create
    ],
    read: [
        orderExists,
        read
    ],
    update: [
        //export create functionality with included middleware to validate data before we update an order
        orderExists,
        bodyDataHas("deliverTo"),
        bodyDataHas("mobileNumber"),
        bodyDataHas("dishes"),
        bodyDataHas("status"),
        invalidStatus,
        validateDishArray,
        idMatches,
        update
    ],
    delete: [
        orderExists,
        orderPending,
        destroy
    ]
}