const { default: axios } = require("axios");
const cors = require("cors");
const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());

let orders = [];

app.get("/list/hospitals", async (req, res) => {
  const { q } = req.query;

  const { data } = await axios.get(
    `https://dekontaminasi.com/api/id/covid19/hospitals`
  );

  let result = data;

  if (q && q !== "") {
    result = data.filter((hospital) => {
      return hospital?.name?.toLowerCase()?.includes(q?.toLowerCase());
    });
  }

  res.json(result);
});

app.post("/order", async function (req, res) {
  const { name, phone, email, hospital_id } = req.body;

  orders = [
    ...orders,
    {
      id: orders.length + 1,
      name,
      phone,
      email,
      hospital_id,
    },
  ];

  res.json(orders);
});

app.get("/order/list", async function (req, res) {
  res.json(orders);
});

app.listen(4000, () => {
  console.log("listening on port 4000");
});
