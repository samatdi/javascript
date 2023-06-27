var targetE1 = document.querySelectorAll("#printZone > table:nth-child(2) > tbody > tr")

var data = Array.from(targetE1).map(el => {
    const tdArr = el.querySelectorAll('td')
    const name = tdArr[1]?.innerText
    const addr = tdArr[2]?.innerText
    const tel = tdArr[3]?.innerText
    const open = tdArr[4]?.innerText
    return {
        name,
        addr,
        tel,
        open
    }
}).filter(data => data.name != undefined)
// console.log(data)