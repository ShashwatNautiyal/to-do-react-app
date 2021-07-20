import db from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import TaskDetails from "./TaskDetails";
import { useState } from "react";

const Todo = (props) => {
  const [open, setOpen] = useState(false);

  const openDetails = () => {
    setOpen(true);
  };

  const closeDetails = () => {
    setOpen(false);
  };

  const checkTask = (e) => {
    db.collection("users")
      .doc(props?.userId)
      .collection("todos")
      .doc(props.todo.id)
      .set({ checked: !props.todo.checked }, { merge: true });
  };

  return (
    <div className="task-item">
      <li onClick={openDetails} className={props.todo.checked ? "" : "checked"}>
        {props.todo.todo}
      </li>
      {open && (
        <TaskDetails
          closeDetails={closeDetails}
          userId={props.userId}
          name={props.todo.todo}
          todoId={props.todo.id}
        />
      )}
      <div className="task" onClick={checkTask}>
        <FontAwesomeIcon className="icon" icon={faCheck} />
      </div>
      <div
        className="task"
        onClick={(event) =>
          db
            .collection("users")
            .doc(props?.userId)
            .collection("todos")
            .doc(props.todo.id)
            .delete()
        }
      >
        <FontAwesomeIcon className="icon" icon={faTimes} />
      </div>
    </div>
  );
};

export default Todo;
