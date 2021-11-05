'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-08-22T14:43:26.374Z',
    '2021-08-23T18:49:59.371Z',
    '2021-08-24T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'da-DK', // de-DE
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
    '2021-08-22T14:43:26.374Z',
    '2021-08-23T18:49:59.371Z',
    '2021-08-24T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];



/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
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

//////////////////////////////////////////////
// Functions of Bankist APP

const formatMovementDate = function(date, locale) {
  const calcDaysPassed = (date1, date2) => 
  Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24)); // convert to miliseconds, to minutes, hours and days with rounded numbers

  const daysPassed = calcDaysPassed (new Date(), date);
  console.log(daysPassed);

  if(daysPassed === 0) return 'Today';
  if(daysPassed === 1) return 'Yesterday';
  if(daysPassed <= 7) return `${daysPassed} days ago`;
  
  // const day = `${date.getDate()}`.padStart(2, 0); // final length always be 2
  // const month = `${date.getMonth() +1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
}


// Create the formatCur function
const formatCur = function(value,locale,currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};



const displayMovements = function(acc, sort = false) {
  containerMovements.innerHTML = '';
  // .textContent = 0;

  // create a shallow array copy to movs from movementes with sort
  const movs = sort 
  ? acc.movements.slice().sort((a, b) => a - b) 
  : acc.movements;
  // Display movements sort into the foreach by adding movs
  movs.forEach(function(mov, i ) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]); // looping through array
    const displayDate = formatMovementDate(date, acc.locale);

    // By having created the function formatCur, you can pass that in with new values as parameters
    const formattedMov = formatCur(mov,acc.locale, acc.currency);
  

    // make a template literal
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    // Insert a Adjacenthtml method
    containerMovements.insertAdjacentHTML
    //('beforeend', html);
    ('afterbegin', html);

  });
};



const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance,acc.locale, acc.currency);
};



const calcDisplaySummary = function(acc) {
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
  // Display your total sum in income 
  labelSumIn.textContent = formatCur(incomes,acc.locale, acc.currency);

  // Display what you have been taken out with labelSumOut
  const out = acc.movements
  .filter(mov => mov < 0)
  .reduce((acc, mov) => acc + mov, 0);
  // using Math.abs to out so we wont have a minus - we take only the absolute number
  labelSumOut.textContent= formatCur(Math.abs(out),acc.locale, acc.currency);

  const interest = acc.movements
  .filter(mov => mov > 0)
  .map(deposit => (deposit * acc.interestRate) / 100)
  .filter((int, i, arr) => {
    //console.log(arr);
    return int >= 1;
  })
  .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest,acc.locale, acc.currency);;
};



const createUserNames = function(accs) {
  accs.forEach(function(acc) {
    acc.username = acc.owner 
    .toLocaleLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
  });
};



createUserNames(accounts); 
// console.log(accounts);
// console.log(containerMovements.innerHTML);

// We can now call on this method anywhere and the task will be executed
const updateUI = function(acc) {
  // Display movments
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
}

const startLogOutTimer = function() {
  const tick = function() {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the reaminging time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop the timer and log out user
    if(time === 0){
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    // Decrease 1 second
    time--;
  };

  // set time to 5 minutes
  let time = 120;

  // call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

/////////////////////////////////////////
// Event handler 
let currentAccount, timer;

// FAKE Always Logged In
// currentAccount = account1;
// updateUI(currentAccount)
// containerApp.style.opacity = 100;


btnLogin.addEventListener('click', function(e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  // use optimal chaining with '?' for accounts that have no values
  if(currentAccount?.pin === +inputLoginPin.value) {
    
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long', // for name
      year:  'numeric',
      weekday: 'long',
    };
    //const locale = navigator.language;
    //console.log(locale);

labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now)// convert it to international timeformat

    //const day = `${now.getDate()}`.padStart(2, 0);
    //const month = `${now.getMonth() + 1}`.padStart(2, 0);
    //const year = now.getFullYear();
    //const hour = `${now.getHours()}`.padStart(2, 0);
    //const min = `${now.getMinutes()}`.padStart(2, 0);
    //labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if(timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Display movements, Display balance and Display summary UI
    updateUI(currentAccount)
    
  }

});

btnTransfer.addEventListener('click', function(e) {
  // refresh data when refresh page
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find( 
    acc => acc.username === inputTransferTo.value);
    // make the transfer btn value empty after send
  inputTransferAmount.value = inputTransferTo.value = '';

  // if accounts send amount account shall lose and the other gain with optimal chaining
  if(
    amount > 0 && 
    receiverAcc &&
    currentAccount.balance >= amount && 
    receiverAcc?.username !== currentAccount.username) {
      //console.log('Trasner valid');
      
      // Doing the transfer
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);

      // Add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());
      receiverAcc.movementsDates.push(new Date().toISOString());

      // Display movements, Display balance and Display summary UI
      updateUI(currentAccount);

      // Rest timer
      clearInterval(timer);
      timer = startLogOutTimer();
  }
});


btnLoan.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value); // round down decimal

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout( function(){
    // Add movement
    currentAccount.movements.push(amount);

    // Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});


btnClose.addEventListener('click', function(e) {
  e.preventDefault();
  //console.log('Delete');

  if(
    inputCloseUsername.value === currentAccount.username && 
    +inputClosePin.value === currentAccount.pin 
  ) {
      // Find returns the index and not the element itself
      const index = accounts
      .findIndex(acc => acc.username === currentAccount.username);
      console.log(index);
      // .indexOf(23)

      // Delete account
      accounts.splice(index, 1);

      // Hide UI
      containerApp.style.opacity = 0;
    }
  // make the transfer btn value empty after send
  inputCloseUsername.value = inputClosePin.value = '';
});

// create so you can clear the sorted so it can go back to normal by false
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  // BUG in video:
  // displayMovements(currentAccount.movements, !sorted);

  // FIX:
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});



/////////////////////////////////////////////////
/////////////////////////////////////////////////
////////////////// LECTURES 



////////////// CONVERTING AND CHECKING NUMBERS
/*
console.log(23 === 23.0);

// Base 10 - 10 to 9. 1/10 = 0.1. 3/10 = 3.333333
// Binary base 2 - 0.1
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);

console.log(Number('23'));
console.log(+'23');

// Parsing
console.log(Number.parseInt('30px', 10));
console.log(Number.parseInt('e23', 10));

console.log(Number.parseInt(' 2.5rem '));
console.log(Number.parseFloat(' 2.5rem ')); // is good when reading a value out of a string

// console.log(parseFloat(' 2.5rem '));

// Checking if value is Not A Number - NaN
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20X'));
console.log(Number.isNaN(23 / 0));

// Checking if value is number
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20X'));
console.log(Number.isFinite(23 / 0));

console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23 / 0));
*/




//////////////// MATH AND ROUNDING
/*
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3));

console.log(Math.max(5, 18, 23, 11, 2));
console.log(Math.max(5, 18, '23', 11, 2));
console.log(Math.max(5, 18, '23px', 11, 2));

console.log(Math.min(5, 18, 23, 11, 2));

console.log(Math.PI * Number.parseFloat('10px') ** 2);

console.log(Math.trunc(Math.random() * 6) + 1);

const randomInt = (min, max) => 
  Math.floor(Math.random() * (max - min) + 1) + min;
// 0....1 > 0..... (max - min) -> min....max
// console.log(randomInt(10, 20));

// Rounding integers
console.log(Math.round(23.3));
console.log(Math.round(23.9));

console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));

console.log(Math.floor(23.3));
console.log(Math.floor('23.9'));

console.log(Math.trunc(23.3));

console.log(Math.trunc(-23.3));
console.log(Math.floor(-23.3));

// Rounding decimals
console.log((2.7).toFixed(0)); // tofix always return a string not a number
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(2));
console.log(+(2.345).toFixed(2)); // + convert to a number again
*/




//////////// THE REMAINDER OPERATOR
/*
console.log( 5 % 2);
console.log(5 / 2); // 5 = 2 * 2 + 1

console.log(8 % 3);
console.log(8 / 3); // 8 = 2 * 3 + 2

console.log(6 % 2);
console.log(6 / 2);

console.log(7 % 2);
console.log(7 / 2);

const isEven = n => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(514));

labelBalance.addEventListener('click', function() {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    // 0, 2, 4, 6 row
    if(i % 2 === 0) row.style.backgroundColor = 'orangered';
    // 0, 3, 6, 9 row
    if(i % 3 === 0) row.style.backgroundColor = 'blue'
  });  
});
*/



/////////// WORKING WITH BigInt
/*
console.log(2 ** 53 -1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 +1);
console.log(2 ** 53 +2);
console.log(2 ** 53 +3);
console.log(2 ** 53 +4);

console.log(12345678900987654321123456789n); // n is BigInt
console.log(BigInt(1234567890));

// Operations
console.log(10000n + 10000n);
console.log(34567896753334345435n * 1000000n);
// console.log(Math.sqrt(16n)); // Does not work

const huge = 2322437845327942793n;
const num = 23;
console.log(huge * BigInt(num));

// Exceptions
console.log(20n > 15);
console.log(20n === 20);
console.log(typeof 20n);
console.log(20n === '20');

console.log(huge + ' is REALLY big!!!');

// Divisions
console.log(11n / 3n);
console.log(10 / 3);
*/





////////////// DATES AND TIME
/*
const now = new Date();
consolelog(now);

console.log(new Date('Aug 02 2020 18:05:41'));
console.log(new Date('December 24, 2015'));
console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2037, 10, 19, 15, 23, 5));
console.log(new Date(2037, 10, 31));

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 1000));
*/

// Working with dates
/*
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());
console.log(future.getTime());

console.log(new Date(123456789));

console.log(Date.now());

future.setFullYear(2040);
console.log(future);
*/




/*
////////// OPERATION WITH DATES
const future = new Date(2037, 10, 19, 15, 23);
console.log(+future);

const calcDaysPassed = (date1, date2) => Math.abs(date2 - date1) / (1000 * 60 * 60 * 24); // convert to miliseconds, to minutes, hours and days

const days1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));
console.log(days1);
*/




///////////// INTERNATIONALIZING NUMBERS (INTl) 
/*
const num = 3884764.23;

const options = {
  style: "currency", // percent, unit or currency
  unit: 'celsius', // liter, mile-per-hour ect
  currency: 'EUR',
  // useGrouping: false,
};

// pass options in as second argument
console.log('US:     ', new Intl.NumberFormat('en-US', options).format(num));
console.log('Germany:', new Intl.NumberFormat('de-DE', options).format(num));
console.log('Syria:  ', new Intl.NumberFormat('ar-SY', options).format(num));
console.log(
  navigator.language, 
  new Intl.NumberFormat(navigator.language, options).format(num)
);
*/




///////////// TIMERS: setTimeOut AND setInterval
/*
const ingredients = ['olives','spinach']; 
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🆗`), 3000, ...ingredients
);
console.log('waiting...');

if(ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// setInterval with callback funtionc
setInterval(function() {
  const now = new Date();
  console.log(now);
}, 1000);
*/