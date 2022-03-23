async function run() {
  const fs = require('fs').promises;
  const res = await fs.readFile('./Market.Data.csv', 'utf8', (err, data) => {
    if (err) return console.error(err);
    return data;
  });
  const data = csvToTable(res);

  function csvToTable(result) {
    const allLines = result.split(/\r\n|\n/);
    const headers = allLines[0].split(',');
    const lines = {};

    for (let i = 1; i < allLines.length; i++) {
      let data = allLines[i].split(',');
      let tamp = {};
      for (let j = 1; j < headers.length; j++) {
        tamp[headers[j]] = data[j];
      }
      lines[data[0]] = tamp;
    }
    return lines;
  }

  console.log(data)
}
run();
