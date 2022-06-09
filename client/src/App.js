import { useEffect, useState } from "react";

function App() {
  const [hospitals, setHospitals] = useState([]);
  const [textSearch, setTextSearch] = useState("");

  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [hospitalId, setHospitalId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch(`http://localhost:4000/list/hospitals`)
      .then((res) => res.json())
      .then((data) => setHospitals(data));

    fetch(`http://localhost:4000/order/list`)
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  const handleSearch = (value) => {
    fetch(`http://localhost:4000/list/hospitals?q=${value}`)
      .then((res) => res.json())
      .then((data) => setHospitals(data));

    setTextSearch(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:4000/list/hospitals?q=${textSearch}`)
      .then((res) => res.json())
      .then((data) => setHospitals(data));
  };

  const handleShowModal = (id) => {
    if (!hospitalId) {
      setHospitalId(id);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (hospitalId) {
      setHospitalId("");
    }
    setShowModal(false);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    try {
      await fetch(`http://localhost:4000/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hospital_id: hospitalId,
          name,
          phone,
          email,
        }),
      })
        .then((res) => res.json())
        .then((data) => setOrders(data));

      setHospitalId("");
      setShowModal(false);
    } catch (e) {
      console.log(e.response);
    }
  };

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
        }}
      >
        {/* Hospital */}
        <div
          style={{
            width: "50%",
          }}
        >
          <h1>Hospital</h1>
          <div>
            <input
              type="search"
              onChange={({ target }) => handleSearch(target.value)}
              placeholder="Search Hospital"
            />
            <button onClick={handleSubmit}>Search</button>
          </div>
          <br />
          <div>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Hospital Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {hospitals.map((hospital, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{hospital.name}</td>
                    <td>
                      <button onClick={() => handleShowModal(index + 1)}>
                        Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* ORDER */}
        <div
          style={{
            width: "50%",
          }}
        >
          <h1>Orders</h1>
          <div>
            <table style={{ width: "100%", textAlign: "center" }}>
              <thead>
                <tr>
                  <th>id</th>
                  <th>hospital_id</th>
                  <th>name</th>
                  <th>phone</th>
                  <th>email</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => {
                  return (
                    <tr key={index}>
                      <td>{order.id}</td>
                      <td>{order.hospital_id}</td>
                      <td>{order.name}</td>
                      <td>{order.phone}</td>
                      <td>{order.email}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            bottom: 50,
            right: 50,
            top: 50,
            zIndex: 100,
            left: 50,
            width: "300px",
            margin: "auto",
            height: "250px",
            background: "white",
            borderRadius: "10px",
            border: "1px solid black",
          }}
        >
          <form
            style={{
              paddingTop: "50px",
              paddingLeft: "50px",
              paddingRight: "50px",
            }}
            onSubmit={handleSubmitOrder}
          >
            <div style={{ marginBottom: "20px" }}>
              <label>Name</label>
              <input
                type="text"
                onChange={({ target }) => setName(target.value)}
                name="name"
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label>Phone</label>
              <input
                type="text"
                onChange={({ target }) => setPhone(target.value)}
                name="phone"
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label>Email</label>
              <input
                type="email"
                onChange={({ target }) => setEmail(target.value)}
                name="email"
              />
            </div>
            <button
              type="submit"
              style={{ width: "100%", marginBottom: "20px" }}
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              style={{ width: "100%" }}
            >
              Close
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
