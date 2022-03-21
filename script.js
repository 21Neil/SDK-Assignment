fetch('./Market.Data.csv')
  .then(res => res.text())
  .then(result => processData(result))

function processData(result){
  const allLines = result.split(/\r\n|\n/)
  const headers = allLines[0].split(",")
  const lines = [];

  for(let i = 1; i < allLines.length; i++){
    let data = allLines[i].split(",")
    let tamp = {};
    for(let j = 0; j < headers.length; j++){
      tamp[headers[j]] = data[j]
    }
    lines.push(tamp)
  }
  console.log(lines)
}