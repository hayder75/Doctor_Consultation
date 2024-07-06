// utils/authUtils.js

export const getToken = () => {
    return localStorage.getItem("token");
  };
  
  export const getAuthHeaders = () => {
    const token = getToken();
    if (token) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };
    } else {
      return {
        "Content-Type": "application/json",
      };
    }
  };
  