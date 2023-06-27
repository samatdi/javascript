// 자바 변수선언
/* var
let
const */
// 비동기 동기

/* const main = () =>{
    console.log('main fn')    
} */

// 로직을 액션별로 나눈 것은 디버깅 할 때 편하기 때문
// 내가 만든 코드도 나중에 보면 못알아 봄 

import {launch, goto, checkPopup, evalSido,evalSigungu,closeAlert, getPageLength, getData, writeFile} from './module/crawler.js'

async function main(){
    await launch('seoul','kangnam_gu')
    await goto('https://www.pharm114.or.kr/main.asp') 
    await checkPopup()
    await evalSido()
    await evalSigungu()
    await closeAlert()
    await getPageLength()
    await getData()
    writeFile()
    process.exit(1)
}
    
main()

