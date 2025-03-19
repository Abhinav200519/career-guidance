import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import chatbotIcon from "../assets/chatbot-icon.png";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const prompt = `You are a career guidance chatbot. Respond to the user's message: "${input}" with helpful career advice for a 10-12th grade student. Keep the response concise and professional.`;
      const result = await model.generateContent(prompt);
      const botResponse = { text: result.response.text(), sender: "bot" };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, an error occurred. Please try again.", sender: "bot" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChatBot = () => {
    setIsOpen(!isOpen); // Toggle between open and closed
  };

  return (
    <>
      {/* Chatbot Icon */}
      <div
        className="fixed bottom-4 right-4 w-16 h-16 cursor-pointer z-50"
        onClick={toggleChatBot}
      >
        <img
          src={chatbotIcon}
          alt="Chatbot Icon"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Chatbot Popup */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 bg-white rounded-lg shadow-xl p-4 z-50 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-teal-800">Career Chatbot</h3>
            <div>
              <button
                onClick={() => setIsOpen(false)} // Close completely
                className="text-gray-500 hover:text-gray-700 mr-2"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="h-64 overflow-y-auto mb-4 border border-gray-300 p-2 rounded">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-teal-100 text-teal-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 p-0 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="px-2 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:bg-teal-400 flex items-center justify-center"
            >
              <i className="material-icons">send</i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;