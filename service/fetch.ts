import axios from 'axios'

const requetInstance = axios.create({
  baseURL: '/',
})

requetInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)
requetInstance.interceptors.response.use(
  (config) => {
    if (config.status === 200) {
      return config.data
    }
    return Promise.reject(config)
  },
  (error) => Promise.reject(error)
)

export default requetInstance
