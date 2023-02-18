import React, { useState, useContext,useEffect } from "react";
import {
  Container,
  Button,
  Typography,
  Box,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAPI from "../../Services/APIs/Common/useAPI";
//import Auth from "../../Services/APIs/Auth/Auth";
import { LoginContext } from "../../Store/LoginContext";
import { auth, sendPasswordReset , signInWithGoogle } from '../../Services/Firebase';

import { useAuthState } from "react-firebase-hooks/auth";

import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "@emotion/react";



export default function Reset() {
    const context = useContext(LoginContext);
    const [isLoading, setIsLoading] = useState(false);
    const [connectCode, setConnectCode] = useState(0);
    //const loginAPI = useAPI(Auth.login); 
   // const loginAPI = useAPI(auth); 
    const [user, loading, error] = useAuthState(auth);
    const [getUserId, setUserId] = useState('')
    let navigate = useNavigate();
    let buttonInfo = null;
    let alertComp = null;
    
   // let getUserId = "";
    const signInSchema = Yup.object().shape({
      email: Yup.string()
        .email("E-mail inválido")
        .required("E-mail é obrigatório"),     
    });
    const reset = async (values) => {
   //   console.log("valor de values : ",values.email);

      let payload = {
        email: values.email,        
      };

    await sendPasswordReset(values.email)
      .then(()=>{          
       
      alertComp = <Alert severity="success">Conta recuperada com sucesso. Por favor verificar a caixa de email. </Alert>;      
      setIsLoading(false);  
      setTimeout(() => {
         
        navigate("/");
      }, 4000);            
      }).catch(function(error) {

         // setConnectCode(-1);
         // setIsLoading(false);
         alertComp = (
          <Alert severity="error">
            Houve um erro ao conectar. Tente novamente mais tarde {connectCode}
          </Alert>
        );
      //  console.log(error.code)
       // alert(error.message)


    }) 
    console.log("valor de values222 : ",values.email);
    

     // setConnectCode(0);
     // setIsLoading(true);

}

  
    
    if (connectCode !== 0 || connectCode ===0) {
        buttonInfo = (
  
            <div style={{ display: 'flex', justifyContent: 'center', height:50 }}>
            <Button  style={{ display: 'flex',justifyContent: 'center',height:30 } } color="primary" size="small" variant="primary" type="submit">
             Recuperar Conta
            </Button>
              </div>      
               
            );   
    }
return (
  <Container>
    <Box className="contentBox" >
      <div className="TitlePage">
        <Typography variant="h1" color="primary">
         Recuperar Conta
        </Typography>
      </div>
      <Formik
        initialValues={{
          email: "",        
        }}
        validationSchema={signInSchema}
        onSubmit={reset}
      >
        {(formik) => {
          const { errors, setFieldValue, values } = formik;
          return (
            <Form>
              <TextField
                required
                id="outlined-required"
                label="E-mail"
                value={values.email}
                onChange={(e) => setFieldValue("email", e.target.value)}
              />
              <p></p>
              <ErrorMessage
                component="div"
                className="errorMessage"
                name="email"
              />
              <p></p>
             
             
                <div>
                 Ainda não tem uma conta? Clique em  <Link to="/register">Cadastrar</Link>  uma conta agora.
                </div>
                <div style={{ display: 'flex', justifyContent:'center', marginTop:0, marginRight:5 }}>
                       
                       <Link style={{marginRight:5,marginLeft:5 }} to="/"> Login </Link>  agora.
                       
                 </div>


              <p></p>
              {buttonInfo}
              {alertComp}
            </Form>
          );
        }}
      </Formik>
    </Box>
  </Container>
);


}
