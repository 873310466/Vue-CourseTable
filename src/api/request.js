import Axios from 'axios'

export function request () {
  // 1. 创建axios实例
  const instance = Axios.create({
    baseURL: 'http://39.97.225.111:9000',
    timeout: 3000
  })
  // 2. 拦截器

  // 3.返回请求实例
  return instance
}
