import axios, {isCancel, AxiosError} from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}`,
  headers: {
   'Content-Type': 'application/json'
  },
 })
 export default api;
 