import api from "../Common/api";

const getEspecialidades = () => api.get("/especialidades/");
const getProfissionais = () => api.get("/profissionais/");
const criaAgendamentos = (payload) => api.post("/agendamento/", payload);
//const updatePersons = (id, payload) => api.put("/simplePersons/" + id, payload);
//const addPersons = (payload) => api.post("/simplePersons/", payload);
//const deletePersons = (id) => api.delete("/simplePersons/" + id);

const exportedObject = {
  getEspecialidades,
  getProfissionais,
  criaAgendamentos,
 
};
export default exportedObject;
