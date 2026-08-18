import { chromium } from "@playwright/test";
const url = "https://pabloguilh-jhcmnkrj.manus.space/";
const viewports = [[320,568],[390,844],[414,896]];
const net = { offline:false, latency:150, downloadThroughput:(1.6*1024*1024)/8, uploadThroughput:(750*1024)/8, connectionType:"cellular4g" };
const browser = await chromium.launch({headless:true});
for (const [width,height] of viewports) {
  const context = await browser.newContext({viewport:{width,height}});
  const page = await context.newPage();
  await page.addInitScript(() => { window.__lcp=[]; try { new PerformanceObserver(list => { for (const e of list.getEntries()) { const r=e.element?.getBoundingClientRect?.(); window.__lcp.push({time:e.startTime,tag:e.element?.tagName,text:(e.element?.textContent||"").trim().slice(0,100),src:e.element?.currentSrc||e.element?.src||null,rect:r?{x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom}:null,size:e.size}); } }).observe({type:"largest-contentful-paint",buffered:true}); } catch {} });
  const client=await context.newCDPSession(page); await client.send("Network.enable"); await client.send("Network.emulateNetworkConditions",net);
  await page.goto(url,{waitUntil:"load",timeout:120000}); await page.waitForTimeout(2500);
  const result=await page.evaluate(() => ({lcp:window.__lcp, scrollY, innerHeight, scrollHeight:document.documentElement.scrollHeight, agenda:[...document.querySelectorAll("*")].filter(e=>(e.textContent||"").includes("carregando agenda")).slice(0,3).map(e=>({tag:e.tagName,text:e.textContent.trim(),rect:(()=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom}})()}))}));
  console.log(JSON.stringify({viewport:`${width}x${height}`,result})); await context.close();
}
await browser.close();
