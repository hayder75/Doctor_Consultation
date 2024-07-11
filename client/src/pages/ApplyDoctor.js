import { Button, Col, Form, Input, Row, TimePicker, Upload } from "antd";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DoctorForm from "../components/DoctorForm";
import moment from "moment";

function ApplyDoctor() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [applicationStatus, setApplicationStatus] = useState("");

  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:500/api/users/me", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setApplicationStatus(response.data.data); // Correctly set the application status from the response
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const formData = new FormData();
      formData.append("userId", user._id);
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("website", values.website);
      formData.append("address", values.address);
      formData.append("specialization", values.specialization);
      formData.append("experience", values.experience);
      formData.append("feePerCunsultation", values.feePerCunsultation);
      formData.append("timings", JSON.stringify([
        moment(values.timings[0]).format("HH:mm"),
        moment(values.timings[1]).format("HH:mm"),
      ]));
      formData.append("cv", values.cv[0].originFileObj);

      const response = await axios.post(
        "/api/user/apply-doctor-account",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <h1 className="page-title">Apply Doctor</h1>
      <hr />
      {applicationStatus && (
        <p>Your doctor application status: {applicationStatus}</p>
      )}
      <DoctorForm onFinish={onFinish} />
    </Layout>
  );
}

export default ApplyDoctor;
