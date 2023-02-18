import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../Store/LoginContext";
import { useNavigate,useLocation } from "react-router-dom";
import logo from '../../Utils/Common/Image/logosalao.png'
import perfFeminino from '../../Utils/Common/Image/usuario-feminino.png'
import perfMasculino from '../../Utils/Common/Image/usuario-maculino.png'
import perfOutro from '../../Utils/Common/Image/usuario-outro.png'
import useAPI from "../../Services/APIs/Common/useAPI";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import './Home.css'
import { AllAgendamento,Logout,DeleteAgendamento } from '../../Services/Firebase';
import firebase from '../../Services/Firebase';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { CalendarToday } from "@mui/icons-material";
import Avatar from '@mui/material/Avatar';
import moment from 'moment';
import {  
  Alert,
} from "@mui/material";

export default function Home() {    
    const context = useContext(LoginContext);
  
  const [cards, setCards] = useState([]);
  const [cont, setCont] = useState(0);
  const [isConfirmRemoveDialogOpen, setIsConfirmRemoveDialogOpen] = useState(false)
  const [personChose, setPersonChose] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const getPersonAPI = useAPI(firebase.AllAgendamento);
  const [idRegistro, setidRegistro] = useState()
  const deletePersonAPI = useAPI(DeleteAgendamento);
  const navigate = useNavigate();
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: 'left',
    width:190,
    height:55,
    margin:3,
    color: theme.palette.text.secondary,
   
  }));

  const goToDetail = (agendamento, idRegistro) => {

    //console.log(" valor do person : ",idRegistro)

   

    navigate("/detailUpdate:infoID" + idRegistro, {
      state: {
        person: JSON.stringify(agendamento)
      },
    });
  };

  const goToAdd = () => {
    navigate("/detailAdd/", {
      state: {
        person: "{}",
      },
    });
  };

  const makeLogOff = () => {
    context.onMakeLogoff();
    Logout();
  };

  const confirmRemovePerson = (agendamentoId) => {    
    setidRegistro(agendamentoId);
    setIsConfirmRemoveDialogOpen(true);
    setPersonChose(agendamentoId);
  };

  const deletePerson = (isConfirmed) => {
    setIsConfirmRemoveDialogOpen(false);
    if(!isConfirmed){      
      setPersonChose(null)
    } else {
      setIsLoading(true)
      deletePersonAPI
        .requestPromise(idRegistro)
        .then((info) => {
          console.log("Retornando Info");
          if(idRegistro){
            setPersonChose(null);
            setCards([]);
            getPersonsInfo();
          }  else {
            console.log(info);  
            setIsLoading(false);
            setPersonChose(null);            
          }          
        })
        .catch((info) => {
          console.log(info);
          setIsLoading(false);
          setPersonChose(null);
        });
    }
  };
  

  useEffect(() => {
    getPersonsInfo();
  }, []);
  
  
  const getPersonsInfo = () => {
  
    setIsLoading(true)         
    
      try{       
 
     
     if(context.userId){
      AllAgendamento(context.userId).then( Agendamentos =>{
       
        let mountCards = [];  

        setIsLoading(false);
            Agendamentos.forEach(agendamento =>{                
                 setCont(cont+1 )
                 context.onMakeCliente(agendamento.data().nomeCliente);
                 
                  const dataAgendamento = agendamento.data().data;
                  const dataFormated = dataAgendamento;
                 
                 //console.log("Valor do cliente : ",person.data().nomeCliente);
                 //console.log("Valor do cliente : ",context.cliente);
                 // console.log("Valor array x   :   ",person.data().nomeCliente); <Grid  key={person.variant} item lg={4} md={6} sm={12} >

                  mountCards.push(
                    
                    <Grid  key={agendamento.variant} item lg={4} md={6} >
                      <Card className="cardBox">
                        <CardMedia
                          component="img"
                          height="50"    
                          image={logo}
                          alt="Informação do Serviço"
                        />
                        <CardContent>
                      
                        <Box sx={{ flexGrow: 1 }}>
                        <Grid  container spacing={1}>                      


                          <Grid className="GridFields" >
                          <Item>
                            <Typography gutterBottom variant="h2" component="div">
                           
                                  <InputLabel htmlFor="input-with-icon-adornment">
                                    Cliente
                                  </InputLabel>
                                  <Input
                                    id="input-with-icon-adornment"
                                    startAdornment={
                                      <InputAdornment position="start">
                                        <Avatar
                                          alt="Remy Sharp"
                                          src = {(agendamento.data().sexo==="Feminino")?perfFeminino:(agendamento.data().sexo==="Masculino")?perfMasculino:perfOutro}
                                          sx={{ width: 24, height: 24 }}
                                        />   
                                        {agendamento.data().nomeCliente} 
                                      </InputAdornment>
                                    }
                                  />
                            
                                </Typography>
                                </Item>

                                <Item>
                                <Typography variant="body2" color="text.secondary">
                              
                                <TextField
                                  id="input-with-icon-textfield"
                                  label="Profissional"
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">     
                                        <Avatar
                                          alt="Remy Sharp"
                                          src = {(agendamento.data().sexoProf==="Feminino")?perfFeminino:(agendamento.data().sexoProf==="Masculino")?perfMasculino:perfOutro}
                                          sx={{ width: 24, height: 24 }}
                                        />                  
                                      {agendamento.data().profissional}
                                      </InputAdornment>
                                    ),
                                  }}
                                  variant="standard"
                                />
                              
                                </Typography>
                                </Item>                               

                                <Item>
                                <Typography variant="body2" color="text.secondary">                              
                                <TextField
                                  id="input-with-icon-textfield"
                                  label="Unidade Salão"
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">                                       
                                      {agendamento.data().unidade}
                                      </InputAdornment>
                                    ),
                                  }}
                                  variant="standard"
                                />
                              
                                </Typography>
                                </Item>

                              </Grid>


                              <Grid className="GridFields" >
                              
                              <Item>                                
                                  <Typography variant="body2" color="text.secondary">
                                  <TextField
                                    id="input-with-icon-textfield"
                                    label="Data do Agendamento"
                                  //  inputFormat="DD/MM/YYYY hh:mm:ss"
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <CalendarToday/>
                                        {dataFormated}
                                        </InputAdornment>
                                      ),
                                    }}
                                    variant="standard"
                                  />
                                  </Typography>
                                </Item>
                              <Item>                                
                                  <Typography variant="body2" color="text.secondary">
                                  <TextField
                                    id="input-with-icon-textfield"
                                    label="Servico"
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">                                         
                                        {agendamento.data().servico}
                                        </InputAdornment>
                                      ),
                                    }}
                                    variant="standard"
                                  />
                                  </Typography>
                                </Item>

                                </Grid>



                                <Grid xs={2}  className="GridFields" >
                                <Item >

                                <Typography variant="body2" color="text.secondary">
                                  <TextField 
                                    id="input-with-icon-textfield"
                                    label="Status"
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          
                                        {agendamento.data().status}
                                        </InputAdornment>
                                      ),
                                    }}
                                    variant="standard"
                                  />
                                  </Typography>
                                  </Item>

                                  <Item >

                                <Typography variant="body2" color="text.secondary">
                                  <TextField 
                                    id="input-with-icon-textfield"
                                    label="Quantidade"
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          
                                        {agendamento.data().quantidade}
                                        </InputAdornment>
                                      ),
                                    }}
                                    variant="standard"
                                  />
                                  </Typography>
                                  </Item>

                                </Grid>                               

                            </Grid>  
                          </Box>                          
                        
                        </CardContent>
                        <CardActions>
                          <Button size="small" onClick={() => goToDetail(agendamento, agendamento.data().id)}>Mais informações</Button>
                          <Button size="small" onClick={() => confirmRemovePerson(agendamento.data().id)}>Remover</Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                });

                setCards(mountCards);
              });

         
            }   
              

      } catch{
        console.log(info);
      }; 
     
};
  let alertComp = null;
  let info = null
  if(isLoading){
    info = (
      <div className="circularProgressClass">
        <CircularProgress color="secondary" />
      </div>
    );
  } else {

     if(cards.length===0){
      //  console.log("Passou no loading ");   {alertComp}      
       alertComp = <Alert severity="success">Usuário sem agendamento cadastrado.</Alert>; 
     
     }
         info = <Grid container>{cards}</Grid>;

   
  }
  return (
    <Container>
      <div className="addButtonDiv">
        <Button onClick={() => makeLogOff()}>LogOff</Button>
      </div>
      <div className="TopPageTitle">
        <Typography variant="h1" color="primary">
          Agendamentos - Salão de Beleza
        </Typography>
      </div>
      <div className="addButtonDiv">
        <Button variant="primary" onClick={() => goToAdd()}>
          Adicionar
        </Button>
        {alertComp}  
      
      </div>
      {info}
      <Dialog
        open={isConfirmRemoveDialogOpen}
        onClose={() => confirmRemovePerson(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Remover Pessoa</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deseja realmente remover o usuário{" "}
            {personChose != null ? personChose.firstName : ""}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={() => deletePerson(false)}>Não</Button>
          <Button onClick={() => deletePerson(true)} autoFocus>
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}


