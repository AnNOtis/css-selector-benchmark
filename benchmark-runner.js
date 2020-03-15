const puppeteer = require('puppeteer')
const times = 100
const fs = require('fs')

let stats = {}

const cases = [
  {
    name: 'no-css',
    url: `file:///${__dirname}/fixtures/no-css.html`
  },
  {
    name: '> * + *',
    url: `file:///${__dirname}/fixtures/asteriod.html`
  },
  {
    name: 'extra > * + *',
    url: `file:///${__dirname}/fixtures/two-asteriod.html`
  },
  {
    name: '> .child + .child',
    url: `file:///${__dirname}/fixtures/class.html`
  },
  {
    name: '> .child',
    url: `file:///${__dirname}/fixtures/one-child.html`
  },
]

async function runCase ({name, url}) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const devtool = await page.target().createCDPSession()
  await devtool.send('Emulation.setCPUThrottlingRate', { rate: 4 }) // CPU 4x slower
  await page.goto(url);
  const { RecalcStyleDuration } = await page.metrics();
  stats[name] = stats[name] || 0
  stats[name] += RecalcStyleDuration
  await browser.close();
}


async function start () {
  let count = times
  while(count-- > 0) {
    for (let i = 0; i < cases.length; i++) {
      await runCase(cases[i])
    }
  }
}

function logResult () {
  let writeStream = fs.createWriteStream(`results/${new Date().toISOString()}.txt`);
  
  Object.entries(stats).forEach(([caseName, totalTime]) => {
    const result = `${totalTime / times} (${caseName})`
    writeStream.write(result + '\n');
    console.log(result)
  })
  writeStream.close
}

Promise.resolve()
  .then(start)
  .then(logResult)
