import { Button, Form, Input } from "antd";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { useAuthContext } from "../context/AuthContext";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();
  const [remainingTime, setRemainingTime] = useState(0);

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/user/login", values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.data);
        localStorage.setItem("chat-user", JSON.stringify(response.data.user));
        setAuthUser(response.data.user);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      if (error.response && error.response.status === 403) {
        const remainingTime = error.response.data.remainingTime;
        setRemainingTime(remainingTime);
        toast.error(`${error.response.data.message}. You can try again in ${Math.floor(remainingTime / 60)}m ${remainingTime % 60}s.`);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // Countdown timer
  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [remainingTime]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}m ${seconds}s`;
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
            <Input.Password placeholder="Password" type="password" />
          </Form.Item>
          <Button className="primary-button my-2 full-width-button" htmlType="submit" disabled={remainingTime > 0}>
            {remainingTime > 0 ? `Try again in ${formatTime(remainingTime)}` : "LOGIN"}
          </Button>
          <div className="d-flex justify-content-between mt-2">
            <Link to="/register" className="anchor">
              Create Account
            </Link>
            <Link to="/forgot" className="anchor">
              Forgot password?
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
