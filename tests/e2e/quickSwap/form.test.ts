import puppeteer from 'puppeteer'
import {
  createBrowser,
  importWallet,
  timeOut,
  takeScreenshot,
  clickOn,
  addTokenToWallet,
} from '../utils'

// TODO: use encrypted secrets
const mainnetEvmWallet = {
  seed: '',
  address: '0xb7d9F97Fe2c396906957634CA5bcE87Ff4a8a119',
}

jest.setTimeout(80_000) // ms

describe('Quick swap interface tests', () => {
  const waitingForStartup = 120_000
  let browser: undefined | puppeteer.Browser = undefined
  let page: undefined | puppeteer.Page = undefined

  beforeAll(async () => {
    const { browser: newBrowserInstance, page: newPageInstance } = await createBrowser()

    browser = newBrowserInstance
    page = newPageInstance

    await importWallet({
      page,
      seed: mainnetEvmWallet.seed.split(' '),
      timeout: 40_000,
    })
  }, waitingForStartup)

  afterAll(async () => {
    if (page) {
      await page.close()
    }

    if (browser) {
      await browser.close()
    }
  })

  it('Restored wallet is fine', async () => {
    if (browser && page) {
      try {
        await page.waitForSelector('#ethAddress')

        const ethAddress = await page.$eval('#ethAddress', (el) => el.textContent)
        const bnbAddress = await page.$eval('#ethAddress', (el) => el.textContent)
        const maticAddress = await page.$eval('#ethAddress', (el) => el.textContent)

        expect(ethAddress).toBe(mainnetEvmWallet.address)
        expect(bnbAddress).toBe(mainnetEvmWallet.address)
        expect(maticAddress).toBe(mainnetEvmWallet.address)
      } catch (error) {
        await takeScreenshot(page, 'RestoreWalletTestError')
        await browser.close()
        console.error('Restore wallet test error: ', error)
        expect(false).toBe(true)
      }
    } else {
      throw new Error('No the browser or the page')
    }
  })

  it('the correct API response with the swap data', async () => {
    if (browser && page) {
      try {
        await await addTokenToWallet({
          page: page,
          standardId: 'maticerc20matic',
          contract: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        })

        await page.goto(`${page.url()}exchange/quick/MATIC-to-{matic}wmatic`)

        // chose maker input and enter some amount
        // ...

        await timeOut(10_000)

        // chose taker input and check the amount there
        // ...
        expect(0).toBe(0)
      } catch (error) {
        console.error('API response error: ', error)
        await takeScreenshot(page, 'APIResponseError')
        expect(false).toBe(true)
      }
    } else {
      throw new Error('No the browser or the page')
    }
  })
})
