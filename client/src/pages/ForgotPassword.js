import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { hideLoading, showLoading } from "../redux/alertsSlice";

function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/user/forgot-password", values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/verify-reset-code");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
        console.log(error)
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="">Forgot Password</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>
          <Button className="primary-button my-2 full-width-button" htmlType="submit">
            SEND RESET CODE
          </Button>
          <Link to="/login" className="anchor mt-2">
            BACK TO LOGIN
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default ForgotPassword;