import { URL } from './config'
import axios from 'axios'

export function getHot () {
  return axios.get(`${URL}/search/hot`).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSearchSuggest (keyword) {
  return axios.get(`${URL}/search/suggest?keywords=${keyword}&type=mobile`).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSearchMatch (keyword) {
  return axios.get(`${URL}/search/multimatch?keywords=${keyword}`).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSearchResult (keyword) {
  return axios.get(`${URL}/search?keywords=${keyword}`).then(res => {
    return Promise.resolve(res.data)
  })
}
