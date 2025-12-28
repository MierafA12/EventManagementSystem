import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNotification } from "../context/NotificationContext.jsx";
import API from "../api/adminApi.jsx";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const { user, jwt } = useAuth();
  const { notifications, addNotification, markAsRead } = useNotification();
  const navigate = useNavigate();

  const role = user?.role;

  const fetchMessages = async () => {
    if (!user || !["admin", "superadmin", "participant"].includes(role)) return;
    try {
      const res = await API.get("/contact/messages", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error(err);
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user]);

  // Mark a message as answered
  const handleAnswer = async (id) => {
    try {
      await API.post(
        "/contact/answer",
        { contact_id: id },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );

      // Mark as read in context
      markAsRead(id);

      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle marking a message as read without answering
  const handleMarkRead = (id) => {
    markAsRead(id);
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, status: "read" } : msg
      )
    );
  };

  if (!user || !["admin", "superadmin", "participant"].includes(role)) {
    return <p className="text-center text-red-500 mt-12">Access denied</p>;
  }

  return (
    <div className="min-h-screen bg-lightBg dark:bg-bgDark p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white shadow hover:bg-secondary transition dark:bg-bgDark dark:text-secondary"
        >
          <FiArrowLeft size={24} className="text-primary dark:text-secondary" />
        </button>
        <h1 className="text-3xl font-bold text-primary dark:text-secondary">
          Contact Messages
        </h1>
      </div>

      {/* Messages */}
      <div className="space-y-4 max-w-6xl mx-auto">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-text1">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`w-full p-4 rounded-lg shadow flex justify-between items-center transition
                ${
                  msg.status === "answered" || msg.status === "read"
                    ? "bg-white hover:bg-lightBg dark:bg-bgDark dark:text-secondary"
                    : "bg-secondary/10 border-l-4 border-primary dark:border-secondary dark:bg-bgDark/50"
                }`}
            >
              <div className="flex-1 pr-4">
                <p className="font-semibold text-primary dark:text-secondary">{msg.subject}</p>
                <p className="text-gray-700 dark:text-text1">
                  <strong>From:</strong> {msg.participant_name} ({msg.participant_email})
                </p>
                <p className="text-gray-700 dark:text-text1">{msg.message}</p>
                <p className="mt-1">
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      msg.status === "answered"
                        ? "text-success font-medium"
                        : msg.status === "read"
                        ? "text-info font-medium"
                        : "text-warning font-medium"
                    }
                  >
                    {msg.status}
                  </span>
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                {msg.status !== "answered" && (
                  <>
                

                    <button
                      onClick={() => handleMarkRead(msg.id)}
                      className="text-primary font-medium hover:text-primary/80 transition dark:text-secondary mt-2"
                    >
                      Mark as Read
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
