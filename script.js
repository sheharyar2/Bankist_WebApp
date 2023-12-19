'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
  ],
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');//done
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');//done
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');//done
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const displayMovements =function(acc)
{   
    containerMovements.innerHTML='';
    acc.movements.forEach((value,index) => {
    const fund = value > 0 ?'deposit' :'withdrawal';
    const date = new Date(acc.movementsDates[index]);
    const html = `
    <div class="movements__row">
         <div class="movements__type movements__type--${fund}">${index+1} ${fund}</div>
         <div class="movements__date">${`${date.getDate()}`.padStart(2,0)}/${`${date.getMonth()+1}`.padStart(2,0)}/${date.getFullYear()}
         </div>

         <div class="movements__value">${value.toFixed(2)}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin',html);
   });
}

///getting username from fullname
const createUsernames = function(accs)
{
    accs.forEach(function(acc)
    {
        acc.userName =acc.owner.toLowerCase().split(" ").map((word)=>word[0]).join('');
    });
}
createUsernames(accounts);

function updateUI(currentAccount)
{
    displayMovements(currentAccount);
    //Calling Calculate Print Balance Function
    calcPrintBalance(currentAccount);
    //Calling Calculate Display Summary Function
    calcDisplaySummary(currentAccount);
}
let currentAccount

///logging to the main screen

btnLogin.addEventListener('click',function(event)
{
   event.preventDefault();
    login();    
});

function login()
{
    currentAccount = accounts.find(acc =>acc.userName === inputLoginUsername.value);
    if(currentAccount?.pin === Number(inputLoginPin.value))
    {
        //Displaying UI and Welcome Screen
        labelWelcome.innerHTML=`Good Day , ${currentAccount.owner.split(" ")[0]}`;
        const now = new Date();
        console.log(now);
        console.log(now.getDay());
        labelDate.textContent =`${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()},${now.getHours()}:${now.getMinutes()}`;
        containerApp.style.opacity = 100;
        //Clearing Input Fields
        inputLoginUsername.value=inputLoginPin.value='';
        updateUI(currentAccount);
    }
}

//CASH TRANSFER

btnTransfer.addEventListener('click',function(e)
{
    e.preventDefault();
    const amount =Number(inputTransferAmount.value);
    const receiverAccount=accounts.find(acc => acc.userName ===inputTransferTo.value );
    if(amount > 0 && currentAccount.balance >= amount && currentAccount.userName != receiverAccount?.userName){
        //displayMovements(receiverAccount);
        currentAccount.movements.push(-amount);
        currentAccount.movementsDates.push(new Date());
        receiverAccount.movements.push(amount);
        receiverAccount.movementsDates.push(new Date());
        updateUI(currentAccount);
        inputTransferAmount.value='';
        inputTransferTo.value=''

    }
})

//LOAN TRANSFER

btnLoan.addEventListener('click',function(e)
{
    e.preventDefault();
    const loanAmount = Math.floor(inputLoanAmount.value);
    if(loanAmount > 0 && currentAccount.movements.some(mov => mov>=loanAmount*0.1))
    {
        currentAccount.movements.push(loanAmount);
        currentAccount.movementsDates.push(new Date());
        updateUI(currentAccount);
        inputLoanAmount.value='';
    }

}
)
function calcPrintBalance(acc)
{
       acc.balance= acc.movements.reduce((acc,curr)=>acc+curr,0);
       labelBalance.innerHTML=`${acc.balance.toFixed(2)}€`;
}
function calcDisplaySummary(acc)
{
    const incomes = acc.movements.filter((mov)=>mov>0).reduce((acc,curr)=>acc+curr,0);
    const incomesOut = acc.movements.filter((mov)=>mov<0).reduce((acc,curr)=>acc+curr,0);
    const interest =(incomes*acc.interestRate)/100;
    labelSumIn.textContent=`${parseFloat(incomes).toFixed(2)}€`;
    labelSumOut.innerHTML=`${parseFloat(parseFloat(Math.abs(incomesOut)).toFixed(2))}€`;
    labelSumInterest.innerHTML=`${parseFloat(interest).toFixed(2)}€`;
}
//LOGGING OUT

btnClose.addEventListener('click',function(event)
{
    event.preventDefault();
    logOut();
})

function logOut()
{
    if(currentAccount?.pin === Number(inputClosePin.value)  && currentAccount?.userName === inputCloseUsername.value)
    {
    //console.log(currentAccount);
    for(const [i,account] of accounts.entries())
    {   
        if(account.userName === currentAccount.userName)
        {
           // console.log("current account",'index = ',i,currentAccount);
            accounts.splice(i,1);
            console.log(accounts);
            //Displaying UI and Welcome Screen
            labelWelcome.innerHTML=`Log in to get started`;
            containerApp.style.opacity = 0;
            inputClosePin.value=inputCloseUsername.value='';
       
        }
    }
    }
    //console.log(accounts);
}


/////CODING CHALLENGE 1
/*
const juliaData = [3,4,2,6,7];
const kateData = [2,5,3,5,7];

const checkDogs = function(juliaData,kateData)
{   
    const juliaDataUpdate = juliaData.slice(1,-2);
    const dogs = juliaDataUpdate.concat(kateData);
    for(const [i,dogAge] of dogs.entries())
    {
        const type = dogAge>2 ?"adult" : 'puppy';
        const dogNumber = i>1 ?"kate" : "julia";
        const index = i<=1 ? i :i-2;
        console.log(`${dogNumber}'s Dog ${index+1} is ${type}`);
    }

}
checkDogs(juliaData,kateData);*/


///MAP  - ARRAY FUNCTION

/*const numbers=[1,2,3,4,5,6];

const doubled = numbers.map((x) =>x*1);
console.log(doubled);


const student =[
    {key:1 , value:10},
    {key:2 , value:20},
    {key:3 , value:30}

];

const newStudents = student.map(({key,value})=>({[key] : value}));
console.log(newStudents);
console.log(student);
*/


/// FILTER - ARRAY FUNCTION

/*const numbers =[1,2,3,4,5,6,7,8];
const Even = numbers.filter((number)=>number%2===0);
console.log("EVEN" ,Even);

///REDUCE - ARRAY FUNCTION

console.log(movements);
const balance=movements.reduce((acc,curr,i,arr)=>
    acc+curr,//acc=acc+curr
    console.log(`iteration ${i} : accumulator value ${acc}`),

0);
console.log(balance);*/

///ARRAY FIND METHOD

const firstWithDrawal = movements.find((mov,i)=>
{   
    console.log(i);
    return mov>300;
}
)
console.log(firstWithDrawal);

