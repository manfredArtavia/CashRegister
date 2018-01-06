const cashRegister = (() => {
  console.log('hello cruel world');

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
  // global bills to operate
  let bill = [];

  // generate an array of bills with the denomination array and optional receives the max quantity
  // available to generate in the random, if not has a default value
  function randomizeBills(denominations, maxQuantity = 8) {
    return denominations.map(denomination =>
      Object.assign({}, denomination, { quantity: Math.floor((Math.random() * maxQuantity) + 1)}));
  }

  // initialize the cash register balance
  function initializeBalance(denominations) {
    bills = randomizeBills(denominations);
    for (let i = 0; i < bills.length; i++) {
      balance += bills[i].quantity * bills[i].value;
    }

    return {
      balance,
      bills
    }
    // console.log(denominations, currentDenominations);
  }

  function onPay() {
    const price = document.getElementById('price').value;
    const cash = document.getElementById('cash').value;
    // const price = 125;
    // const cash = 200;

    const payment = validateEntries(price, cash);
    payment.isValid ?
      showResult(cash - price) :
      showError(payment.msg);

  }

  function calculateChange(change) {
    let changeDetail = {
      bills: [],
      change
    };
    let remaining = change;
    for (let i = 0; i < bills.length; i++) {
      if(remaining >= bills[i].value) {
        const mount = Math.floor(remaining / bills[i].value);
        bills[i].quantity -= mount;
        remaining -= mount * bills[i].value;
        changeDetail.bills.push({ denomination: bills[i].value, quantity: mount });
      }
    }
    console.log(changeDetail);
    return changeDetail;
  }


  function validateEntries(price, cash) {
    let validationResult = {
      msg: '',
      isValid: true
    };

    const payment = cash - price;
    if (payment < 0) {
      validationResult.msg = 'Sorry, not enough cash.';
      validationResult.isValid = false

    } else if (payment > balance) {
      validationResult.msg = 'Sorry, Insufficient Funds .';
      validationResult.isValid = false
    }
    return validationResult;
  }

  //======================DOM interactions functions======================
  function showError(errorMsg) {
    alert(errorMsg);
  }
  function showResult(change) {
    const detail = calculateChange(change);
    alert(`change:${detail.change}`);
  }

initializeBalance(DENOMINATIONS);
return {
  onPay
}

})()
