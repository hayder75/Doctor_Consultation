import { Button, Form, Input } from "antd";
import React, { useContext } from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { setAuthUser } = useContext(AuthContext); // Accessing setAuthUser from AuthContext
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/user/login", values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.data); // Assuming response.data.data contains the token
        const userData = await fetchUserData(response.data.data); // Fetch user data after login
        setAuthUser(userData); // Set authenticated user in AuthContext
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        return response.data.data; // Assuming response.data.data contains the user object
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch user data");
      throw error;
    }
  };

  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="card-title">Welcome Back</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input placeholder="Password" type="password" />
          </Form.Item>
          <Button className="primary-button my-2 full-width-button" htmlType="submit">
            LOGIN
          </Button>
          <Link to="/register" className="anchor mt-2">
            CLICK HERE TO REGISTER
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Login;
