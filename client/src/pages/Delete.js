import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'antd';
import Layout from '../components/Layout';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import toast from 'react-hot-toast';
import './DeleteAccountButton.css'; // Import custom CSS for additional styling

function DeleteAccountButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        dispatch(showLoading());
        const response = await axios.delete("/api/user/delete-account", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        dispatch(hideLoading());
        if (response.data.success) {
          toast.success(response.data.message);
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        dispatch(hideLoading());
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <Layout>
      <div className="delete-account-container">
        <div className="delete-account-content">
          <h1 className="delete-account-title">Delete Account</h1>
          <p className="delete-account-description">
            We're sorry to see you go. Please confirm that you want to delete your account. This action cannot be undone.
          </p>
          <Button
            className="delete-account-button"
            onClick={handleDeleteAccount}
            htmlType="submit"
            danger
          >
            Delete Account
          </Button>
        </div>
      </div>
    </Layout>
  );
}

export default DeleteAccountButton;
