fetch('./Market.Data.csv')
  .then(res => res.text())
  .then(result => dataToChart(result));

function dataToChart(result) {
  const allLines = result.split(/\r\n|\n/);
  const headers = allLines[0].split(',');
  for (let j = 1; j < headers.length; j++) {
    const lines = [];

    for (let i = 1; i < allLines.length; i++) {
      let data = allLines[i].split(',');
      let tamp = [];
      tamp.push(new Date(data[0]));
      if (data[j].includes('%')) {
        tamp.push(+(parseFloat(data[j]) / 100).toFixed(4));
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
    const info = document.createElement('div');
    const allChartsContainer = document.querySelector('#allChartsContainer');

    name.textContent = headers[j];
    price.textContent = lines[lines.length - 1][1];

    allChartsContainer.appendChild(chartContainer);
    info.appendChild(name);
    info.appendChild(price);
    chartContainer.appendChild(info);
    chartContainer.appendChild(chartWarp);
    chartWarp.appendChild(chart);

    chartContainer.setAttribute('class', 'chartContainer');
    info.setAttribute('class', 'info');
    name.setAttribute('class', 'name');
    price.setAttribute('class', 'price');

    g = new Dygraph(chart, lines, {
      labels: [headers[0], 'Price'],
      digitsAfterDecimal: 4,
      width: 600,
    });
  }
}
