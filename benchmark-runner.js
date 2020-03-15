const puppeteer = require('puppeteer')
const loops = 100
const fs = require('fs')

let stats = {}

const cases = [
  {
    name: '1000 elements with no-css',
    url: `file:///${__dirname}/fixtures/1000-elements/no-css.html`
  },
  {
    name: '1000 elements with > * + *',
    url: `file:///${__dirname}/fixtures/1000-elements/asteriod.html`
  },
  {
    name: '1000 elements with 2 > * + *',
    url: `file:///${__dirname}/fixtures/1000-elements/two-asteriod.html`
  },
  {
    name: '1000 elements with 4 > * + *',
    url: `file:///${__dirname}/fixtures/1000-elements/four-asteriod.html`
  },
  {
    name: '1000 elements with > .child + .child',
    url: `file:///${__dirname}/fixtures/1000-elements/class.html`
  },
  {
    name: '1000 elements with > .child',
    url: `file:///${__dirname}/fixtures/1000-elements/one-child.html`
  },
  {
    name: '10000 elements with no-css',
    url: `file:///${__dirname}/fixtures/10000-elements/no-css.html`
  },
  {
    name: '10000 elements with > * + *',
    url: `file:///${__dirname}/fixtures/10000-elements/asteriod.html`
  },
  {
    name: '10000 elements with 2 > * + *',
    url: `file:///${__dirname}/fixtures/10000-elements/two-asteriod.html`
  },
  {
    name: '10000 elements with 4 > * + *',
    url: `file:///${__dirname}/fixtures/10000-elements/four-asteriod.html`
  },
  {
    name: '10000 elements with > .child + .child',
    url: `file:///${__dirname}/fixtures/10000-elements/class.html`
  },
  {
    name: '10000 elements with > .child',
    url: `file:///${__dirname}/fixtures/10000-elements/one-child.html`
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
  let count = loops
  while(count-- > 0) {
    for (let i = 0; i < cases.length; i++) {
      await runCase(cases[i])
    }
  }
}

function mapSecToReadableMs (seconds) {
  return (seconds * 1000)
    .toLocaleString('en', {minimumFractionDigits: 2, maximumFractionDigits: 2})
    .padStart(8, ' ') + 'ms'
}

function logResult () {
  let writeStream = fs.createWriteStream(`results/${new Date().toISOString()}.txt`);
  
  writeStream.write(`loop ${loops} times \n\n`)
  Object.entries(stats).forEach(([caseName, totalTime]) => {
    const result = `${mapSecToReadableMs(totalTime / loops)} - ${caseName}`
    writeStream.write(result + '\n');
    console.log(result)
  })
  writeStream.close()
}

Promise.resolve()
  .then(start)
  .then(logResult)
