const router = require("express").Router();
const notAllowed = require("../errors/methodNotAllowed");
const controller = require("./orders.controller")

//at /dishes route get requests call list function imported from controller
//post requests call create function imported from controller
//all other requests call methodNotAllowed function imported from methodNotAllowed
router.route("/").get(controller.list).post(controller.create).all(notAllowed);

//at /dishes/:orderId route get requests call read function imported from controller
//delete requests call delete function imported from controller
//put requests call update function imported from controller
//all other requests call methodNotAllowed function imported from methodNotAllowed
router.route("/:orderId")
    .get(controller.read)
    .delete(controller.delete)
    .put(controller.update)
    .all(notAllowed)

module.exports = router;
