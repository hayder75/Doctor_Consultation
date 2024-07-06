// src/utils/logout.js
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUserState } from "../redux/userSlice"; // Ensure this action exists

const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = () => {
    // Clear local storage
    localStorage.clear();

    // Clear cookies if necessary
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Clear Redux state
    dispatch(clearUserState());

    // Navigate to login
    navigate("/login");
  };

  return logout;
};

export default useLogout;
