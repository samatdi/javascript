import puppeteer from 'puppeteer'
import fs from 'fs'
import axios from 'axios'

const launchConfig = {
    headless: false,
    defaultViewport: null,
    ignoreDefaultArgs: ['--disable-extensions'],
    args:['--no-sandbox','--disable-setuid-sandbox',
    '--disable-notifications','--disable-extenstions']
}
let browser
let page
let sido,sigungu
const lengthSelector = 'body > table:nth-child(2) > tbody > tr > td:nth-child(1) > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(5) > td > table:nth-child(5) > tbody > tr:nth-child(4) > td > table > tbody > tr > td:nth-child(3)'
let pageLength  
let finalData=[]

const launch = async (sidoCode, sigunguCode) => {
  // Launch the browser
  browser = await puppeteer.launch(launchConfig)
  const pages = await browser.pages()
  page = pages[0]
  sido = sidoCode
  sigungu = sigunguCode
}

// 비동기를 위해 async 사용
const goto = async (url)=>{
    await page.goto(url)
}

const checkPopup = async() =>{
    const pages = await browser.pages()
    await pages[1].close()
}

const evalSido = async() => {
    await page.evaluate((sido) => {
        document.querySelector(`#continents > li.${sido} > a`).click()
      },sido)
}

const evalSigungu = async() => {
    const pageSelector = `#continents > li.${sigungu} > a`
    await page.waitForSelector(pageSelector)
    await page.evaluate((pageSelector)=> {
     document.querySelector(pageSelector).click()  
    },pageSelector)
}

const closeAlert = async () => {
    await page.on('dialog', async(dialog) =>{
        await dialog.accept()
    })
}

const getPageLength = async() => {
    await page.waitForSelector(lengthSelector)
    pageLength = await page.evaluate((lengthSelector) => {
        return document.querySelector(lengthSelector).children.length
    }, lengthSelector)
}


const getData = async() =>{
    for (let i=0; i<pageLength; i++) {
        await page.waitForSelector(lengthSelector)
        const jsonData = await page.evaluate((sido,sigungu)=> {
            const targetE1 = document.querySelectorAll("#printZone > table:nth-child(2) > tbody > tr")
            var data = Array.from(targetE1).map(el => {
                const tdArr = el.querySelectorAll('td')
                const name = tdArr[1]?.innerText
                const addr = tdArr[2]?.innerText.replaceAll('\n','')?.replaceAll('t','')
                const tel = tdArr[3]?.innerText
                const open = tdArr[4]?.innerText
                return {
                    name,
                    addr,
                    tel,
                    open,
                    sido,
                    sigungu
                }
        }).filter(data => data.name != undefined)
        // console.log(data)
        return data
        },sido,sigungu)// end eval

        finalData = finalData.concat(jsonData)
        console.log('currentPage',i)
        if(i !=pageLength) {
            //paging click
            await page.evaluate((lengthSelector,i) => {
                document.querySelector(lengthSelector).children[i].click()
            }, lengthSelector, i)
            await page.waitForSelector('#printZone')
        } //end if 
        // console.log(jsonData)

    } //end loop
    browser.close()
} // end getData

const getAddr = () => {
    const url = 'https://dapi.kakao.com/v2/local/search/address.json'
    axios.get(url)
}

const writeFile = async () =>{
    const writePath = `./json/${sido}`
    const exist = fs.existsSync(writePath)

    if(!exist) {
        fs.mkdir(writePath, {recursive: true}, err =>{

        })
    }
    const filePath = `${writePath}/${sigungu}.json`
    const stringData = JSON.stringify(finalData)
    fs.writeFileSync(filePath,stringData)
}

export{
    launch,
    goto,
    checkPopup,
    evalSido,
    evalSigungu,
    closeAlert,
    getPageLength,
    getData,
    writeFile,
}