const { Client } = require("pg");
const client = new Client(
  process.env.DATABASE_URL || "postgress://localhost/acme_planner_db"
);
const uuid = require("uuid");

async function createTables() {
  const SQL = `
        DROP TABLE IF EXISTS reservation;
        DROP TABLE IF EXISTS customer;
        DROP TABLE IF EXISTS restaurant;

        CREATE TABLE restaurant(
                id UUID PRIMARY KEY,
                name VARCHAR(100)
        );

        CREATE TABLE customer( 
                id UUID PRIMARY KEY,
                name VARCHAR(100)
        );

        CREATE TABLE reservation(
                id UUID PRIMARY KEY,
                date DATE,
                party_count INT,
                customer_id UUID REFERENCES customer(id) NOT NULL,
                restaurant_id UUID REFERENCES restaurant(id) NOT NULL
        );
        `;

  await client.query(SQL);
}

const createRestaurant = async ({ name }) => {
  const SQL = `INSERT INTO restaurant(id, name) VALUES($1, $2) RETURNING *`;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

const createReservation = async ({
  date,
  party_count,
  customer_id,
  restaurant_id,
}) => {
  const SQL = `INSERT INTO reservation(id, date, party_count, customer_id, restaurant_id) VALUES($1, $2, $3, $4, $5) RETURNING *`;
  const response = await client.query(SQL, [
    uuid.v4(),
    date,
    party_count,
    customer_id,
    restaurant_id,
  ]);
  return response.rows[0];
};
const createCustomer = async ({ name }) => {
  const SQL = `INSERT INTO customer(id, name) VALUES($1, $2) RETURNING *`;
  const response = await client.query(SQL, [uuid.v4(), name]);
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

const destroyReservationsByCustomerId = async (customer_id) => {
  const SQL = `DELETE FROM reservation WHERE customer_id = $1 RETURNING *`;
  await client.query(SQL, [customer_id]);
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
  destroyReservationsByCustomerId,
};
