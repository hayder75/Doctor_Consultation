import { Button, Form, Input ,Checkbox} from "antd";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { hideLoading, showLoading } from "../redux/alertsSlice";

function VerifyResetCode() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/user/verify-reset-code", values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="">Reset Password</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Reset Code" name="code">
            <Input placeholder="Reset Code" />
          </Form.Item>
          <Form.Item label="New Password" name="newPassword">
            <Input.Password
              placeholder="New Password"
              type={showPassword ? "text" : "password"}
            />
          </Form.Item>
          <Form.Item>
            <Checkbox onChange={() => setShowPassword(!showPassword)}>
              Show Password
            </Checkbox>
          </Form.Item>
          <Button className="primary-button my-2 full-width-button" htmlType="submit">
            RESET PASSWORD
          </Button>
          <Link to="/login" className="anchor mt-2">
            BACK TO LOGIN
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default VerifyResetCode;