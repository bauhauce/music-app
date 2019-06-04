class Lyric {
  constructor ({ time, text }) {
    this.time = time
    this.text = text
  }
}

const reg = /\[(\d{2,}):(\d{2,})[.:](\d{2,})\](.*)/

export function lyricParse (str) {
  let ret = []
  let arr = str.split('\n')
  arr.forEach(item => {
    if (item) {
      const list = item.match(reg)
      if (!list) {
        return
      }
      const time = list[1] * 60 * 1000 + list[2] * 1000 + parseInt(list[3])
      const text = list[4]
      ret.push(new Lyric({
        time: time,
        text: text
      }))
    }
  })
  return ret
}
