import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate  } from "react-router-dom";
import Grid from '@mui/material/Unstable_Grid2';
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from '../../Services/Firebase'; 
import {
    Container,
    Button,
    Typography,
    Box,
    TextField,
    CircularProgress,
    Alert,
    Hidden,
  } from "@mui/material";
  import { Formik, Form, Field, ErrorMessage } from "formik";
import "./Register.css";
import * as Yup from "yup";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { TextFields } from "@mui/icons-material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function Register() { 
 
  const [user, loading, error] = useAuthState(auth);
  const [perfil, setPerfil] = useState("Cliente")
  const [sexo, setSexo] = useState("Feminino")
  const history = useNavigate ();
  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
  const [connectCode, setConnectCode] = useState(0)

  const changePerfil = (event) => {
    setPerfil(event.target.value);
  };
  const changeSexo = (event) => {
    setSexo(event.target.value);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: 'left', 
    height:55,    
    margin:0,
    color: theme.palette.text.secondary,
   
  }));
 
  const unidades = [
    
    {
      value: null,
      label: null,
    },    
    {
      value: 'Belo Horizonte',
      label: 'Belo Horizonte',
    },    
    {
      value: 'Porto Alegre',
      label: 'Porto Alegre',
    },
    {
      value: 'Rio de Janeiro',
      label: 'Rio de Janeiro',
    },
    {
      value: 'São Paulo',
      label: 'São Paulo',
    },
  ];




  const register = async (values) => {
    

    if(perfil==="Cliente")values.unidade="";

    let payload = {
      email: values.email,
      password: values.password,
      nomeCompleto: values.nome,
      tipo: perfil,
      sexo: sexo,       
      unidade: values.unidade,
      
    };
    
      if (payload.nomeCompleto) {

        setIsLoading(true);

        if (isLoading) {
           <CircularProgress color="secondary" />;
        }
        registerWithEmailAndPassword(payload)
        .then((result)=>{          

          setIsLoading(true)  
          setConnectCode(1);
          connectSuccess();   
        
          
        }).catch(function(error) {        
          setIsLoading(false);
          setConnectCode(0);
         
      } );
    }

  }
  let infoUnidade = null
  if(perfil==="Cliente"){

    infoUnidade=0
  }
  const signInSchema = Yup.object().shape({
    email: Yup.string()
      .email("E-mail inválido")
      .required("E-mail é obrigatório"),
    password: Yup.string()
      .required("Senha é obrigatório")
      .min(4, "O senha deve ter ao menos 4 caracteres"),
  });

  const connectSuccess = () => {
    // console.log("Retornando Info");
    // console.log(info.codeInfo.id);
     
   //console.log("Retornando Info",info.id);
        //setIsLoading(false);
 
        setConnectCode(1);
        setIsLoading(false);
       setTimeout(() => {
         
         navigate("/");
       }, 2000);
       
   };

  let buttonInfo = null; 
  let alertComp = null;
  if(isLoading){
    buttonInfo = <CircularProgress color="secondary" />;
  } else if (connectCode === 1){
    
    //console.log("Passou no loading ");
    alertComp = <Alert severity="success">Cadastro realizado com sucesso</Alert>;    
    //console.log("Passou no loading ",alertComp);
    
  } else {
    if ( connectCode !== 0){
      alertComp = (
        <Alert severity="error">
          Houve um erro ao conectar. Tente novamente mais tarde
        </Alert>
      );
    }
    buttonInfo = (
  
      <div style={{ display: 'flex', justifyContent: 'flex-end', height:50 }}>
      <Button  style={{ display: 'flex',justifyContent: 'center',height:30 , marginTop:50, marginLeft:460} } color="primary" size="small" variant="primary" type="submit">
       Cadastrar
      </Button>
        </div>      
         
      );
  }
  return (
    <Container>
    <Box  className="contentBox" sx={{ flexGrow: 1 }}>
    <div className="TitlePage">
             <Typography variant="h1" color="primary">
               Cadastrar nova conta
             </Typography>
           </div>
    <Formik
        initialValues={{
          nome:"",
          email: "",
          password: "",
        
        }}
        validationSchema={signInSchema}
        onSubmit={register}
      >
        {(formik) => {
          const { errors, setFieldValue, values } = formik;
          values.perfil=perfil;
          values.sexo=sexo;
          return (
            <Form>            
            <Grid  container spacing={1} style={{ display: 'flex', justifyContent: 'center',  }}>
            <Grid >
                <Item style={{ width :300}}>
                <TextField style={{ width :300}}
                required
                id="outlined-required"
                label="Nome Completo"
                value={values.nome}
                onChange={(e) => setFieldValue("nome",e.target.value)}
               
                />
              <p></p>
              <ErrorMessage
                component="div"
                className="errorMessage"
                name="nome"
              />
                <TextField style={{ width :260}}
                required
                id="outlined-required"
                label="E-mail Address"
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
                <TextField style={{ width :200}}
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
            </Item>
         </Grid > 
         <p></p>
                       <Grid >
                                  
                    

                <Item style={{ width :350, height :60}}>
                <FormControl>
                    
                        <FormLabel id="demo-radio-buttons-group-label">Perfil</FormLabel>
                        <RadioGroup                         
                          row
                          aria-labelledby="demo-radio-buttons-group-label"
                          defaultValue="Cliente"
                          name="radio-buttons-group"
                          value={perfil}
                          onChange={changePerfil}
                        >
                          <FormControlLabel value="Cliente" control={<Radio />} label="Cliente" />
                          <FormControlLabel value="Empresa"   control={<Radio />} label="Empresa" />
                          <FormControlLabel value="Profissional"   control={<Radio />} label="Profissional" />
                        
                        </RadioGroup>                                    
                  
                  </FormControl>
                  
                  </Item>
                  <p></p>
                  <Item style={{ width :350, height :60}}>
                                 <FormControl>
                                      <FormLabel id="demo-radio-buttons-group-label">Sexo</FormLabel>
                                      <RadioGroup
                                      row
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="Feminino"
                                        name="radio-buttons-group"
                                        value={sexo}
                                        onChange={changeSexo}
                                      >
                                        <FormControlLabel value="Feminino" control={<Radio />} label="Feminino" />
                                        <FormControlLabel value="Masculino" control={<Radio />} label="Masculino" />
                                        <FormControlLabel value="Outro" control={<Radio />} label="Outro" />
                                      
                                      </RadioGroup>
                                    </FormControl>

              
            </Item>
            <p></p>

            <Item style={{ width :250}} Hidden={infoUnidade}>
                   
            <TextField style={{ width :250}}                         
                          
                            id="filled-select-currency-native"
                            select                  
                            label="Unidade"
                            value={values.unidade}
                            onChange={(e) => setFieldValue("unidade", e.target.value)}
                            SelectProps={{
                              native: true,
                            }}
                          
                            variant="filled"
                          >
                            {unidades.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            
                            ))}
                 </TextField> 
                 

    </Item>
                  
                    <p></p>
                   
         </Grid > 


     </Grid>

     <Grid >
                       <Item  style={{ display: 'flex',justifyContent: 'center', marginTop:50, marginLeft:0} } color="primary" size="small" variant="primary">

                       {buttonInfo}
                       {alertComp} 
                       
                        </Item> 
                        <Item style={{ display: 'flex', justifyContent:'center', marginTop:0, marginLeft:0}}  color="primary" size="small" variant="primary">
                      
                        </Item> 
                    
                         <div style={{ display: 'flex', justifyContent:'center', marginTop:0, marginRight:5 }}>
                       
                        Já tem uma conta? <Link style={{marginRight:5,marginLeft:5 }} to="/"> Login </Link>  agora.
                       
                        </div>
                 
                        
                        </Grid>
           
            </Form>
          );
    
    }}
    </Formik>
    </Box>
    </Container>
  );
  
}
export default Register;