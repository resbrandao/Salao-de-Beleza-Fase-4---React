import React, { useReducer } from "react";
import { createContext } from "react";

export const LoginContext = createContext({
  userId: "",
  cliente:"",
  sexoUsuario:"",
  email:"",
  makeLogin: () => {},
  makeLogoff: () => {},
  makeCliente: () => {},
 
});
const InfoReducer = (state, action) => {
  let newState = { ...state };
  if (action.type === "MAKE_LOGIN") {
    newState.userId = action.val;
    return newState;
  } else if (action.type === "MAKE_LOGOFF") {
    newState.userId = "";
    newState.cliente = "";    
    return newState;    
  } else if (action.type === "MAKE_CLIENTE") {
    newState.cliente = action.val;
    return newState;    
  }
  else if (action.type === "MAKE_SEXO_USUARIO") {
    newState.sexoUsuario = action.val;
    return newState;    
  }
  else if (action.type === "MAKE_EMAIL") {
    newState.email = action.val;
    return newState;    
  }
};
export const LoginContextProvider = (props) => {
  const [infoState, dispatch] = useReducer(InfoReducer, {
    userId: "",
    cliente:"",

  });

  const onMakeLogin = (userId) => {
      dispatch({ type: "MAKE_LOGIN", val: userId });
  };

  const onMakeLogoff = (info) => {
      dispatch({ type: "MAKE_LOGOFF" });
  };

  const onMakeCliente = (cliente) => {
    dispatch({ type: "MAKE_CLIENTE", val: cliente });
};

const onMakeSexoUsuario = (sexoUsuario) => {
  dispatch({ type: "MAKE_SEXO_USUARIO", val: sexoUsuario });
};

const onMakeEmail = (email) => {
  dispatch({ type: "MAKE_EMAIL", val: email });
};
  return (
    <LoginContext.Provider
      value={{
        userId: infoState.userId,
        cliente: infoState.cliente,  
        sexoUsuario: infoState.sexoUsuario,   
        email: infoState.email,       
        onMakeLogin,
        onMakeLogoff,
        onMakeCliente,
        onMakeSexoUsuario,
        onMakeEmail,
       
      }}
    >
      {props.children}
    </LoginContext.Provider>
  );
};