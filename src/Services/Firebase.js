import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { v4 as uuid } from "uuid";
import {GoogleAuthProvider,  getAuth, signInWithPopup, signInAnonymously, signInWithEmailAndPassword,onAuthStateChanged,createUserWithEmailAndPassword,sendPasswordResetEmail, signOut} from 'firebase/auth'
import {initializeApp} from 'firebase/app'
import React, { createContext, useContext, useEffect, useState } from 'react'
import {getFirestore,query,getDocs,collection,where,addDoc, doc, deleteDoc, getDoc,updateDoc } from "firebase/firestore";
import { LoginContext } from "../Store/LoginContext";
import { Key, TodayOutlined } from '@mui/icons-material';
import { ref } from 'yup';
import moment from 'moment';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

moment.locale('pt-br');
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
    try {
      let result=""
     result = await signInWithEmailAndPassword(auth, email, password);


     const q = query(collection(db, "users"), where("idUser", "==", result.user.uid));
 
     await getDocs(q)
     .then((querySnapshot)=>{
       result = querySnapshot.docs  
       
     })

     return result;
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

const registerWithEmailAndPassword = async (payload) => {

  try {  
   
    let result=""; 
  
  //  console.log("Passei no Agendamentos !!! "+payload.nomeCompleto);
      result= await createUserWithEmailAndPassword(auth, payload.email, payload.password)
        .then(async (newUser)=>{           
           result = await addDoc(collection(db, "users"), {
             idUser: newUser.user.uid,
             nomeCompleto: payload.nomeCompleto,
             tipo: payload.tipo,
             unidadeSalao: payload.unidade,
             sexo: payload.sexo, 
   
         })   

    })
    
    
  
  return result; 

  } catch (err) {
   console.error(err);
    //alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
   // alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const Logout = () => {
   
  signOut(auth);

 
};


const UpdateAgendamento = async(idRegistro,payload) => {

 // console.log("Passei no Agendamentos !!! "+idRegistro);
    try {  

 
    let result=""   
    let idDoc=""
    const q2 = query(collection(db, "agendamento"), where("id", "==", idRegistro));
    //const dataAgendamento=new Intl.DateTimeFormat('pt-br', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(payload.agendamento);
    const dataAgendamento=new Intl.DateTimeFormat('pt-br', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}).format(payload.agendamento);


    await getDocs(q2)
    .then(async (querySnapshot)=>{               
      idDoc=querySnapshot.docs[0].id  
      
    
              await updateDoc(doc(collection(db, "agendamento"), idDoc),{
           
              status : payload.status,
              idUser : payload.userId,
              nomeCliente : payload.nomeCliente,
              servico : payload.servico,
              descricao : payload.descricao,
              quantidade :payload.quantidade,
              unidade : payload.unidade,
              profissional : payload.profissional,
              data : dataAgendamento.toString(),  
              sexo: payload.sexo, 
      
        
        })        
        
    })   
    

  
       return result;

   
    
  } catch (err) {
      console.error(err);
      alert(err.message);
    }

};


const AllAgendamento = async(userId) => {

    try {
   


    let result=""   

    const q = query(collection(db, "agendamento"), where("idUser", "==", userId));
   

    await getDocs(q)
    .then((querySnapshot)=>{               
      result = querySnapshot.docs
                    
       // console.log('agendamentos ', result[0].data().nomeCliente);
    })


       return result;
    
  } catch (err) {
      console.error(err);
      alert(err.message);
    }

};

const GetAgendamento = async(idRegistro) => {

    try {
   

   //console.log("Passei no Agendamentos !!! "+idRegistro);
    let result=""   

    const q = query(collection(db, "agendamento"), where("id", "==", idRegistro));
  

    await getDocs(q)
    .then((querySnapshot)=>{               
      result = querySnapshot.docs
    
    })


       return result;
    
  } catch (err) {
      console.error(err);
      alert(err.message);
    }

};

const AddAgendamento = async(payload) => {

  
    try {   

 
    let result=""  
  
    let serviceId=uuid(); 
    const serviceRef = collection(db,"agendamento");  
    const dataAgendamento=new Intl.DateTimeFormat('pt-br', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}).format(payload.agendamento);

 
     result = await addDoc(serviceRef,{
      
      id : serviceId,
      status : payload.status,
      idUser : payload.userId,
      nomeCliente : payload.nomeCliente,
      servico : payload.servico,
      descricao : payload.descricao,
      quantidade : payload.quantidade,
      unidade : payload.unidade,
      profissional : payload.profissional,
      data : dataAgendamento.toString(),
      sexo: payload.sexo, 
    
    });
  

     return result;
    
  } catch (err) {
      console.error(err);
      alert(err.message);
    }

};

const DeleteAgendamento = async(idRegistro) => {
 
 console.log("Passei no Agendamentos !!! "+idRegistro);
    try {  

 
    let result=""   
    let idDoc=""
    const q2 = query(collection(db, "agendamento"), where("id", "==", idRegistro));    

    await getDocs(q2)
    .then(async (querySnapshot)=>{               
      idDoc=querySnapshot.docs[0].id    
      console.log('agendamentos ', idDoc);    
    
              await deleteDoc(doc(collection(db, "agendamento"), idDoc),{           
                   
       
        })        
        
    })   
    

  
       return result;

   
    
  } catch (err) {
      console.error(err);
      alert(err.message);
    }

};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  Logout,
  AllAgendamento,
  GetAgendamento,
  AddAgendamento,
  UpdateAgendamento,
  DeleteAgendamento,
};


export default firebase;