const { Client } = require("pg");
const client = new Client(
  process.env.DATABASE_URL || "postgress://localhost/acme_planner_db"
);
const uuid = require("uuid");

async function createTables() {
  const SQL = `
        DROP TABLE IF EXISTS customer;
        DROP TABLE IF EXISTS restaurant;
        DROP TABLE IF EXISTS reservation;

        CREATE TABLE restaurant(
                id UUID PRIMARY KEY,
                name VARCHAR(100)
        );

        CREATE TABLE reservation(
                id UUID PRIMARY KEY,
                name VARCHAR(100)
        );

        CREATE TABLE customer( 
                id UUID PRIMARY KEY,
                restaurant_id UUID REFERENCES restaurant(id)NOT NULL,
                reservation_id UUID REFERENCES reservation(id)NOT NULL,
                arrival_date DATE
        );
        `;

  await client.query(SQL);
}

const createRestaurant = async ({ name }) => {
  const SQL = `INSERT INTO restaurant(id, name) VALUES($1, $2) RETURNING *`;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

const createReservation = async ({ name }) => {
  const SQL = `INSERT INTO reservation(id, name) VALUES($1, $2) RETURNING *`;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};
const createCustomer = async ({
  restaurant_id,
  reservation_id,
  arrival_date,
}) => {
  const SQL = `INSERT INTO customer(id, restaurant_id, reservation_id, arrival_date) VALUES($1, $2, $3, $4) RETURNING *`;
  const response = await client.query(SQL, [
    uuid.v4(),
    restaurant_id,
    reservation_id,
    arrival_date,
  ]);
  return response.rows[0];
};

const fetchRestaurants = async () => {
  const SQL = `SELECT * FROM restaurant`;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchReservations = async () => {
  const SQL = `SELECT * FROM reservation`;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchCustomers = async () => {
  const SQL = `SELECT * FROM customer`;
  const response = await client.query(SQL);
  return response.rows;
};

const destroyCustomers = async (id) => {
  const SQL = `DELETE FROM customer WHERE id = $1 RETURNING *`;

  await client.query(SQL, [id]);
};

module.exports = {
  client,
  createTables,
  createRestaurant,
  createReservation,
  createCustomer,
  fetchRestaurants,
  fetchReservations,
  fetchCustomers,
  destroyCustomers,
};
