<h1>GrubDash RESTful API</h1>

RESTful API written in express to allow userrs to create, read, update, and delete data for multiple resources. Defined the routes, URL's, and middleware necessary to implement the API.

Frontend to show implementation of this API can be found [here](https://github.com/Thinkful-Ed/starter-grub-dash-front-end)

<h2>Installation Instructions</h2>

---

To install this repository:
1. Either clone the code or fork and clone the code by clicking the `Code` or `Fork` buttons at the top of the page
2. cd into the new repository
3. run `npm install`
4. run `npm start`

`npm start` will open a locally hosted webpage letting you access the flash card application and all of its functionality



<h2>Description</h2>

---

<h3> Dishes </h3>

In the `src/dishes/dishes.controller.js` file, you can find handlers and middleware functions to create, read, update, and list dishes. Note that dishes cannot be deleted.

In the `src/dishes/dishes.router.js` file, you can find the routes and attached handlers for `/dishes`, and `/dishes/:dishId` exported from the controller.

Requests for `/GET` at `/dishes` will respond with a list off all existing dish data

Requests for /POST at `/dishes` will save and respond with a newly created dish.

Requests for /GET at `/dishes/:dishId` will respond with the dish where `id === :dishId` or return `404` if no matching dish is found.

Requests for /PUT at `/dishes/:dishId` will update the dish where `id === :dishId` or return `404` if no matching dish is found.

---

<h3> Orders </h3>

In the `src/orders/orders.controller.js` file, you can find handlers and middleware functions to create, read, update, delete, and list orders.

In the `src/dishes/dishes.router.js` file, you can find the routes and attached handlers for `/orders`, and `/orders/:orderId` exported from the controller.

Requests for `/GET` at `/orders` will respond with a list off all existing order data

Requests for /POST at `/orders` will save and respond with a newly created order.

Requests for /GET at `/orders/:orderId` will respond with the order where `id === :orderId` or return `404` if no matching dish is found.

Requests for /PUT at `/orders/:orderId` will update the dish where `id === :orderId` or return `404` if no matching dish is found.

Requests for /DELETE at `/orders/:orderId` will delete the order and return a 204 where `id === :orderId`, or return `404` if no matching order is found.