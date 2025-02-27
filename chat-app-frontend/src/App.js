import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const chatMessage = { user: username, text: message };
      socket.emit("chat message", chatMessage);
      setMessages((prev) => [...prev, chatMessage]);
      setMessage("");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-100">
      <div className="p-6 max-w-lg w-full bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Chat Application</h1>
        {!loggedIn ? (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-2 w-full rounded mb-2 text-center"
            />
            <button
              onClick={() => setLoggedIn(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-full"
            >
              Join Chat
            </button>
          </div>
        ) : (
          <div>
            <div className="border p-4 mb-4 h-64 overflow-y-auto bg-blue-50 rounded">
              {messages.map((msg, index) => (
                <div key={index} className="mb-2 text-left">
                  <strong className="text-blue-600">{msg.user}:</strong> {msg.text}
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border p-2 w-full rounded text-center"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-full mt-2"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

