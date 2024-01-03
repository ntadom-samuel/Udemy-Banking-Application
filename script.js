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
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

containerMovements.innerHTML = '';
/////////////////////CREATING DOM ELEMENTS
const displayMovements = function (movements, sort = false) {
  //sorting
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`;
    const html = `
      <div class = "movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
  `;

    //insertAdjacentHTML: This is a method that uses HTML to create an element in relation to another element.
    // The method takes two parameters: the first is the position for the new element, and the second is string with the code for creating the new element
    //Note: Check MDN for more info

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
  labelSumOut.textContent = `${out}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(intr => intr >= 1)
    .reduce((acc, intr) => acc + intr, 0);

  labelSumInterest.textContent = `${interest}€`;
};

//Note: The forEach method is used on arrays when a side effect is required, but the map method is used when no side effect is required.

const createUsernames = function (accs) {
  accs.forEach(function (accs) {
    accs.username = accs.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
// console.log(accounts);

const updateUI = acc => {
  // Display movements
  displayMovements(acc.movements);
  // Display Balance
  calcDisplayBalance(acc);
  // Display Summary
  calcDisplaySummary(acc);
};
///////////IMPLEMENTING LOGIN
// Event handlers
//button for login
//Note: The default behavior of a button in a form is to submit the form/ reload the webpage after it is clicked.
//Also, clicking 'enter' when a form's input field is selected will trigger a click event on the button-- in simple terms, it will click the button

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //Preventing the default behaviour of buttons in a form with the entries parameter
  e.preventDefault();
  // this will prevent the page from reloading when the button is clicked

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // Note: 'input.value' returns a string
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //1. Display UI message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.slice(
      0,
      currentAccount.owner.indexOf(' ')
    )}`;
    //Retrieving the first name from a string
    // labelWelcome.textContent = `Welcome back, ${
    // currentAccount.owner.split(' ')[0]
    // }`;

    containerApp.style.opacity = 100;
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    //Clear input focus
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

////////////// IMPLEMENTING TRANSFERS
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
});

///////////////////IMPLEMENTING LOANING WITH THE SOME(any) METHOD
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    // Add movement
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);

    inputLoanAmount.value = '';
  }
});
////////////////CLOSE ACCOUNT/ DELETING ACCOUNTS
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.username === currentAccount.username;
    });

    inputCloseUsername.value = inputClosePin.value = '';

    //Delete account
    //Note:There is more difference between the splice method and the slice method.
    // The splice method takes in two parameters: the first is for the first value you want to extract from the array, and the second is for the amount of values, including the first, that should be extracted
    accounts.splice(index, 1); // This means that the splice method will only remove the element at the selected index from the array. If the second parameter passed in was 2, it would mean that the splice method would remove the element at the index and the element succceding it

    //Hide UI
    containerApp.style.opacity = 0;
  }
});

/////////SORTING BUTTON
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
// ['USD', 'United States dollar'],
// ['EUR', 'Euro'],
// ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/////////////////////SIMPLE ARRAY METHODS
// The SLICE method-- it works exactly like the slice method for strings
// let arr = ['a', 'b', 'c', 'd', 'e'];

//The slice method does not mutate the array; instead, it returns a new array with the selected components.
// console.log(arr.slice(2));
// console.log(arr);
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));

// The slice method can be used to create a shallow copy of any array. This is done by putting no parameters inside the slice parenthesis when it is used on an array
// const newArr = arr.slice();
// console.log(newArr);

//The SPLICE method
//It works just like the slice method, except that it mutates the original array, i.e, it deletes the value in the returned array from the original array
// console.log(arr.splice(1, 3));
// console.log(arr);
// console.log(arr.splice(1));
//In essence, the splice method is used to delete unwanted values in an array
// console.log(arr.splice(2, 4));
// arr.splice(2, 4);
// console.log(arr);

// The REVERSE method
// arr = ['a', 'b', 'c', 'd', 'e'];
// It is used to reverse the positions of the values in an array
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
//The reverse method mutates the original array
// arr2.reverse();
// console.log(arr2);

//The CONCAT method
//It is used to merge two arrays
//The array that should merge with the first array, should be put inside the parenthesis of the concat method.
// console.log(arr.concat(arr2));
//Note: the CONCAT method does not mutate the original arrays; it returns a new array

//The JOIN method
// It is the same join method used in the string section.
// console.log(arr.join('-'));

///////////////////////THE NEW AT METHOD
// It returns the value at a selected index of an Array. It works like the bracket notation
// const arr = [23, 11, 64];
// console.log(arr[0]); // Bracket notation
// console.log(arr.at(0));

//Getting the last value of an array
//1. The three traditional ways
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(...arr.slice(-1));

//2. The new way
// console.log(arr.at(-1));

//For the 'at()' method, parsing '-2' as an argument in it will cause it to return only the value at the second-to-the-last position the array calling it, and not the last two values like the slice method.
// console.log(arr.at(-2));

//note" the 'at' method also works on strings
// console.log('str'.at(-1));

////////.///.////////////LOOPING ARRAYS: forEach
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [i, movement] of movements.entries()) {
// if (movement > 0) {
// console.log(`Movement ${i + 1}: You deposited ${movement}`);
// } else {
// console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
// }
// }
//The code above is the traditional way of looping over arrays and modifying or making use of them

//The forEach method is the modern way of looping over an array to make use of it.
//It acts as a higher-order function, requiring a call back function.
//The forEach method passes an array's values and value-index positions as arguments for its call back function. It can also pass the enitre array as an argument
//The first argument in the function is always the value of an item; the second argument is the value of an index, and the last argument is the array itself.
// console.log('------------------FOREACH-----------------------');
// movements.forEach(function (mov, i, arr) {
// if (mov > 0) {
// console.log(arr);
// console.log(`Movement ${i + 1}: You deposited ${mov}`);
// } else {
// console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
// }
// });

// movements.forEach((value, valueIndex, array) => {
//   console.log(value, valueIndex, array);
// });

//Note: The 'continue' and 'break' statements do not work in a forEach loop. The forEach will always loop over the entire array.

////////////////////////////////////////FOREACH WITH MAPS AND SETS
//In MAPS
//The forEach also passes three arguments into its callback function with maps
//The first argument is the value of the current iteration; the second argument is the key, and the third is the map itself
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['GBP', 'Pound sterling'],
//   ['EUR', 'Euro'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
//   console.log(map);
// });

// In SETS
//The forEach method works the same way in sets and maps, except that in sets the key and value arguments are the same-- they are both values
// const currencyUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currencyUnique);
// currencyUnique.forEach(function (value, key, set) {
//   console.log(`${value}: ${key}`);
// });

////////////////////DATA TRANSFORMATION: Maps, Filter, Reduce
//1. Maps
//The map method can be used to loop over arrays, just like the forEach method. The map method is also a higher order function, taking in a callback function
// The difference, however, is that the map method creates a new array based on the returned results of its callback function's exeqution
// const newMap = [1, 2, 3, 4].map(arr => arr * 2);
// const newMap2 = [1, 2, 3, 4].map(function (arr) {
// arr * 2;
// });
// console.log(newMap);
// console.log(newMap2); //this will return four 'undefined' values in an array. Hence, you must manually return a value

// const eurToUsd = 1.1;
// const movementsUSD = movements.map(mov => mov * eurToUsd);

// console.log(movements);
// console.log(movementsUSD);

//Writing the above code with a for-of loop
// const movementsUSDFor = [];
// for (const mov of movements) movementsUSDFor.push(mov * eurToUsd);
// console.log(movementsUSDFor);

// const movementsDiscriptions = movements.map(
// (mov, i) =>
// `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
// mov
// )}`
// );
// console.log(movementsDiscriptions);
//Note: the map method does not create side-effects-- it does not mutate the original array

//2. Filter
// It is used to store array elements that satisfy certain (returned) test conditions into a new array.
// In a sense, it filters out the array elements which do not satisfy those conditions.

// const deposits = movements.filter((mov, i, arr) => mov > 0);
// In the above code, if the boolean returned is 'true' the value of 'mov' will be stored inside a new array.
// console.log(deposits);

//Writing the above code with a for-of loop
// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

//3. Reduce
// The reduce method is an array method that is used to reduce/boil-down the elements of an array to a single value. It then returns the value for storage
// Unlike other array methods, the first parameter for the reduce method's call-back function is the accumulator.
// When looping over an array with the reduce method, the accumulator variable is used to store the returned value of the reduce method's call-back function.
//The second parameter in the reduce method is where the start value of the accumulator should be assigned

// const balance = movements.reduce(function (
//   accumulator,
//   array_value,
//   array_index,
//   array
// ) {
//   console.log(`Iteration ${array_index}: ${array_value}`);
//   console.log(`accumulator: ${accumulator}`);
//   return accumulator + array_value;
// },
// 0);
// console.log(balance);

//Using the reduce method to get the maximum value of an array
// const maxValue = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);

// console.log(maxValue);

////////////////////////// THE MAGIC OF METHOD CHAINING
// const eurToUsd = 1.1;
// const totalDepositsUSD = movements
// .filter(mov => mov > 0)
// .map(mov => mov * eurToUsd)
// .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

/////////////////////// THE FIND METHOD
//It works just like the filter method, except that it returns just the first array element that satisfies the set condition.
//The find method's main purpose is to retreive a specific array element from an array. e.g

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

//Useful application of the 'find' method
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

//Implementing the above find application with the for-of loop
// let accountNew;
// for (const account of accounts)
// if (account.owner === 'Jessica Davis') accountNew = account;
// console.log(accountNew);

//////////////////////////THE FINDINDEX METHOD
// It works just  like the find method, except that it returns the index of the element instead of the element itself
// const account = accounts.findIndex(acc => acc.owner === 'Jessica Davis');
// console.log(account);

/////////////////////////THE SOME & EVERY METHOD
// SOME
// The some and includes methods work the same way, but differ in two things.
// First, the some method takes in a call-back function as its paraameter, but the includes method takes in a value
// Second, the includes method checks for equality, but some method checks if a condition is satisfied.
// Both the sum and includes methods check if any element in an array satisfy a certain condition, and immediately they find one that does; they return a boolean.

// console.log(movements);
//Equality
// console.log(movements.includes(-130));

//condition
// console.log(movements.some(mov => mov === -130));
// console.log(movements.some(mov => mov > 1500));

//EVERY
// The everymethod is similar to the some method, but it only returns true when all of the elements in an array satisfy the set conditions
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

//Separate Callback
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

/////////////////////////////////THE FLAT and FLATMAP METHOD
//FLAT
// It is an array method that is used to convert an array of arrays to an array of elements.
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

//The depth to which the flat method will flatten can be specified as a parameter in the flat method's parentheses
// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(1));
// console.log(arrDeep); //flat does not mutate the original array
// console.log(arrDeep.flat(2));

//Application of flat
//Summing the movements of all the accounts in the bank app
// const accountSum = accounts
// .map(acc => acc.movements)
// .flat()
// .reduce((acu, curr) => acu + curr, 0);
// console.log(accountSum);

//FLATMAP
//It is the combination of the flat and map methods.
//It works by first creating an array of arrays and then flattening it(This funtion is inbuilt)
//Its usage format is similar to that of the map method
//It has an unchangeable flat-depth of 1, meaning it can only change first-class arrays

//Replicating the above application with FLATMAP
// const accountSum2 = accounts
// .flatMap(acc => acc.movements)
// .reduce((acu, curr) => acu + curr, 0);

// console.log(accountSum2);
//Note: Neither flat nor flatMap mutates the original array

///////////////////////////////////SORTING ARRAYS(SORT METHOD)
//This method mutates the original array

//SORT on strings
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);

//SORT on numbers
//Using the sort method on an array of numbers is complicated because the sort method sorts according to strings
// console.log(movements.sort());

// This error of the sort method can be fixed with the 'compare' callback function
//Sorting numbers in an ascending order

// movements.sort(function (a, b) {
//   //Note: a and b are two consecutive numbers from the array
//   if (a > b)
//     return 1; //If a positive number is returned, the sort method will switch the order of the numbers
//   else return -1; //Whereas, if a negative number is returned, the sort method will keep the order of the numbers
// });
// console.log(movements);

//The above compare function can be simplified
// movements.sort((a, b) => a - b);
// console.log(movements);
// Note: the above compare function is used for sorting numbers in an ascending order
// If you want to sort numbers in a descending order, return 1 when a is less than b and -1 when a is greater than b

//Descending
// movements.sort((a, b) => {
// if (a < b) return 1;
// if (a > b) return -1;
// });

//Simplified
// movements.sort((a, b) => b - a);
// console.log(movements);

////////////////////////////////////////MORE WAYS OF CREATING AND FILLING ARRAYS
//1
const arr = [1, 2, 3, 4, 5, 6];

//2
// const arrNew = new Array(1, 2, 3, 4, 5, 6);
// console.log(arrNew);

//3: creating empty arrays
// const x = new Array(7);
// console.log(x);

//The only method that can work on an empty array is the fill method.
//The fill method fills arrays. It mutates the original array and can work on all arrays
// x.fill(1);
// console.log(x);

//The fill method has three parameters. Its first parameter is used to set the value that would fill the array.
//The second parameter is used to set where to start filling the array.
// and the third is used to set where to stop filling the array-- just like the slice method
//Note: the fill operation returns the value of the new, mutated array.
// console.log(x.fill(23, 0, 2)); //(first, second, third)
// console.log(arr.fill('a', 0, 2));

//4 Programatically configuring arrays(THE FROM METHOD)
// The from method is a static method of the 'Array' object. It takes in two arguments: an array and a callback function, which also takes in two arguments. The from method's callback function is a type of mapping function because the returned value at each iteration is used to create a new array with the same length as the specified array-- from method's first argument.
// The first argument for the from method's callback function is the current element of the specified array and the second argument is the element's index.
// const z = Array.from(arr, (cur, i) => {
//   console.log(cur, i);
//   return i + cur;
// });
// //So, basically, you can use the from method to create an array 'from' an existing array.
// console.log(z);

//If you intend to use the from method to create and fill an array with just one value, your two arguments will be, 1. an object in which the length of the array you want to create is specified and. 2. a callback function, which will set the value for all positions in the array.
// const y = Array.from({ length: 7 }, () => 3);
// console.log(y);

//Challenge
// const arrayRandom = Array.from({ length: 100 }, () =>
//   Math.trunc(Math.random() * 13)
// );
// console.log(arrayRandom);
//Note: 'Array.from' can be used to convert array-like objects, iterables e.g: strings, maps, and sets, into an array.

//A 'Nodelist' is an array like method. It is created when querySelectorAll is used to select all occurences of an element from a DOM
// labelBalance.addEventListener('click', function () {
//   console.log(document.querySelectorAll('.movements__value'));
// Note: A Nodelist cannot use array methods

// Converting a Nodelist to an array with 'Array.from', so that it can use array methods
// const movementsU = Array.from(document.querySelectorAll('.movements__value'));
// console.log(movementsU);

//Simplified conersion
// const movementsUI = Array.from(
//   document.querySelectorAll('.movements__value'),
//   el => Number(el.textContent.replace('€', ''))
// );
// console.log(movementsUI);

//Alternative way of converting a Nodelist to an array
// const movementsUI2 = [...document.querySelectorAll('.movements__value')];
// console.log(movementsUI2);
// });

//A
//Array method practice-- summing all deposits
// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(value => value > 0)
//   .reduce((acc, value) => acc + value, 0);
// console.log(bankDepositSum);

//B
//Number of deposits greater than 1000
//1
// const depositsGreaterThan1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(dep => dep > 1000)
//   .reduce((acc) => acc + 1, 0);

//2
// const depositsGreaterThan1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(dep => dep > 1000).length;
// console.log(depositsGreaterThan1000);

//3
// const depositsGreaterThan1000 = accounts
// .flatMap(acc => acc.movements)
// .reduce((count, curr) => (curr > 1000 ? count + 1 : count), 0);
// console.log(depositsGreaterThan1000);

//More info on the ++ operator
// let a = 10;
// console.log(a++); // This increments the value in the variable but returns the old value
// console.log(a);
// console.log(++a); //This returns the incremented value right away

//C
//Calculating the total sum of deposits and withdrawals with the reduce method
// const { deposit, withdrawal } = accounts
// .flatMap(acc => acc.movements)
// .reduce(
// (sums, cur) => {
// sums[cur > 0 ? 'deposit' : 'withdrawal'] += cur;
// return sums;
// },
// { deposit: 0, withdrawal: 0 }
// );
// console.log(deposit, withdrawal);

//D
//Creating a function that converts random sentences to title cases
// const convertTitleCase = function (title) {
// const capitalize = str => str[0].toUpperCase() + str.slice(1);

// const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'with', 'on', 'in'];

// const titleCase = title
// .toLowerCase()
// .split(' ')
// .map(word => (exceptions.includes(word) ? word : capitalize(word)))
// .join(' ');

// return capitalize(titleCase);
// };
// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title'));
// console.log(convertTitleCase('and here is another EXAMPLE'));
