import { useState, useEffect, useRef } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import io from "socket.io-client";
import Image from "../../../assets/user.png";
import { useAuth } from "../../../store/auth";

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
    <section>
      <div className="container mt-5 pt-5">
        <div className="row d-flex justify-content-center">
          <div className="col-md-12 col-lg-12 col-xl-12">
            <div className="card " id="chat2">
              <div className="card-header d-flex justify-content-between align-items-center p-3">
                <h5 className="mb-0 fs-3" style={{ color: "purple" }}>
                  Let's Collaborate
                </h5>
              </div>
              <div
                className="card-body"
                style={{
                  position: "relative",
                  height: "400px",
                  overflowY: "scroll",
                }}
              >
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`d-flex flex-row mb-4 ${
                      message.sender === userName
                        ? "justify-content-end"
                        : "justify-content-start"
                    }`}
                  >
                    {message.sender !== userName && (
                      <img
                        src={Image}
                        alt="avatar"
                        style={{ width: "45px", height: "100%" }}
                      />
                    )}
                    <div>
                      <div
                        className={`small mb-1 ${
                          message.sender === userName
                            ? "text-end me-2 text-muted"
                            : "ms-3 text-muted"
                        }`}
                      >
                        {message.sender}
                      </div>
                      <p
                        className={`small p-2 ms-3 mb-1 rounded-3 ${
                          message.sender === userName
                            ? "bg-primary text-white"
                            : "bg-light"
                        }`}
                      >
                        {message.message}
                      </p>
                      <p
                        className={`small ms-3 mb-3 rounded-3 text-muted ${
                          message.sender === userName
                            ? "d-flex justify-content-end"
                            : ""
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleDateString()}{" "}
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {message.sender === userName && (
                      <img
                        src={Image}
                        alt="avatar"
                        style={{ width: "45px", height: "100%" }}
                      />
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
                <img
                  src={Image}
                  alt="avatar"
                  style={{ width: "40px", height: "100%" }}
                />
                <input
                  type="text"
                  className="ms-2 form-control form-control-lg"
                  id="exampleFormControlInput1"
                  placeholder="Type message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <RiSendPlaneFill
                  size={40}
                  className="ms-2"
                  style={{ cursor: "pointer" }}
                  onClick={handleSendMessage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChatApp;
