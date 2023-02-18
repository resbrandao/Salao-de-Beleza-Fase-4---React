import axios from "axios";


const ApiConn = axios.create({
  baseURL: process.env.REACT_APP_URL,  
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',  
    'Authorization' : process.env.REACT_APP_URL, 
    'Access-Control-Allow-Credentials': true,     
    'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept",
    'Access-Control-Allow-Methods': "GET, POST",
    "Access-Control-Allow-Origin": "*",
   

  }
});



export default ApiConn;
