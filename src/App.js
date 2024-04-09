// src/App.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ThemeProvider } from "styled-components";
import ChatBot from "react-simple-chatbot";

const App = () => {
  const [status, setStatus] = useState("hi");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errmsg, setErrmsg] = useState(false);
  const [msg, setMsg] = useState("");
  const [orderID, setOrderID] = useState(0);
  const [hi, setHi] = useState("hi");
  const [showstatus, setShowstatus] = useState(false);
  useEffect(() => {
    StatusComponent();
  }, [status]);
  const StatusComponent = ({ status }) => {
    return <div>Order status: {status}</div>;
  };

  const theme = {
    background: "#f5f8fb",
    fontFamily: "Arial, sans-serif",
    headerBgColor: "#4CAF50",
    headerFontColor: "#fff",
    headerFontSize: "15px",
    botBubbleColor: "#4CAF50",
    botFontColor: "#fff",
    userBubbleColor: "#fff",
    userFontColor: "#4a4a4a",
  };

  console.log("final", status, deliveryDate);
  const fetchOrderDetails = async (value) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:3000/ordersid?orderID=${value}`
      );

      if (response.status === 404) {
        setErrmsg(true);
        setMsg(response.data.message);
      } else {
        const status = response.data[0].order_status;
        const deliveryDate = response.data[0].estimated_delivery;
        console.log(status, deliveryDate);
        setStatus(status);
        setDeliveryDate(deliveryDate);
        setErrmsg(false);
        setMsg("");
        setShowstatus(true);
      }
    } catch (error) {
      console.error("Error fetching order details:", error.message);
      setErrmsg(true);
      setMsg("Error fetching order details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const chatBotSteps = [
    {
      id: "1",
      message: `${hi}`,
      trigger: "2",
    },
    {
      id: "2",
      message:
        "I apologize for the inconvenience. Could you please share the order ID with me?",
      trigger: "3",
    },
    {
      id: "3",
      message: "Please enter the order ID:",
      trigger: "userInput",
    },
    {
      id: "userInput",
      user: true,
      trigger: (value) => {
        console.log(value.value);
        fetchOrderDetails(value.value);
        return "4";
      },
    },
    // onCapture: ({ value }) => fetchOrderDetals(value),
    {
      id: "4",
      message: "Processing your request...",
      delay: 5000,
      trigger: "5", // Trigger step 5 after the asynchronous operation
    },

    {
      id: "5",
      // Render the custom component passing the status as a prop
      component: <StatusComponent status={status} />,
      end: true, // End the conversation after this step
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <ChatBot steps={chatBotSteps} />
    </ThemeProvider>
  );
};

export default App;
