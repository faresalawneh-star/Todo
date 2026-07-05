import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      await API.post("register/", formData);

      setSuccess("User registered successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.log(err.response?.data);

      if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Something went wrong.");
      }
    }
  }

  return (
    <div>
      <h1>Register</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <br />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Confirm Password</label>
          <br />
          <input
            type="password"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;