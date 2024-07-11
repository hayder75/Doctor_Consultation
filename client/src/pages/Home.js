import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Col, Row, Input } from "antd";
import Doctor from "../components/Doctor";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { Typography } from "antd";
import { SmileOutlined } from "@ant-design/icons";
const { Search } = Input;

function Home() {
  const [doctors, setDoctors] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/user/get-all-approved-doctors", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSearch = async (value) => {
    if (!value) {
      getData();
      return;
    }
    try {
      dispatch(showLoading());
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/user/search?q=${value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
        console.log("Search Results:", response.data.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error searching for doctors:", error);
      setSearchResults([]);
    }
  };

  const chatUser = JSON.parse(localStorage.getItem("chat-user"));
  const { Title, Paragraph, Text } = Typography;
  if (chatUser?.isDoctor) {
    return (
      <Layout>
        <div style={{ maxWidth: 600, margin: "20px auto", textAlign: "center", padding: 20, borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          <SmileOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          <Title level={2} style={{ marginTop: 16 }}>
            Hello Doctor,
          </Title>
          <Paragraph style={{ fontSize: "18px", color: "#555" }}>
            Welcome back! You can check your appointments in the <Text strong>Appointment</Text> tab.
          </Paragraph>
          <Paragraph style={{ fontSize: "16px", marginTop: 16 }}>
            <Text type="secondary">
              We are here to help you manage your schedule efficiently and ensure you never miss an appointment.
            </Text>
          </Paragraph>
        </div>
      </Layout>
    );
  }

  if (chatUser?.isAdmin) {
    return (
      <Layout>
        <div style={{ maxWidth: 600, margin: "20px auto", textAlign: "center", padding: 20, borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          <SmileOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          <Title level={2} style={{ marginTop: 16 }}>
            Hello Admin,
          </Title>
          <Paragraph style={{ fontSize: "18px", color: "#555" }}>
            Welcome back! You can operate in the <Text strong>Tabs</Text> provided
          </Paragraph>
          <Paragraph style={{ fontSize: "16px", marginTop: 16 }}>
            <Text type="secondary">
             
            </Text>
          </Paragraph>
        </div>
      </Layout>
    );
  }



  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <Search
          placeholder="Search for doctors by name or specialization"
          enterButton="Search"
          size="large"
          onSearch={handleSearch}
        />
      </div>
      <Row gutter={20}>
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <Col span={8} xs={24} sm={24} lg={8} key={doctor._id}>
              <Doctor doctor={doctor} />
              <br />
            </Col>
          ))
        ) : (
          <Col span={24}>
            <p>No doctors found</p>
          </Col>
        )}
      </Row>
    </Layout>
  );
}

export default Home;
