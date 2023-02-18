import React, { useContext } from "react";
import HomeController from "../Screens/Home/Home";
import DetailAddController from "../Screens/Detail/DetailAdd";
import DetailUpdateController from "../Screens/Detail/DetailUpdate";
import ResetController from "../Screens/Login/Reset";
import RegisterController from "../Screens/Login/Register";
import { Routes, Route } from "react-router-dom";
import Login from "../Screens/Login/Login";
import { LoginContext } from "../Store/LoginContext";


const RouteManager = () => {
 const context = useContext(LoginContext);  


  if(context.userId !== ""){
    return (
      <Routes>
        <Route path="/" element={<HomeController />} />        
        <Route path=":infoID" element={<DetailUpdateController />} />  
        <Route path="DetailAdd" element={<DetailAddController />} /> 
      </Routes>
    );
  } else {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="register" element={<RegisterController />} />
        <Route path="reset" element={<ResetController />} />
      </Routes>
    );
  }
};

export default RouteManager;
