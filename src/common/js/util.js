function random (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle (arr) {
  arr.forEach(function (item, index) {
    var randomIndex = random(0, arr.length - 1)
    arr[index] = arr[randomIndex]
    arr[randomIndex] = item
  })
  return arr
}

export function throttle (fn, wait, immediate) {
  let timer = null
  let callNow = immediate
  return function () {
    let context = this
    let args = arguments
    if (callNow) {
      fn.apply(context, args)
      callNow = false
    }
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args)
        timer = null
      }, wait)
    }
  }
}

export function serialize (value) {
  return JSON.stringify(value)
}

export function deserialize (value) {
  if (typeof value !== 'string') {
    return undefined
  }
  try {
    return JSON.parse(value)
  } catch (e) {
    return value || undefined
  }
}
