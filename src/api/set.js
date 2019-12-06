import { post, get } from '@/utils/request'

export default class SetApi {
  static getInfo () {
    return get('/setting')
  }

  static reset (params) {
    return post('/setting/reset', params)
  }
}
