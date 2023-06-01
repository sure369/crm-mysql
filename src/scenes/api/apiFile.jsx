import axios, { isCancel, AxiosError } from 'axios';

const apiFile = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}`,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

apiFile.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

export default apiFile;