
// let text,input,opr,elements;


// const dom = document.querySelector('.btnContainer');
// const result = document.getElementById('res');

// // text = '';

// dom.addEventListener('click',buttonClicked);


// function buttonClicked(event) {
// 	// console.log(document.getElementById(event.target.id).innerHTML);
// 	input = document.getElementById(event.target.id).innerHTML;

// 	switch(true){
// 		case (input === '1' || input === '0'):
// 			// text = text+input;
// 			result.innerHTML += input;
// 			break;

// 		case (input === 'C') :
// 			// text = '';
// 			result.innerHTML = '';
// 			break;

// 		case (input === '+' || input === '-' || input === '*' || input === '/') :
// 			opr = input;
// 			result.innerHTML += input;
// 			// text = text + input;
// 			break;

// 		case (input === '=') :
// 			// elements = text.split(opr);
// 			elements = result.innerHTML.split(opr);
// 			// text = (Math.floor((eval(parseInt(elements[0],2).toString(10) + opr + parseInt(elements[1],2).toString(10))))).toString(2);
// 			result.innerHTML = (Math.floor((eval(parseInt(elements[0],2).toString(10) + opr + parseInt(elements[1],2).toString(10))))).toString(2);
// 			break;
// 	}
// 	// console.log(text);

// 	// result.innerHTML = text;

// }




let text,input,opr,elements;


const dom = document.querySelector('.btnContainer');
const result = document.getElementById('res');


dom.addEventListener('click',buttonClicked);


function buttonClicked(event) {
    // console.log(document.getElementById(event.target.id).innerHTML);
    input = document.getElementById(event.target.id).innerHTML;

    switch(true){
        case (input === '1' || input === '0'):
            result.innerHTML += input;
            break;

        case (input === 'C') :

            result.innerHTML = '';
            break;

        case (input === '+' || input === '-' || input === '*' || input === '/') :
            opr = input;
            result.innerHTML += input;

            break;

        case (input === '=') :

            elements = result.innerHTML.split(opr);

            result.innerHTML = (Math.floor((eval(parseInt(elements[0],2).toString(10) + opr + parseInt(elements[1],2).toString(10))))).toString(2);
            break;
    }

}