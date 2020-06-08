
let btn5 = document.getElementById('btn5');

let arr1 = [1,2,3,6,9,8,7,4];
let arr2 = [1,2,3,6,9,8,7,4];
let btnArr = document.querySelectorAll('.buttonClass');

btn5.addEventListener('click', () => {
	arr1.unshift(arr1.pop());

    for(let i = 0;i <= 7; i++){
    	document.getElementById('btn'+ arr2[i]).innerHTML =arr1[i];
    }

})
