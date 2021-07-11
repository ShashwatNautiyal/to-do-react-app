import React, { useState, useEffect } from 'react';
import './App.css';
import Todo from './components/Todo';
import db from './firebase';
import firebase from 'firebase';
import Login from './components/Login';

function App() {
	const [todos, setTodos] = useState([]);
	const [input, setInput] = useState('');
	const [logged, setLogged] = useState(false);
	const [userInfo, setUserInfo] = useState(null);

	// Fetching from database
	useEffect(() => {
		db.collection('users')
			.doc(userInfo?.uid)
			.collection('todos')
			.orderBy('timestamp', 'asc')
			.onSnapshot((snapshot) => {
				setTodos(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						todo: doc.data().todo,
						checked: doc.data().checked,
					}))
				);
			});

		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				// User is signed in, see docs for a list of available properties
				// https://firebase.google.com/docs/reference/js/firebase.User
				setLogged(true);
				setUserInfo(user);
				console.log('Signed In');
				// ...
			} else {
				// User is signed out
				// ...
				setLogged(false);
				console.log('Signed out');
			}
		});
	}, [userInfo]);

	const addTodo = (e) => {
		db.collection('users').doc(userInfo?.uid).collection('todos').add({
			todo: input,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			checked: true,
		});

		setInput('');
	};

	const clickAddTodo = (e) => {
		if (e.key === 'Enter') {
			addTodo();
		}
	};

	const login = () => {
		var provider = new firebase.auth.GoogleAuthProvider();

		firebase
			.auth()
			.signInWithPopup(provider)
			.then((result) => {
				var user = result.user;
				db.collection('users').doc(`${user.uid}`).set(
					{
						name: user.displayName,
					},
					{ merge: true }
				);
				setUserInfo(user);
				setLogged(true);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const signOut = () => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				// Sign-out successful.
				setLogged(false);
			})
			.catch((error) => {
				// An error happened.
				console.log(error);
			});
	};

	return (
		<div className="body">
			{!logged ? (
				<Login login={login} />
			) : (
				<section className="card">
					<h1 className="heading">
						To-Do List
						<button onClick={signOut} className="heading__btn">
							Sign out
						</button>
					</h1>

					<div className="input-box">
						<input
							type="text"
							placeholder="Task"
							value={input}
							onKeyUp={clickAddTodo}
							onChange={(e) => setInput(e.target.value)}
						/>
						<button disabled={!input} onClick={addTodo}>
							Add
						</button>
					</div>

					<ul className="task-list">
						{todos.map((todo) => (
							<Todo key={todo.id} userId={userInfo.uid} todo={todo} />
						))}
					</ul>
				</section>
			)}
		</div>
	);
}

export default App;
