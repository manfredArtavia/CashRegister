const cashRegister = (() => {
  // labels to show errors
  const ERROR_MSG = {
      NOT_ENOUGH_CASH: 'Sorry, not enough cash.',
      INSUFICIENT_FUNDS: 'Sorry, Insufficient Funds.',
      INVALID_ENTRIES: 'Sorry, Verify the values'
  }
  // denomination values
  let DENOMINATIONS = [
      {
        name: 'ONE HUNDRED',
        value: 100,
        quantity: 0,
      },
      {
        name: 'TWENTY',
        value: 20,
        quantity: 0,
      },
      {
        name: 'TEN',
        value: 10,
        quantity: 0,
      },
      {
        name: 'FIVE',
        value: 5,
        quantity: 0,
      },
      {
        name: 'ONE',
        value: 1.00,
        quantity: 0,
      },
      {
        name: 'QUARTER',
        value: 0.25,
        quantity: 0,
      },
      {
        name: 'DIME',
        value: 0.10,
        quantity: 0,
      },
      {
        name: 'NICKEL',
        value: 0.05,
        quantity: 0,
      },
      {
        name: 'PENNY',
        value: 0.01,
        quantity: 0,
      }
  ];
  // global balance to show
  let balance = 0;
  // Initial Balance
  let initialBalance = 0;
  // Sales
  let sold = 0;
  // global bills to operate
  let bills = [];

  // generate an array of bills with the denomination array and optional receives the max quantity
  // available to generate in the random, if not has a default value
  function randomizeBills(denominations, maxQuantity = 10) {
    return denominations.map(denomination =>
      Object.assign({}, denomination, { quantity: Math.floor((Math.random() * maxQuantity) + 1)}));
  }

  // initialize the cash register balance
  function initializeBalance(denominations) {
    bills = randomizeBills(denominations);
    for (let i = 0; i < bills.length; i++) {
      balance += bills[i].quantity * bills[i].value;
    }
    initialBalance = parseFloat(balance.toFixed(2)); // Reg the first balance

    fillTableBody(bills, 'tbody-balance');
    generateCurrentBalance();
    return {
      balance,
      bills
    }
  }

  function calculateChange(change) {
    let changeDetail = {
      bills: [],
      change
    };
    let remaining = change;
    for (let i = 0; i < bills.length; i++) {
      // value fits on the denomination & have bills of that denomination
      if (remaining >= bills[i].value && bills[i].quantity > 0) {
        // how much of the remaining could be payed with that denomination
        const possibleAmount = Math.floor(remaining / bills[i].value);
        // real amount that can be dispensed with the current inventory of bills
        const amount = possibleAmount - calculateAvailableMount(possibleAmount, bills[i].quantity);

        bills[i].quantity -= amount;
        remaining -= amount * bills[i].value;
        changeDetail.bills.push({ denomination: bills[i].value, quantity: amount });
      }
    }
    return changeDetail;
  }

  // returns how is the remaining, paying the amount with the current bill quantity
  function calculateAvailableMount(amount, billQuantity) {
    let remaining = amount;
    let quantity = billQuantity;
    while (quantity > 0) {
      if (remaining === 0) {
        break;
      }
      remaining --;
      quantity --;
    }
    return remaining;
  }


  function validateEntries(price, cash) {
    let validationResult = {
      msg: '',
      isValid: true
    };

    const payment = cash - price;

    // not empty values
    if(price === '' || cash === '') {
      validationResult.msg = ERROR_MSG.INVALID_ENTRIES;
      validationResult.isValid = false
    } else if (payment < 0) {
      validationResult.msg = ERROR_MSG.NOT_ENOUGH_CASH;
      validationResult.isValid = false

    } else if (payment > balance) {
      validationResult.msg = ERROR_MSG.INSUFICIENT_FUNDS;
      validationResult.isValid = false
    }
    return validationResult;
  }

  function updateValues(price) {
    sold += parseFloat(price);
    balance += parseFloat(price);
    balance = balance.toFixed(2);
  }

  //======================Actions======================
  function onPay() {
    hideElement('change-error');
    const price = document.getElementById('price').value;
    const cash = document.getElementById('cash').value;

    const payment = validateEntries(price, cash);
    payment.isValid ?
      showResult(price, cash) :
      showError(payment.msg);
  }

  function onReport() {
    const report = [{
      initialBalance: `$${initialBalance}`,
      sold: `$${sold}`,
      balance: `$${balance}`
    }]
    fillTableBody(report, 'tbody-square');
    // hide other sections
    hideElement('results-section');
    hideElement('cash-register-form');
    // show report section
    document.getElementById('report-section').classList.remove('hidden');
  }

  //======================DOM interactions functions======================
  function showError(errorMsg) {
    const errorMsgBox = document.getElementById('change-error');
    errorMsgBox.innerHTML = errorMsg;
    errorMsgBox.classList.remove('hidden');
  }

  function showResult(price, cash) {
    document.getElementById('results-section').classList.remove('hidden');
    const changeToDispense = parseFloat((cash - price).toFixed(2));
    const detail = calculateChange(changeToDispense);
    updateValues(price);
    document.getElementById('result-box').innerHTML = `Change Due: $${detail.change}`;

    // if are details to show
    if (detail.change > 0) {
      fillTableBody(detail.bills, 'tbody-result');
    }

    fillTableBody(bills, 'tbody-balance');
    generateCurrentBalance();
    hideElement('cash-register-form');
  }

  // fill dinamically the body of a table with an array of objects and the given id
  function fillTableBody(rows, tbId) {
    const tbody = document.getElementById(tbId);
    tbody.innerHTML = ''; // clear the content
    let tr = '';
    // keys to use on each row
    const keys = rows[0] && Object.keys(rows[0]);
    let j = 0;
    // generate rows
    for (let i = 0; i < rows.length; i++) {
      tr = document.createElement('tr');
      // generate columns for each row
      for (j = 0; j < keys.length; j++) {
        td = document.createElement('td');
        td.innerHTML = rows[i][keys[j]];
        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    }
  }

  function generateCurrentBalance() {
    const balanceLabel = `Current Balance: ${parseFloat(balance).toFixed(2)}`
    document.getElementById('current-balance').innerHTML = balanceLabel;
  }

  function hideElement(id) {
    document.getElementById(id).classList.add('hidden');
  }

initializeBalance(DENOMINATIONS);
return {
  onPay,
  onReport
}

})()
