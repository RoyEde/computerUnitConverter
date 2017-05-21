var unitIndex, baseIndex, answer, val //Declare variables (These will change within functions, but they are global).
const elNumIn = document.getElementById('numIn')//Get all the elements from the DOM.
const elConvert = document.getElementById('convert')
const elUnit = document.getElementById('unitIn')
const elBase = document.getElementById('unitOut')
elNumIn.addEventListener('blur', verify, false)//Add events. In this case, any change triggers the conversion.
elNumIn.addEventListener('keyup', checkKey, false)
elConvert.addEventListener('click', verify, false)
elUnit.addEventListener('change', verify, false)
elUnit.addEventListener('change', checkValid, false)
elBase.addEventListener('change', verify, false)
const elNumOut = document.getElementById('numOut')
answer = [] //Preset an empty array for answer so we can push values into it.
val = ""//Preset this variable to return to the previous value of the input if the character is invalid.
const regHex =
[{
  letter: "A",
  number: "10"
},{
  letter: "B",
  number: "11"
},{
  letter: "C",
  number: "12"
},{
  letter: "D",
  number: "13"
},{
  letter: "E",
  number: "14"
},{
  letter: "F",
  number: "15"
}] //We need a way to filter Hexadecimal characters. I went with a RegExp.
function checkValid(){
  for(let i = 0; i < elNumIn.value.length; i++){
    if(parseInt(elNumIn.value[i]) > elUnit.value){
      elNumIn.value = ""
    }
  }
}

function insert(){
  val = val + this.value
  if((elNumIn.value.indexOf(".") !== -1 || (val === ".")) && this.value === ".") {
    elNumOut.textContent = "Please insert a valid float point..."
  }else{
    elNumIn.value = val
  }
  verify()
}

function deleteIn(){
  elNumIn.value = elNumIn.value.substring(0,(elNumIn.value.length - 1))
  verify()
}

function checkMobile(){
  if((elHexBtn.currentStyle ? elHexBtn.currentStyle.display : getComputedStyle(elHexBtn, null).display) === "inline"){
    if(parseInt(elUnit.value) === 16){
       let hexBtn = document.querySelectorAll(".nonHex");
      for(let i = 0; i < hexBtn.length; i++){
        hexBtn[i].className = 'hex'
      }
    }else{
      let hexBtn = document.querySelectorAll(".hex");
      for(let i = 0; i < hexBtn.length; i++){
        hexBtn[i].className = 'nonHex'
      }
    }
  }
}

function checkKey(e){
  let condition//Predeclare the condition. The scope is inside this function. The condition's value will change.
  let key = String.fromCharCode(e.keyCode).toUpperCase() //The Key that has been pressed (generalized). All to upperCase so nothing is CaSeSeNsItIvE.
  const code = key.charCodeAt(0) //Same as e.keyCode but in a constant.
  if (code === 13){
    return verify() //If Enter is pressed, run verify.
  }

  if(parseInt(elUnit.value) !== 16){
	   key = parseInt(key) //If the unit is hexadecimal don't waste your time. Make every key an int.
  }

  if(parseInt(elUnit.value) !== 16){
	   condition = key < elUnit.value && code > 47 //This condition means that any key value will be set in the interger interval [0-unit).
  }else{
	   condition = ((code > 47 && code < 58) || (code > 64 && code < 71)) //This means that now you can also add letters (and numbers from 0 to 9).
  }

  if((condition) || code === 8 || code === 37 || code === 39 || code === 190){ //Here we take the previos condition and add the chance of the left/right Arrowkey, the backspace or the dot being pressed
    verify()
  }else{
    elNumOut.textContent = "Please insert a valid character/press a valid key..."
    return elNumIn.value = val //This returns the input's value to valid chars only.
  }
}

function verify(){
  let num,float
  const unit = elUnit.value
  const base = elBase.value
  num = elNumIn.value.toString().toUpperCase()
  if(num.length > 33){
    return elNumOut.textContent = "Please use a shorter digit number (<=33 digits, including the \".\")..."
  }

  if(elNumIn.value.indexOf(".") !== elNumIn.value.lastIndexOf(".")){
    elNumOut.textContent = "Please insert only one float point..."
    return elNumIn.value = val
  }

  val = elNumIn.value //Set val to a valid value.

  if(num === ""){
    return elNumOut.textContent = "Please insert a number..."
  }



  if(unit == base){
    return elNumOut.textContent = "Please select different conversion types..."
  }

  if(num.indexOf(".") !== -1){ //Does it have a float point?
    float = num.substring(num.indexOf("."), num.length)
    num = num.substring(0,(num.indexOf(".")))
  }else{
    float = ""
  }

  if(unit !== 10){ //If the unit is not decimal, than I will convert it to decimal to ease the conversion.
    convertDec(num, float, base, unit)
  }else{
    fromDec(num, float, base)
  }
}

function convertDec(num, float, base, unit){
  let current;
  let arrNum = [], arrFloat = []
  for(let i = 0; i < num.length; i++){
    current = num[i]
    if(isNaN(parseInt(current))){
      current = fromHex(current)
    }
    current = parseInt(current)
    current*=Math.pow(unit, num.length - (i + 1))
    arrNum.push(current)
  }
  num = arrNum.reduce((acc,curr)=>acc+=curr)

  if(float.length > 1){
    for(i = 1; i < float.length; i++){
      current = float[i]
      if(isNaN(parseInt(current))){
        current = fromHex(current)
      }
      current = parseInt(current)
      current*=Math.pow(unit, (i * -1))
      arrFloat.push(current)
    }
    float = arrFloat.reduce((acc,curr)=>acc+=curr)
  }

  if(base === 10){
    answer.push(num + float)
    finish();
  }else{
    fromDec(num, float, base)
  }
}

function fromDec(num, float, base){
  num = parseInt(num)
  do{
    if(num%base < 10){
      answer.unshift(num%base)
    }else{
      answer.unshift(toHex(num%base))
    }
    num = Math.floor(num/base)
  }while(num>0)
  if(float.toString().length > 1){
    answer.push(".")
    float = parseFloat(float.toFixed(float.toString().length))
    while(float>0){
      float*=base
      answer.push(Math.floor(float))
      float-= Math.floor(float)
      if(answer.length === 33){
        break
      }
    }
  }
  finish();
}

function fromHex(hex){
  for(let i = 0; i < regHex.length; i++){
    const reg = new RegExp(regHex[i].letter, 'g')
    hex = hex.replace(reg , regHex[i].number)
  }
  return hex;
}

function toHex(hex){
  for(let i = 0; i < regHex.length; i++){
    const reg = new RegExp(regHex[i].number, 'g')
    hex = hex.toString().replace(reg , regHex[i].letter)
  }
  return hex
}

function finish(){
  let original = elNumIn.value.toString().toUpperCase()
  unitIndex = elUnit.selectedIndex
  baseIndex = elBase.selectedIndex
  ansOut = answer.join("")
  elNumOut.textContent = "Your number has been converted from:\n " + (original) + " (" + elUnit.item(unitIndex).textContent +")\n to: " + ansOut + " (" +  elBase.item(baseIndex).textContent + ")."

  return answer = []
}
