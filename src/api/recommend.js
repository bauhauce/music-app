import axios from 'axios'
import { URL } from './config'

export function getBanner () {
  return axios.get(`${URL}/banner?type=2`).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getRecommend () {
  return axios.get(`${URL}/personalized?limit=9`).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getLatest () {
  return axios.get(`${URL}/personalized/newsong`).then(res => {
    return Promise.resolve(res.data)
  })
}
