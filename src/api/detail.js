import axios from 'axios'
import { URL } from './config'

export function getPlaylist (id) {
  return axios.get(`${URL}/playlist/detail?id=${id}`).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSingerDetail (id) {
  return axios.get(`${URL}/artists?id=${id}`).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getAlbumDetail (id) {
  return axios.get(`${URL}/album?id=${id}`).then(res => {
    return Promise.resolve(res.data)
  })
}
