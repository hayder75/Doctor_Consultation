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
        const chatUser = JSON.parse(localStorage.getItem('chat-user')); // Assuming the user data is stored under 'chat-user'
        
        if (!token) {
          // Handle missing token scenario (e.g., redirect to login)
          console.error('Missing token in local storage');
          return;
        }

        const response = await axios.get("/api/user/get-all-users", {
          headers: {
            Authorization: `Bearer ${token}` // Add token to Authorization header
          }
        });
        const data = response.data;

        // Filter out the logged-in user
        const filteredConversations = data.filter(user => user.email !== chatUser.email);

        setConversations(filteredConversations);
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
