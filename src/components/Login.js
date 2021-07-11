import React from 'react';
import './Login.css';

const Login = ({ login }) => {
	return (
		<section className="card">
			<h3 className="login__heading">Login To Todo</h3>
			<button className="login__btn" onClick={login}>
				<img src="https://pngimg.com/uploads/google/google_PNG19630.png" alt="" />
				Signin With Google
			</button>
		</section>
	);
};

export default Login;
