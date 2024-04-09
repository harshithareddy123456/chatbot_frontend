// src/App.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [messages, setMessages] = useState([
    { text: "hi, how may i help you", isUser: false },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleMessageSend = async () => {
    if (!userInput.trim()) return;

    setMessages([...messages, { text: userInput, isUser: true }]);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:3000/ordersid?orderID=${userInput}`
      );

      if (response.status === 404) {
        setError(response.data.message);
      } else {
        const status = response.data[0].order_status;
        const deliveryDate = response.data[0].estimated_delivery;
        setMessages([
          ...messages,
          { text: "Processing your request...", isUser: false },
          { text: `Order status: ${status}`, isUser: false },
          { text: `Estimated delivery: ${deliveryDate}`, isUser: false },
        ]);
      }
    } catch (error) {
      console.error("Error fetching order details:", error.message);
      setError("Error fetching order details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{ textAlign: message.isUser ? "right" : "left" }}
          >
            {message.text}
          </div>
        ))}
        {isLoading && <div>Loading...</div>}
        {error && <div>{error}</div>}
      </div>
      <div>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button onClick={handleMessageSend}>Send</button>
      </div>
    </div>
  );
};

export default App;
