import Axios from 'axios'

export function request () {
  // 1. 创建axios实例
  const instance = Axios.create({
    baseURL: 'your url',
    timeout: 3000
  })
  // 2. 拦截器

  // 3.返回请求实例
  return instance
}
