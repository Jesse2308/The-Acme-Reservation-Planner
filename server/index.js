const express = require("express");
const app = express();
app.use(express.json());
const { client, createTables, createRestaurant, createReservation, createCustomer, fetchRestaurants, fetchReservations, fetchCustomers, destroyCustomers } = require("./db");



async function init() {
  await client.connect();
  console.log("Connected to database!");
  await createTables();
  console.log("Tables created!");
  const [McDonalds, Burger_King, Wendys, reservation1, reservation2, reservation3] = await Promise.all([
    createRestaurant({ name: "McDonalds" }),
    createRestaurant({ name: "Burger King" }),
    createRestaurant({ name: "Wendys" }),
    createReservation({ name: "12:00" }),
    createReservation({ name: "12:30" }),
    createReservation({ name: "1:00" }),
  ]);
  console.log(await fetchRestaurants());
  console.log(await fetchReservations());

  const [customer1, customer2, customer3] = await Promise.all([
    createCustomer({
      restaurant_id: McDonalds.id,
      reservation_id: reservation1.id,
      arrival_date: "2021-07-01",
    }),
    createCustomer({
      restaurant_id: Burger_King.id,
      reservation_id: reservation2.id,
      arrival_date: "2021-07-01",
    }),
    createCustomer({
      restaurant_id: Wendys.id,
      reservation_id: reservation3.id,
      arrival_date: "2021-07-01",
    }),
  ]);
  await destroyCustomers(customer1.id);
  console.log(await fetchCustomers());
  app.listen(3000, () => {
    console.log("Server is listening on port 3000");
  });
}
init();