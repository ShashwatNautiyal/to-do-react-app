import { faComment, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import db from "../firebase";
import firebase from "firebase";

const TaskDetails = (props) => {
  const [taskInfo, setTaskInfo] = useState(null);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState(null);

  console.log(taskInfo);

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(props?.userId)
      .collection("todos")
      .doc(props.todoId)
      .get()
      .then((doc) => setTaskInfo(doc.data()));
  }, [user, comment]);

  const assignTask = () => {
    // Assign Dummy Users
    const username = prompt("Enter Username");
    setUser(username);

    db.collection("users")
      .doc(props?.userId)
      .collection("todos")
      .doc(props.todoId)
      .update({
        assignedUsers: firebase.firestore.FieldValue.arrayUnion(username),
      })
      .then(function () {
        console.log("Assigned Users updated");
      });
  };

  const addComment = () => {
    // Assign Dummy Users
    const comment = prompt("Enter comment");
    setComment(comment);

    db.collection("users")
      .doc(props?.userId)
      .collection("todos")
      .doc(props.todoId)
      .update({
        comments: firebase.firestore.FieldValue.arrayUnion(comment),
      })
      .then(function () {
        console.log("comment updated");
      });
  };

  return (
    <div className="taskDetails">
      <div className="files">
        <a href={taskInfo?.file} target="_blank">
          {taskInfo?.file?.includes(".mp4?") ? (
            <video src={taskInfo?.file} controls width="250"></video>
          ) : (
            <img src={taskInfo?.file} alt="" />
          )}
        </a>
      </div>

      <p>
        <strong>Task-</strong> {props.name}
      </p>

      <div className="users">
        <strong>Assigned- </strong>
        {taskInfo?.assignedUsers?.map((users, index) => (
          <span>
            {users}
            {index !== taskInfo?.assignedUsers?.length - 1 && ", "}
          </span>
        ))}
      </div>

      <div className="comments">
        <strong>Comments- </strong>
        {taskInfo?.comments?.map((comment, index) => (
          <span>
            {comment}
            {index !== taskInfo?.comments?.length - 1 && ", "}
          </span>
        ))}
      </div>

      <div className="status">
        <strong>Status- </strong>
        {taskInfo?.checked ? <span>In Progress</span> : <span>Completed</span>}
      </div>

      <div className="icons">
        <div className="addIcon" onClick={assignTask}>
          <FontAwesomeIcon className="icon" icon={faPlus} />
        </div>
        <div className="addIcon" onClick={addComment}>
          <FontAwesomeIcon className="icon" icon={faComment} />
        </div>
        <div className="addIcon" onClick={props.closeDetails}>
          <FontAwesomeIcon className="icon" icon={faTimes} />
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
