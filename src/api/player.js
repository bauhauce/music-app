import axios from 'axios'
import { URL } from './config'

export function getSongUrl (id) {
  return axios.get(`${URL}/song/url?id=${id}`).then(res => {
    return Promise.resolve(res.data)
  })
}
export function getLyric (id) {
  return axios.get(`${URL}/lyric?id=${id}`).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSongDetail (id) {
  return axios.get(`${URL}/song/detail?ids=${id}`).then(res => {
    return Promise.resolve(res.data)
  })
}
