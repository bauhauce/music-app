import axios from 'axios'
import { URL } from './config'

export function getRank () {
  return axios.get(`${URL}/toplist/detail`).then(res => {
    return Promise.resolve(res.data)
  })
}
