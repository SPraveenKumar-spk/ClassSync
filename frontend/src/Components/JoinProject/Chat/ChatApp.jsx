import { useState, useEffect, useRef } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import io from "socket.io-client";
import { useAuth } from "../../../store/auth";
import { FaUserCircle } from "react-icons/fa";

const socket = io("https://classsync-q2os.onrender.com");

function ChatApp() {
  const { userName } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [group, setGroup] = useState({ projectCode: "", teamName: "" });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const projectCode = sessionStorage.getItem("projectCode");
    const teamName = sessionStorage.getItem("teamName");

    if (projectCode && teamName) {
      setGroup({ projectCode, teamName });
      socket.emit("joinChatGroup", { projectCode, teamName });

      socket.on("loadPastMessages", (pastMessages) => {
        setMessages(pastMessages);
      });

      socket.on("receiveMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      socket.off("receiveMessage");
      socket.off("loadPastMessages");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      socket.emit("sendMessage", {
        ...group,
        sender: userName,
        message: newMessage,
      });
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-4 text-center text-xl font-semibold">
            Team Chat
          </div>
          <div className="h-96 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 ${
                  message.sender === userName
                    ? "flex-row-reverse items-end"
                    : ""
                }`}
              >
                <div className="flex-shrink-0">
                  <FaUserCircle size={32} className="text-gray-400" />
                </div>
                <div>
                  <div
                    className={`text-sm ${
                      message.sender === userName
                        ? "text-right text-indigo-600"
                        : "text-left text-gray-600"
                    } font-medium`}
                  >
                    {message.sender}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-2xl break-words max-w-xs text-gray-800 ${
                      message.sender === userName
                        ? "bg-indigo-100 ml-auto"
                        : "bg-gray-100"
                    }`}
                  >
                    {message.message}
                  </div>
                  <div
                    className={`text-xs text-gray-500 mt-1 ${
                      message.sender === userName ? "text-right" : "text-left"
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleDateString()}{" "}
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="flex items-center bg-white border-t border-gray-200 p-4">
            <input
              type="text"
              className="flex-1 px-4 py-2 border rounded-2xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleSendMessage}
              className="ml-3 p-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded-2xl transition-colors duration-200"
            >
              <RiSendPlaneFill size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
