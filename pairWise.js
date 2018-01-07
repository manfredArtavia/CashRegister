const pairWise = (() => {

  function onSearch() {
    const target = document.getElementById('wanted').value;
    const arrayStr = document.getElementById('array').value;
    const array = JSON.parse(`[${arrayStr.slice(',')}]`);

    drawResult(searchSum(array, parseFloat(target)));
  }

  function searchSum(array, target) {
    let j = 0;
    let foundIndices = [];
    let pairs = [];
    for (let i = 0; i < array.length; i++) {
      // evaluate the next elements
      for (j = i + 1; j < array.length; j++) {
        // if they match & are not in the selected indices
        if (array[i] + array[j] === target && foundIndices.indexOf(i) === -1) {
          foundIndices.push(i, j);
          // data to show the detail of pairs found
          pairs.push({ first: i, second: j });
          break;
        }
      }
      array[i];
    }
    // get the sum of indices
    return {
      sum: foundIndices.reduce((sum, currentElement) => (sum + currentElement), 0),
      pairs
    };
  }

  function drawResult(result) {
    document.getElementById('pairs-result-section').classList.remove('hidden');
    const pairsDetail = document.getElementById('pairs-detail');

    const pairsSum = document.getElementById('pairs-sum');
    pairsSum.innerHTML = `The sum is ${result.sum}`;

    let strPairs = `Indices: `;
    for (let i = 0; i < result.pairs.length; i++) {
      strPairs += `| ${result.pairs[i].first},${result.pairs[i].second} |`;
    }
    pairsDetail.innerHTML = strPairs;
  }


  return {
    onSearch
  };
})();
