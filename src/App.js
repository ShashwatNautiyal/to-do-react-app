import React, { useState, useEffect } from 'react';
import './App.css';
import Todo from './components/Todo';
import db from './firebase';
import firebase from 'firebase';

function App() {
	const [todos, setTodos] = useState([]);
	const [input, setInput] = useState('');

	// Fetching from database
	useEffect(() => {
		db.collection('todos')
			.orderBy('timestamp')
			.onSnapshot((snapshot) => {
				setTodos(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						todo: doc.data().todo,
						checked: doc.data().checked,
					}))
				);
			});
	}, []);

	const addTodo = (e) => {
		db.collection('todos').add({
			todo: input,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			checked: true,
		});
		console.log(input);

		setInput('');
	};

	const clickAddTodo = (e) => {
		if (e.key === 'Enter') {
			addTodo();
		}
	};

	return (
		<div className="body">
			<section className="card">
				<h1 className="heading">To-Do List</h1>
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
						<Todo key={todo.id} todo={todo} />
					))}
				</ul>
			</section>
		</div>
	);
}

export default App;
