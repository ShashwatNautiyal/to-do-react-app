import React, { useState, useEffect } from "react";
import "./App.css";
import Todo from "./components/Todo";
import db from "./firebase";
import firebase from "firebase";
import Login from "./components/Login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [logged, setLogged] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [progressInfo, setProgressInfo] = useState(0);

  console.log(fileInfo);

  // Fetching from database
  useEffect(() => {
    db.collection("users")
      .doc(userInfo?.uid)
      .collection("todos")
      .orderBy("timestamp", "asc")
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
        // User is signed in

        setLogged(true);
        setUserInfo(user);
        console.log("Signed In");
      } else {
        // User is signed out

        setLogged(false);
        console.log("Signed out");
      }
    });
  }, [userInfo]);

  const addTodo = (e) => {
    var file = fileInfo;
    var storageRef = firebase.storage().ref();

    var uploadTask = storageRef.child(`All_Files/${file.name}`).put(file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgressInfo(progress);
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log("File available at", downloadURL);
          db.collection("users").doc(userInfo?.uid).collection("todos").add({
            todo: input,
            file: downloadURL,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            checked: true,
          });
        });

        setInput("");
        setProgressInfo(0);
      }
    );
  };

  const clickAddTodo = (e) => {
    if (e.key === "Enter") {
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
        db.collection("users").doc(`${user.uid}`).set(
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
            Task Manager
            <button onClick={signOut} className="heading__btn">
              Sign out
            </button>
          </h1>

          {progressInfo > 0 && (
            <progress
              id="progressBar"
              value={progressInfo}
              max="100"
              className="progress"
            ></progress>
          )}

          <div className="input-box">
            <input
              type="text"
              placeholder="Task"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyUp={clickAddTodo}
            />
            <label htmlFor="files" className="task">
              <FontAwesomeIcon className="icon" icon={faArrowUp} />
            </label>
            <input
              id="files"
              onChange={(e) => setFileInfo(e.target.files[0])}
              style={{ display: "none" }}
              type="file"
            />
            <button disabled={!input || !fileInfo} onClick={addTodo}>
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
