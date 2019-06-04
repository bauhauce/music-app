export class Song {
  constructor ({ id, name, singerName, coverImg, albumName }) {
    this.id = id
    this.name = name
    this.singerName = singerName
    this.coverImg = coverImg
    this.albumName = albumName
  }
}

export function arrayToString (arr, prop) {
  const ret = []
  if (!arr) {
    return ''
  }
  arr.forEach(item => {
    ret.push(item[prop])
  })
  return ret.join('/')
}

export function createLatestList (arr) {
  const ret = []
  arr.forEach(item => {
    ret.push(new Song({
      id: item.id,
      name: item.name,
      singerName: arrayToString(item.song.artists, 'name'),
      coverImg: item.song.album.picUrl,
      albumName: item.song.album.name
    }))
  })
  return ret
}

export function createPlaylist (arr) {
  const ret = []
  arr.forEach(item => {
    ret.push(new Song({
      id: item.id,
      name: item.name,
      singerName: arrayToString(item.ar, 'name'),
      coverImg: item.al.picUrl,
      albumName: item.al.name
    }))
  })
  return ret
}

export function createSearchList (arr) {
  const ret = []
  arr.forEach(item => {
    ret.push(new Song({
      id: item.id,
      name: item.name,
      singerName: arrayToString(item.artists, 'name'),
      coverImg: '',
      albumName: item.album.name
    }))
  })
  return ret
}
