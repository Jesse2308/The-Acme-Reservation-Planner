const express = require("express");
const app = express();
app.use(express.json());
const {
  client,
  createTables,
  createRestaurant,
  createReservation,
  createCustomer,
  fetchRestaurants,
  fetchReservations,
  fetchCustomers,
  destroyCustomers,
  destroyReservationsByCustomerId, // add this line
} = require("./db");

async function init() {
  await client.connect();
  console.log("Connected to database!");
  await createTables();
  console.log("Tables created!");
  const [McDonalds, Burger_King, Wendys, customer1, customer2, customer3] =
    await Promise.all([
      createRestaurant({ name: "McDonalds" }),
      createRestaurant({ name: "Burger King" }),
      createRestaurant({ name: "Wendys" }),
      createCustomer({ name: "John Doe" }),
      createCustomer({ name: "Jane Doe" }),
      createCustomer({ name: "Bob Smith" }),
    ]);

  const [reservation1, reservation2, reservation3] = await Promise.all([
    createReservation({
      date: "2021-07-01",
      party_count: 4,
      customer_id: customer1.id,
      restaurant_id: McDonalds.id,
    }),
    createReservation({
      date: "2021-07-01",
      party_count: 2,
      customer_id: customer2.id,
      restaurant_id: Burger_King.id,
    }),
    createReservation({
      date: "2021-07-01",
      party_count: 6,
      customer_id: customer3.id,
      restaurant_id: Wendys.id,
    }),
  ]);

  console.log(await fetchRestaurants());
  console.log(await fetchReservations());
  console.log(await fetchCustomers());

  await destroyReservationsByCustomerId(customer1.id);
  await destroyCustomers(customer1.id);
  console.log(await fetchCustomers());
  app.listen(3000, () => {
    console.log("Server is listening on port 3000");
  });
}
init();
