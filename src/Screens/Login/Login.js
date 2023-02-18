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
import { auth, logInWithEmailAndPassword, signInWithGoogle } from '../../Services/Firebase';

import { useAuthState } from "react-firebase-hooks/auth";

import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "@emotion/react";



export default function Login() {
    const context = useContext(LoginContext);
    const [isLoading, setIsLoading] = useState(false);
    const [connectCode, setConnectCode] = useState(0);
    //const loginAPI = useAPI(Auth.login); 
   // const loginAPI = useAPI(auth); 
    const [user, loading, error] = useAuthState(auth);
    const [getUserId, setUserId] = useState('')
    let buttonInfo = null;
    let alertComp = null;
    let navigate = useNavigate();
    
   // let getUserId = "";
    const signInSchema = Yup.object().shape({
      email: Yup.string()
        .email("E-mail inválido")
        .required("E-mail é obrigatório"),
      password: Yup.string()
        .required("Senha é obrigatório")
        .min(4, "O senha deve ter ao menos 4 caracteres"),
    });
    const onClickLogin = async (values) => {
    //  console.log("valor de values : ",values.email);

      let payload = {
        email: values.email,
        password: values.password,
      };

    await logInWithEmailAndPassword(values.email, values.password)
      .then((result)=>{  
      
       //console.log("valor de values logInWithEmailAndPassword : ",result[0].data().nomeCompleto);
            
       alertComp = <Alert severity="success">Logado com sucesso  </Alert>;      
       setIsLoading(false); 
      context.onMakeLogin(auth.currentUser.uid);  
      context.onMakeCliente(result[0].data().nomeCompleto);
      context.onMakeSexoUsuario(result[0].data().sexo);
      context.onMakeEmail(values.email);  

      //console.log("Valor do email - login : ",context.email);
           
      }).catch(function(error) {

       
         alertComp = (
          <Alert severity="error">
            Houve um erro ao conectar. Tente novamente mais tarde {connectCode}
          </Alert>
        );
      //  console.log(error.code)
       // alert(error.message)


    }) 
   // console.log("valor de values222 : ",values.email);
    

    
    
    };

    if (connectCode !== 0 || connectCode ===0) {
      buttonInfo = (
        <Button variant="primary" type="submit">
          Logar
        </Button>
      );
    }
return (
  <Container>
    <Box className="contentBox" >
      <div className="TitlePage">
        <Typography variant="h1" color="primary">
          Login
        </Typography>
      </div>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={signInSchema}
        onSubmit={onClickLogin}
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
              <TextField
                required
                id="outlined-required"
                label="Senha"
                type="password"
                value={values.password}
                onChange={(e) => setFieldValue("password", e.target.value)}
              />
              <p></p>
              <ErrorMessage
                component="div"
                className="errorMessage"
                name="password"
              />
             
                <div>
                  <Link to="/reset">Esqueci a senha</Link>
                </div>
                <div>
                  Deseja cadastrar uma nova conta? <Link to="/register">Cadastrar</Link>  uma conta agora.
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
