import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Col, Row, Input } from "antd";
import Doctor from "../components/Doctor";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";

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
     getData()
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
       console.log(response)
      if (response.data.success) {
        setDoctors(response.data.data);
        console.log("Search Results:", response.data.data);
        
      } else {
        setSearchResults([]);
      }
     // console.log("Search Results:", response.data.data); // Debugging log
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error searching for doctors:", error);
      setSearchResults([]);
    }
  };

 

  // useEffect(() => {
  //   console.log("Doctors:", doctors);
  //   console.log("Search Results:", searchResults);
  //   console.log("Displayed Doctors:", displayedDoctors);
  // }, [doctors, searchResults, displayedDoctors]);
//console.log(doctors)
  return (
    <Layout> 
      <div style={{ padding: '20px' }}>
        <Search
          placeholder="Search for doctors by name or specialization"
          enterButton="Search"
          size="large"
          onSearch={handleSearch}
        />
      </div>
      <Row gutter={20}>
        {
          doctors.length > 0 ?  doctors.map((doctor) => (
            <Col span={8} xs={24} sm={24} lg={8} key={doctor._id}>
              <Doctor doctor={doctor} />
              <br />
            </Col>
          )) 
        
         : (
          <Col span={24}>
            <p>No doctors found</p>
          </Col>
        )}
              </Row>
    </Layout>
  );
}

export default Home;