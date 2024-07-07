import React from "react";
import Navbar from "./components/Navbar";
import Homee from "./components/Homee";
import About from "./components/About";
import Services from "./components/Services";
import Footer from "./components/Footer";


const Appp = () => {
  return (
    <div>
      <Navbar />

      <main>
        <div id="homee">
          <Homee />
        </div>
       

        <div id="about">
          <About />
        </div>

        <div id="services">
          <Services />
        </div>

       
      </main>

      <Footer />
    </div>
  );
};

export default Appp;
