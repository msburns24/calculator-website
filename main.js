// Get DOM nodes
const screenEquation = document.querySelector('.screen-equation');
const screenInput = document.querySelector('.screen-input');
const buttonsList = document.querySelectorAll('button');

// Set global variables
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const operations = ['/', '*', '-', '+'];
const numberModifiers = ['+/-', '%', '.'];
let needScreenClear = false;
let needFullScreenClear = false;
let equationReady = false;

// Manage button presses
function buttonPressed(e) {
    let text = e.target.textContent;

    if (needScreenClear) {
        screenInput.textContent = '';
        if (needFullScreenClear) {
            screenEquation.textContent = '';
        }
        needScreenClear = false;
        needFullScreenClear = false;
    }

    // Check each type of button
    if (numbers.includes(text)) {
        screenInput.textContent += text;
        equationReady = true;
    }
    if (text == 'C') {
        screenEquation.textContent = '';
        screenInput.textContent = '';
        equationReady = false;
    }
    if (text == 'CE') {
        screenInput.textContent = '';
        buttonsList[0].textContent = 'C';
        equationReady = false;
    }
    if (operations.includes(text)) {
        screenEquation.textContent += screenInput.textContent;
        screenEquation.textContent += text;
        buttonsList[0].textContent = 'CE';
        needScreenClear = true;
        equationReady = false;
    }
    if (text == '=' && equationReady) {
        screenEquation.textContent += screenInput.textContent;
        screenInput.textContent = evaluateEquation(screenEquation.textContent);
        screenEquation.textContent += '=';
        needScreenClear = true;
        needFullScreenClear = true;
    }
}

function evaluateEquation (equationString) {
    let equation = equationString.split('');
    equation = combineNumbers(equation);
    
    // loop through array for x and /:
    let leftNum;
    let rightNum;
    let newNum;
    for (let i=1; i < equation.length; i++) {
        if (equation[i] == '*') {
            leftNum = equation[i-1];
            rightNum = equation[i+1];
            newNum = leftNum * rightNum;
        } else if (equation[i] == '/') {
            leftNum = equation[i-1];
            rightNum = equation[i+1];
            newNum = leftNum / rightNum;
        } else continue;

        equation.splice(i-1, 3, newNum);
        i--;
    }
    
    // loop through array for + and -:
    for (let i=1; i < equation.length; i++) {
        if (equation[i] == '+') {
            leftNum = equation[i-1];
            rightNum = equation[i+1];
            newNum = leftNum + rightNum;
        } else if (equation[i] == '-') {
            leftNum = equation[i-1];
            rightNum = equation[i+1];
            newNum = leftNum - rightNum;
        } else continue;

        equation.splice(i-1, 3, newNum);
        i--;
    }

    return equation.toString();
}

function combineNumbers(equationArray) {
    if (equationArray.length == 1) {
        return [parseInt(equationArray[0])];
    }

    let tempNum;
    for (let i = 1; i < equationArray.length; i++) {
        if (numbers.includes(equationArray[i-1]) && numbers.includes(equationArray[i])) {
            tempNum = parseInt(equationArray[i-1].toString() + equationArray[i].toString());
            equationArray.splice(i-1, 2, tempNum);
        }
    }
    return equationArray;
}



// Add listeners to buttons
let buttonI;
for (let i = 0; i < buttonsList.length; i++) {
    buttonI = buttonsList[i];
    buttonI.addEventListener('click', buttonPressed);
}