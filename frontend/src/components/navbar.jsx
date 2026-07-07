import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import pwcLogo from "../assets/pwc-logo.webp";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const token = localStorage.getItem("access_token");
  
  useEffect(() => {
    async function fetchProfile() {
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const response = await API.get("profile/");
        setUser(response.data);
      } catch (err) {
        console.log(err.response?.data);
        setUser(null);
      }
    }

    fetchProfile();
  }, [token]);

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    navigate("/login");
  }

  return (
    <nav className="navbar">
       <div className="brand">
      <img src={pwcLogo} alt="PwC logo" className="pwc-logo" />
      <h2>Task Tracker</h2>
      </div>

      <div className="nav-links">
        {token ? (
          <>
            {user && (
              <span>
              <strong>{user.username}</strong>
              </span>
            )}

            <Link to="/">Dashboard</Link>

            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;