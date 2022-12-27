import { useRef, useState, useEffect } from "react";
import "./App.css";
import { io } from "socket.io-client";

function App() {
  const [count, setCount] = useState(0);
  const [messages, addMessage] = useState([]);
  const [msg, changeMsg] = useState("");
  const [user, setUser] = useState("");
  const [socket, setSocket] = useState();
  const userRef = useRef("");

  useEffect(() => {
    const s = io("http://localhost:3000");
    setSocket(s);
    return () => {
      console.log("Cfdfdsfsd");
      s.disconnect();
    };
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (msg === "") return;
    const messageInfo = {
      user: user,
      time: Date.now(),
      text: msg,
    };
    addMessage([...messages, messageInfo]);
    changeMsg("");
    socket.emit("send-message", messageInfo);
  };
  const handleUser = () => {
    if (!userRef.current.value) return;
    // console.log(userRef.current.value);
    setUser(userRef.current.value);
    socket.emit("user", userRef.current.value);
  };

  useEffect(() => {
    console.log("Socket use effect");
    if (socket == null) return;

    const handler = (msg) => {
      console.log(messages);
      addMessage((messages) => [...messages, msg]);
    };
    socket.on("receive-message", handler);

    return () => {
      console.log("callback");
      socket.off("receive-message", handler);
    };
  }, [socket]);

  return (
    <div className="bg-slate-800 min-h-screen flex flex-col text-center">
      <h1 className="text-3xl font-bold underline text-sky-500">Chat</h1>
      {/* <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div> */}
      {user ? (
        <div>
          <ul className="text-center mx-20 px-20">
            {messages.map((msg, i) => (
              <li key={i} className="text-white m-2">
                {msg.user}: {msg.text}
              </li>
            ))}
          </ul>
          <form onSubmit={handleSubmit} className="h-full relative">
            <br></br>
            <div>
              <input
                value={msg}
                type="text"
                onChange={(e) => changeMsg(e.target.value)}
                className="w-2/5"
              />
              <input
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              />
            </div>
          </form>
        </div>
      ) : (
        <div>
          <label>User: </label>
          <input ref={userRef} type="text" className="w-2/5" />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={handleUser}
          >
            Join
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
