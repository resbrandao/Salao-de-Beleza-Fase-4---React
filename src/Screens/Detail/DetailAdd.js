import React, { useState,useContext,useEffect } from "react";
import { LoginContext } from "../../Store/LoginContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Container,
  Button,
  Typography,
  Box,
  TextField,
  CircularProgress,
  Alert
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAPI from "../../Services/APIs/Common/useAPI";
import Person from "../../Services/APIs/Persons/Persons";
import "./Detail.css"
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Stack from '@mui/material/Stack';
import { AddAgendamento ,Logout } from '../../Services/Firebase';
import moment from 'moment';
import { takeLatest, call, put, all, select} from 'redux-saga/effects';

export default function Detail() {


  const addPersonAPI = useAPI(AddAgendamento);
  const [isLoading, setIsLoading] = useState(false)
  const [connectCode, setConnectCode] = useState(0)
  const [servico, setServico] = useState([])
  const [profissional, setprofissional] = useState([])
  const getEspecialidadeAPI = useAPI(Person.getEspecialidades);
  const getProfissionalAPI = useAPI(Person.getProfissionais);
  const postCriaAgendamento = useAPI(Person.criaAgendamentos);
  const context = useContext(LoginContext);
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: 'left', 
    height:55,    
    margin:3,
    color: theme.palette.text.secondary,
   
  }));
  moment.locale('pt-br');
  const [agendamento, setAgendamento] = React.useState(dayjs());

 
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

  
 
  useEffect(() => {
    consultaApi()
  }, [])
  
  const  consultaApi=  ()=>{


    getEspecialidadeAPI  
    .requestPromise() 
        .then((info) => {
         
            
          let cont=0;
        
         let servicos = [];
      
  
          info.forEach((person) => {
            
  
           servicos.push(       
            
            {value:person.nomeEspecialidade,label:person.nomeEspecialidade}
         
             )
                     
            })       
            setServico(servicos)
     
  
          }).catch((info) => {
              console.log("Retorno erro : ",info);
              
            });

            
    getProfissionalAPI  
    .requestPromise() 
        .then((info) => {         
            
                  
         let profissionais = [];
        
  
          info.forEach((person) => {            
  
          
           profissionais.push(       
            
            {value:person.nomeEspecialidade,label:person.nomeProfissional}
         
             )
                     
            })       
            setprofissional(profissionais)

            
            console.log("Valor do email : ",context.email);
  
          }).catch((info) => {
              console.log("Retorno erro : ",info);
              
            });




  }
  
  

         

  const { infoID } = useParams();
  const {
    state: { person },
  } = useLocation();

  const parsedPerson = JSON.parse(person);
  console.log(parsedPerson);

  let navigate = useNavigate();

  const onBackButton = () => {
    navigate(-1);
  };

  const signInSchema = Yup.object().shape({
   
      agendamento: Yup.date()
      .required("O campo Data do Agendamento é obrigatório"),
      profissional: Yup.string()
      .required("O campo Profissional é obrigatório"),
      servico: Yup.string()
      .required("O campo Serviço é obrigatório"),
      quantidade: Yup.string()
      .required("A profissão é obrigatório")
      .matches(/^[0-9]+$/,"Formato incorreto, por favor usar números inteiros!").min(1, 'Mínimo 1 dígito').max(3, 'Máximo 3 dígitos'),
      
  });




  const onClickLogin = (values) => {
   // console.log(values);
   // values.agendamento = moment(agendamento,"DD/MM/YYYY hh:mm:ss");
    let payload = {
      userId: context.userId,
      nomeCliente: values.nomeCliente,
      profissional: values.profissional,
      agendamento: values.agendamento,
      servico: values.servico,
      status: values.status,
      quantidade: values.quantidade,   
      unidade: values.unidade,
      descricao: values.descricao,  
      sexo: context.sexoUsuario,
    };

   // let payloadAgendamento = {
     // enderecoUnidade: context.email,
     // nomeUnidade: values.nomeCliente,     
    // agendamento: values.agendamento,
      //servico: values.servico,      
    //};

    let payloadAgendamento = {  
      
      email: context.email,
      nomeCliente: values.nomeCliente,
      dataAgendamento: values.agendamento,
      especialidade: values.servico,
      
     };
   
    setConnectCode(0);
  

   if(context.userId){
      addPersonAPI
      .requestPromise(payload)
      .then(result=>{

        setIsLoading(true)  
        setConnectCode(1);
        connectSuccess();

      })
      .catch(connectError);

      postCriaAgendamento
      .requestPromise(payloadAgendamento)
      .then(result=>{

        setIsLoading(true)  
        setConnectCode(1);
        connectSuccess();

      }).catch(connectError);
  } 
};
  
let infoServico = [];
let infoProfissional = [];
  const connectSuccess = () => {  
     
 
 
        setConnectCode(1);
        setIsLoading(false);
       setTimeout(() => {
         
         navigate(-1);
       }, 2000);
       
   };

  const connectError = (info) => {
    console.log("Retornando Info Erro");
    console.log(info);
    setConnectCode(-1);
  };

  let pageTitleText = "Adicionar novo Agendamento";
  let successConnectText = "Cadastro realizado com sucesso!";
  let buttonText = "Adicionar";

  let buttonInfo = null;
  let alertComp = null;
  
  if(isLoading){
    buttonInfo = <CircularProgress color="secondary" />;
  } else if (connectCode === 1){
    alertComp = <Alert severity="success">{successConnectText}</Alert>;    
  } else {
    if ( connectCode !== 0){
      alertComp = (
        <Alert severity="error">
          Houve um erro ao conectar. Tente novamente mais tarde
        </Alert>
      );
    }
    buttonInfo = (
  
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button  style={{  marginTop:2,marginRight:250 }} color="primary" size="small" variant="primary" type="submit">
        {buttonText}
      </Button>
        </div>      
         
      );           
    
      infoServico=servico;
      infoProfissional=profissional;
              
  }
  return (
    <Container>
    <Box className="contentBox" sx={{ flexGrow: 1 }}>
        <div className="TitlePage">
          <Typography variant="h1" color="primary">
            {pageTitleText}
          </Typography>
        </div>
        <Formik
          initialValues={{
            nomeCliente: context.cliente,
            profissional: parsedPerson.profissional,
            agendamento: agendamento,
            servico: parsedPerson.servico,
            status: "Aberto",
            quantidade: parsedPerson.quantidade, 
            unidade: parsedPerson.unidade,
            descricao: parsedPerson.descricao,           
          }}
          validationSchema={signInSchema}
          onSubmit={onClickLogin}
        >
          {(formik) => {
            const { errors, setFieldValue, values } = formik;
           
            return (
              <Form>
                 <Grid  container spacing={1}>   
                        <Grid >

                          <Item>
                            <TextField style={{ width :250}}
                              InputProps={{readOnly: true}}                            
                              id="outlined-required"
                              label="Nome do Cliente"
                              value={values.nomeCliente}
                              onChange={(e) => setFieldValue("nomeCliente", e.target.value)}
                            />
                            <p></p>
                            <ErrorMessage
                              component="div"
                              className="errorMessage"
                              name="nomeCliente"
                            />
                        </Item>

                          <p></p>
                          <Item>

                              <TextField style={{ width :250}}
                              required
                              
                                id="filled-select-currency-native"
                                select                  
                                label="Profissional"
                                value={values.profissional}
                                onChange={(e) => setFieldValue("profissional", e.target.value)}
                                SelectProps={{
                                  native: true,
                                }}
                              
                                variant="filled"
                              >
                                {infoProfissional.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                
                                ))}
                              </TextField> 
                              
                              <p></p>
                              <ErrorMessage
                                component="div"
                                className="errorMessage"
                                name="profissional"
                              />
                          </Item>     

                           <p></p>
                          <Item>

                              <TextField style={{ width :250}}
                              required
                              
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
                              
                              <p></p>
                              <ErrorMessage
                                component="div"
                                className="errorMessage"
                                name="unidade"
                              />
                          </Item>                      

                          
                          <p></p>
                      </Grid>

                      <p></p>
                      <Grid>
                      <Item style={{ width :250}}>  
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Stack >                          
                                <DateTimePicker                                 
                                //  disablePast
                                  label="Data do Agendamento"       
                                  inputFormat="DD/MM/YYYY hh:mm" 
                                  onChange={(newValue) => {
                                    setAgendamento(newValue);  
                                    setFieldValue("agendamento", newValue)                                  
                                  }}
                                  value={values.agendamento}
                                  renderInput={(props) => <TextField style={{ width :250}} {...props} />}
                                />
                            </Stack>
                              </LocalizationProvider>
                        
                        </Item>
                        <p></p>
                        <Item style={{ width :250}}>

                          <TextField style={{ width :250}}
                           required

                            id="filled-select-currency-native"
                            select                  
                            label="Serviço"
                            value={values.servico}
                            onChange={(e) => setFieldValue("servico", e.target.value)}
                            SelectProps={{
                              native: true,
                            }}

                            variant="filled"
                          >
                            {infoServico.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            
                            ))}
                          </TextField> 

                          <p></p>
                          <ErrorMessage
                            component="div"
                            className="errorMessage"
                            name="profissional"
                          />
                          </Item>
                        </Grid>
                        <p></p>
                        <Grid>

                        <Item style={{ width :150, alignContent:"center"}}>
                              <TextField style={{ width :150, textAlign:"center"}}
                               // InputProps={{readOnly: true}}
                                inputProps={{min: 0, style: { textAlign: 'center'} ,readOnly: true}}                          
                                id="outlined-required"
                                label="Status"
                                value={values.status}
                                //value={"Aberto"}
                                onChange={(e) => setFieldValue("status", e.target.value)}
                              />
                              <p></p>
                              <ErrorMessage
                                component="div"
                                className="errorMessage"
                                name="status"
                              />
                              </Item>
                              <p></p>
                              <Item style={{ width :150}}>
                              <TextField style={{ width :150}}
                              inputProps={{min: 0, style: { textAlign: 'center'} }} 
                                required                               
                                id="outlined-required"
                                label="Quantidade"
                                value={values.quantidade}
                                onChange={(e) => setFieldValue("quantidade", e.target.value)}
                              />
                              <p></p>
                              <ErrorMessage
                                component="div"
                                className="errorMessage"
                                name="quantidade"
                              />
                              </Item>
                        </Grid>
                        <p></p>
                        </Grid>

                        <Grid >
                        
                      <Item style = {{ width:440, marginTop:0, marginRight:300}}>
                          <TextField
                            style = {{height:100, width:440}}
                            multiline = {true}                                       
                            id="outlined-required"
                            label="Descrição"
                            value={values.descricao}
                            onChange={(e) => setFieldValue("descricao", e.target.value)}
                          />
                          <p></p>
                          <ErrorMessage
                            component="div"
                            className="errorMessage"
                            name="descricao"
                          />

                          </Item> 
                      </Grid>                
            
                
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
};
