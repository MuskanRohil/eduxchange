import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChat = async () => {
    try {
      const res = await api.get(`/messages/${userId}`);
      setMessages(res.data);
      if (res.data.length > 0) {
        const msg = res.data[0];
        setOtherUser(msg.sender.id === parseInt(userId) ? msg.sender : msg.receiver);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch chat", err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await api.post("/messages", {
        receiverId: userId,
        content: content.trim()
      });
      setContent("");
      fetchChat();
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper" style={{ height: "calc(100vh - 100px)", padding: "10px" }}>
      <div className="glass-panel chat-container" style={{ 
        maxWidth: "900px", 
        margin: "0 auto", 
        height: "100%", 
        display: "flex", 
        flexDirection: "column",
        borderRadius: "20px",
        overflow: "hidden"
      }}>
        <div className="chat-header" style={{ 
          padding: "20px 30px", 
          background: "rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.1)", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center" 
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div className="profile-avatar" style={{ width: "40px", height: "40px", fontSize: "16px" }}>
              {otherUser?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <h3 style={{ margin: 0 }}>{otherUser?.name || "User"}</h3>
              <span style={{ fontSize: "12px", color: "#4ade80" }}>● Online</span>
            </div>
          </div>
          <button className="btn-sm" onClick={() => navigate("/sessions")}>Exit Chat</button>
        </div>

        <div className="chat-messages" style={{ 
          flex: 1, 
          overflowY: "auto", 
          padding: "30px", 
          display: "flex", 
          flexDirection: "column", 
          gap: "15px",
          background: "rgba(0,0,0,0.2)"
        }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: "center", margin: "auto", opacity: 0.5 }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>💬</div>
              <p>No messages yet. Say hi to start your exchange!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.sender.id === currentUser.id ? "my-message" : "their-message"}`}
                style={{
                  alignSelf: msg.sender.id === currentUser.id ? "flex-end" : "flex-start",
                  backgroundColor: msg.sender.id === currentUser.id ? "var(--primary-color)" : "rgba(255,255,255,0.1)",
                  padding: "12px 18px",
                  borderRadius: msg.sender.id === currentUser.id ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                  maxWidth: "70%",
                  color: "white",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  position: "relative"
                }}
              >
                {msg.content}
                <div style={{ fontSize: "10px", opacity: 0.5, marginTop: "5px", textAlign: "right" }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} style={{ 
          padding: "20px 30px", 
          background: "rgba(255,255,255,0.05)",
          borderTop: "1px solid rgba(255,255,255,0.1)", 
          display: "flex", 
          gap: "10px",
          alignItems: "center"
        }}>
          <input
            type="text"
            placeholder="Write your message here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ 
              flex: 1, 
              background: "rgba(255,255,255,0.08)", 
              border: "1px solid rgba(255,255,255,0.15)",
              padding: "18px 25px",
              borderRadius: "15px",
              color: "white",
              fontSize: "16px",
              outline: "none"
            }}
          />
          <button type="submit" className="btn-primary" style={{ 
            padding: "18px", 
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "20px",
            flexShrink: 0
          }}>
            ✈️
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
