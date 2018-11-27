import axios from 'axios'
const baseUrl = '/api/login'

//Kirjautuminen tapahtuu tekemällä(async/wait) HTTP POST -pyyntö palvelimen osoitteeseen api/login
const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }
