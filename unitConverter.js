const elNumIn = document.getElementById('numIn')//Get all the elements from the DOM.
const elUnit = document.getElementById('unitIn')
const elBase = document.getElementById('unitOut')
const elNumOut = document.getElementById('numOut')

elNumIn.addEventListener('blur', check, false)//Add events. In this case, any change triggers the conversion.
elNumIn.addEventListener('focus', check, false)
elNumIn.addEventListener('keyup', check, false)
elUnit.addEventListener('change', check, false)
elBase.addEventListener('change', check, false)


const regHex = new RegExp(/[g-z]/ig) //Returns False when tested if the string contains any character from a to f. Ignores CaSeSeNsItIvE
const hexAndDec = [["A", "10"], ["B", "11"], ["C", "12"], ["D", "13"], ["E", "14"], ["F", "15"]]

function check() {
  elNumIn.value = elNumIn.value.toUpperCase()

  let num = elNumIn.value
  let unit = parseInt(elUnit.value)
  let whole = hasFloat(num)
  let hex = unit === 16
  let condition = validateNum(num, unit, hex)
  let base = parseInt(elBase.value)

  if(unit === base) {
    output("Please select two different conversion types...")
  }

  if(condition) {
    output("Please insert a valid value corresponding to the unit you've inserted...")
  }

  if(num.indexOf(" ") !== -1) {
    clean(num, num.indexOf(" "))
  }

  if(num === "") {
    output("Please insert a number...")
  }


  if(num === "" || floatPoints(num) || condition || unit === base) {
    return
  }

  if(whole) {
    let float = num.substring(num.indexOf(".") + 1, num.length)
    num = num.substring(0, num.indexOf("."))
    start(num, unit, base, float)
    return
  } else {
    start(num, unit, base)
    return
  }
}

function hasFloat(num) {
  if(num.indexOf(".") !== -1) {
    elNumIn.setAttribute("maxlength", "32")

    if(num.indexOf(".") + 1 !== num.length) {
      return true
    }

  } else {
    elNumIn.setAttribute("maxlength", "15")
    elNumIn.value = num.substring(0, 15)
  }

  return false
}

function floatPoints(num, whole) {
  if(num.indexOf(".") !== num.lastIndexOf(".") || num.indexOf(".") === 0) {
    output("Please insert a valid float point...")
    num.indexOf(".") === 0 ? clean(num, 0, true) : clean(num, num.lastIndexOf("."), true)
    return true
  }

  return false
}

function validateNum(num, unit, hex) {
  for(let i = 0; i < num.length; i++) {
    if(hex && regHex.test(num[i])) {
      clean(num, i)
      return true
    }

    if(parseInt(num[i]) >= unit || ((!hex && num[i] !== ".") && isNaN(num[i]))) {
      clean(num, i)
      return true
    }
  }
  return false
}

function clean(num, i, point = false) {
  elNumIn.value = num.substring(0, i)

  if(i < num.length) {
    elNumIn.value += num.substring(i + 1, num.length)

    if(!point) {
      check()
    }
  }
}


function start(num, unit, base, float = 0) {
  let convert = [] //Preset an empty array for answer so we can push values into it.
  unit !== 10 ? toDec(num, float, base, unit, convert) : fromDec(num, float, base, convert)

  let answer = convert.reduce(function (acc, val) {
    acc += val
    return acc
  })

  let original = elNumIn.value

  if(original.indexOf(".") === original.length - 1) {
    original = original.substring(0, original.length - 1)
  }

  output("Your converted number from: " + original + " <sub>" + elUnit.item(elUnit.selectedIndex).textContent + "</sub>" +
   "<br />" + "to: " + answer + " <sub>" + elBase.item(elBase.selectedIndex).textContent + "</sub>")
   return
}

function toDec(num, float, base, unit, convert) {
  num = num.split("")

  if(num.indexOf(".") === num.length - 1) {
    num.pop()
  }

  if(unit === 16) {
    hexConvert(num, false)
  }

  let numPow = num.length - 1

  for(let i = 0; i < num.length; i++) {
    num[i] = parseInt(num[i]) * Math.pow(unit, numPow)
    numPow--
  }

  num = num.reduce(function (acc, val) {
    acc += val
    return acc
  })

  num = num.toString()

  if(float !== 0) {
    float = float.split("")

    if(unit === 16) {
      hexConvert(float, false)
    }

    let floatPow = -1

    for(let i = 0; i < float.length; i++) {
      float[i] = parseInt(float[i]) * Math.pow(unit, floatPow)
      floatPow--
    }

    float = float.reduce(function (acc, val) {
      acc += val
      return acc
    })

    float = float.toString()
    float = float.substring(2, float.length)
  }

  if(base !== 10) {
    fromDec(num, float, base, convert)
  } else {
    convert.unshift(num)

    if(float !== 0) {
      convert.push(".")
      convert.push(float)
    }
  }

  return
}

function fromDec(num, float, base, convert) {
  num = parseInt(num)
  float = parseInt(float)

  do {
    convert.unshift((num % base).toString())
    num = Math.floor(num / base)
  } while(num > 0)

  if(float !== 0) {
    convert.push(".")
    let breaker = elNumIn.value.length

    float /= Math.pow(10, float.toString().length)

    while(float > 0 && breaker > 0) {
      float *= base
      convert.push((Math.floor(float)).toString())
      float -= Math.floor(float)
      breaker--
    }
  }

  if(base === 16) {
    hexConvert(convert, true)
  }

  return convert
}

function hexConvert(convert, toHex) {
  if(toHex) {
    for(let i = 0; i < convert.length; i++) {
      if(!isNaN(parseInt(convert[i])) && parseInt(convert[i]) > 9 && convert[i] !== ".") {
        for(let j = 0; j < hexAndDec.length; j++) {
          if(convert[i] === hexAndDec[j][1]) {
              convert[i] = hexAndDec[j][0]
          }
        }
      }
    }
  } else {
    for(let i = 0; i < convert.length; i++) {
      if(isNaN(parseInt(convert[i])) && convert[i] !== ".") {
        for(let j = 0; j < hexAndDec.length; j++) {
          if(convert[i] === hexAndDec[j][0]) {
              convert[i] = hexAndDec[j][1]
          }
        }
      }
    }
  }
  return
}


function output(msg) {
  elNumOut.innerHTML = "<p>" + msg + "</p>"
  return
}
