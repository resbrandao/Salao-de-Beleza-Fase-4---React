import api from "../Common/api";

const login = (payload) => api.post("/authPersons/login", payload);

const exportedObject = {
  login
};
export default exportedObject;
