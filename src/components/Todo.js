import db from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const Todo = (props) => {
	const checkTask = (e) => {
		db.collection('todos')
			.doc(props.todo.id)
			.set({ checked: !props.todo.checked }, { merge: true });
	};
	return (
		<div className="task-item">
			<li className={props.todo.checked ? '' : 'checked'}>{props.todo.todo}</li>
			<div className="task check" onClick={checkTask}>
				<FontAwesomeIcon className="icon" icon={faCheck} />
			</div>
			<div
				className="task"
				fire
				onClick={(event) => db.collection('todos').doc(props.todo.id).delete()}
			>
				<FontAwesomeIcon className="icon" icon={faTimes} />
			</div>
		</div>
	);
};

export default Todo;
