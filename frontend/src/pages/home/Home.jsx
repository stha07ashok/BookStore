import React from "react";
import Banner from "./banner";
import TopSellers from "./TopSellers";
import Recommended from "./Recommended";
import News from "./News";

const Home = () => {
  return (
    <>
      <Banner />
      <TopSellers />
      <Recommended />
      <News />
    </>
  );
};

export default Home;