async function run() {
  const resRaw = await fetch('./Market.Data.csv');
  const res = await resRaw.text();
  const data = processCsv(res);
  const result = calculator(data);
  const tableResult = resultToObject(res, result);
  dataToChart(res, tableResult, data);
  console.table(tableResult);
}

function dataToChart(result, tableResult, forPercent) {
  const allLines = result.split(/\r\n|\n/);
  const headers = allLines[0].split(',');
  for (let j = 1; j < headers.length; j++) {
    const lines = [];

    for (let i = 1; i < allLines.length; i++) {
      let data = allLines[i].split(',');
      let tamp = [];
      tamp.push(new Date(data[0]));
      if (data[j].includes('%')) {
        tamp.push(+BigNumber(parseFloat(data[j])).div(100).toFixed());
      } else {
        tamp.push(+data[j]);
      }
      lines.push(tamp);
    }
    lines.reverse();
    //console.log(lines);
    const chartContainer = document.createElement('div');
    const chart = document.createElement('div');
    const chartWarp = document.createElement('div');
    const name = document.createElement('p');
    const price = document.createElement('p');
    const differ = document.createElement('p');
    const percent = document.createElement('p');
    const info = document.createElement('div');
    const change = document.createElement('div');
    const allChartsContainer = document.querySelector('#allChartsContainer');

    name.textContent = headers[j];
    price.textContent = forPercent[0][j - 1];
    if (tableResult['2022/1/5 20:00'][headers[j]].includes('+')) {
      differ.textContent = `▲${tableResult['2022/1/5 20:00'][headers[j]]}`.replace('+', '');
    } else if (tableResult['2022/1/5 20:00'][headers[j]].includes('-')) {
      differ.textContent = `▼${tableResult['2022/1/5 20:00'][headers[j]]}`.replace('-', '');
    } else {
      differ.textContent = `${tableResult['2022/1/5 20:00'][headers[j]]}`;
    }

    tableResult['2022/1/5 20:00'][headers[j]].includes('%')
      ? (percent.textContent = `${BigNumber(parseFloat(tableResult['2022/1/5 20:00'][headers[j]]))
          .div(lines[lines.length - 1][1] * 100)
          .toFixed(2)}%`)
      : (percent.textContent = `${BigNumber(parseFloat(tableResult['2022/1/5 20:00'][headers[j]]))
          .div(lines[lines.length - 1][1])
          .toFixed(2)}%`);

    allChartsContainer.appendChild(chartContainer);
    info.appendChild(name);
    info.appendChild(price);
    info.appendChild(change);
    change.appendChild(differ);
    change.appendChild(percent);
    chartContainer.appendChild(info);
    chartContainer.appendChild(chartWarp);
    chartWarp.appendChild(chart);

    chartContainer.setAttribute('class', 'chartContainer');
    info.setAttribute('class', 'info');
    name.setAttribute('class', 'name');
    price.setAttribute('class', 'price');
    change.setAttribute('class', 'change');
    if (parseFloat(tableResult['2022/1/5 20:00'][headers[j]]) > 0) {
      info.classList.add('red');
    } else if (parseFloat(tableResult['2022/1/5 20:00'][headers[j]]) < 0) {
      info.classList.add('green');
    }

    g = new Dygraph(chart, lines, {
      labels: [headers[0], 'Price'],
      digitsAfterDecimal: 4,
      width: 600,
    });
  }
}

function processCsv(res) {
  const allLines = res.split(/\r\n|\n/);
  const headers = allLines[0].split(',');
  const lines = [];

  for (let i = 1; i < allLines.length; i++) {
    const data = allLines[i].split(',');
    const tamp = [];
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
        const differ = BigNumber(parseFloat(data[i][j])).minus(
          BigNumber(parseFloat(data[i + 1][j]))
        );
        if (differ > 0) {
          result.push(`+${differ}%`);
        } else {
          result.push(`${differ}%`);
        }
      } else {
        const differ = BigNumber(data[i][j]).minus(BigNumber(data[i + 1][j]));
        if (differ > 0) {
          result.push(`+${differ}`);
        } else {
          result.push(`${differ}`);
        }
      }
  }
  return result;
}

function resultToObject(res, result) {
  const allLines = res.split(/\r\n|\n/);
  const headers = allLines[0].split(',');
  const lines = {};
  let k = 0;

  for (let i = 1; i < allLines.length - 1; i++) {
    const data = allLines[i].split(',');
    const tamp = {};
    for (let j = 1; j < headers.length; j++) {
      tamp[headers[j]] = result[k];
      k++;
    }
    lines[data[0]] = tamp;
  }
  return lines;
}

run();
