import { useEffect, useState } from "react";
import axios from "axios";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); 
		const chat = localStorage.getItem('your_chat_key');  // Replace with actual key
		// Replace with actual key
		// console.log('Token:', token)
		// console.log('Token:', chat)
        if (!token) {
          // Handle missing token scenario (e.g., redirect to login)
          console.error('Missing token in local storage');
          return;
        }

        const response = await axios.get("/api/user/get-conversations", {
          headers: {
            Authorization: `Bearer ${token}` // Add token to Authorization header
          }
        });
        const data = response.data;

        // Check if data contains user objects (e.g., has an "email" field)
        if (data.length > 0 && data[0].email) {
          setConversations(data);
        } else {
          // Assuming data contains doctor objects if not users
          setConversations(data.map(doctor => ({
            // Map doctor properties to conversation object structure
            _id: doctor._id, // Replace with conversation identifier from doctor object
            // ... other conversation properties based on doctor data
          })));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  return { loading, conversations };
};

export default useGetConversations;
