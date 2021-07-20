import React from "react";
import "./Login.css";
import logo from "../to-do-list.png";

const Login = ({ login }) => {
  return (
    <section className="card">
      <h3 className="login__heading">Login To Task Manager</h3>
      <img className="logo" src={logo} alt="" />
      <button className="login__btn" onClick={login}>
        <img
          src="https://pngimg.com/uploads/google/google_PNG19630.png"
          alt=""
        />
        Signin With Google
      </button>
    </section>
  );
};

export default Login;
