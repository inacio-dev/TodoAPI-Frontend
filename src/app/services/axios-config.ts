import axios, { AxiosInstance } from 'axios'

const baseURL = 'https://todo-api-inacio-014fd3adf0e4.herokuapp.com/api/'

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access-token') || ''
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    config.xsrfCookieName = 'csrftoken'
    config.xsrfHeaderName = 'X-CSRFToken'
    config.withCredentials = true
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default axiosInstance
