const BigNumber = require('bignumber.js')

async function run() {
  const fs = require('fs').promises;
  const res = await fs.readFile('./Market.Data.csv', 'utf8', (err, data) => {
    if (err) return console.error(err);
    return data;
  });
  const data = processCsv(res);
  const result = calculator(data);
  const tableResult = resultToObject(res, result);
  console.log(tableResult);
}
run();

function processCsv(res) {
  const allLines = res.split(/\r\n|\n/);
  const headers = allLines[0].split(',');
  const lines = [];

  for (let i = 1; i < allLines.length; i++) {
    let data = allLines[i].split(',');
    let tamp = [];
    for (let j = 1; j < headers.length; j++) {
      tamp.push(data[j]);
    }
    lines.push(tamp);
  }
  return lines;
}

function calculator(data) {
  const result = [];
  for (let i = 0; i < data.length - 1; i++) {
    for (let j = 0; j < data[i].length; j++)
      if (data[i][j].includes('%')) {
        result.push(
          `${BigNumber(parseFloat(data[i][j])).minus(BigNumber(parseFloat(data[i + 1][j])))}%`
        );
      } else {
        result.push(`${BigNumber(data[i + 1][j]).minus(BigNumber(data[i ][j]))}`);
      }
  }
  return result;
}

function resultToObject(res, result) {
  const allLines = res.split(/\r\n|\n/);
  const headers = allLines[0].split(',');
  const lines = {};
  let k = 0;

  for (let i = 1; i < allLines.length -1; i++) {
    const data = allLines[i].split(',');
    const tamp = {};
    for (let j = 1; j < headers.length; j++) {
      tamp[headers[j]] = result[k];
      k++;
    }
    lines[data[0]] = tamp;
  }
  return lines
}
