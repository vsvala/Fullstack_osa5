import axios from 'axios'
const baseUrl =  'http://localhost:3001/api/blogs'
//'/api/blogs'


//Haetaan blogit
// lisätään kirjautuneen käyttäjän token HTTP-pyynnön Authorization-headeriin
let token = null

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
const setToken = (newToken) => {
  token = `bearer ${newToken}`
}


//Async/await-syntaksiin muutettu create asettaa moduulin tallessa pitämän 
//tokenin Authorization-headeriin, jonka se antaa axiosille metodin post kolmantena parametrina.

// POST lähetys url, blogiolio ja token
const create = async (newObject) => {
  const config = {
    headers: { 'Authorization': token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}


//muokkaus
const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}//Uusi muistiinpano on siis response-olion kentän data arvona

// const deleteOne = (id) => {
//   const request = axios.delete(`${baseUrl}/${id}`)
//   return request.then(response => response.data)

// }

 const deleteOne = async(id) => {
  const config = {
    headers: { 'Authorization': token }
  }
   const response= await axios.delete(`${baseUrl}/${id}`,config)
   return response.data

 }

export default { getAll, create, update, setToken, deleteOne }