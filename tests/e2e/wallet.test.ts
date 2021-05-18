import testWallets from '../testWallets'
import { createBrowser, importWallet, takeScreenshot, timeOut } from './utils'

describe('Wallet page testing', () => {

  it('the balances must be displayed and updated correctly', async () => {
    const { browser, page } = await createBrowser()
    const arrOfWords = testWallets.eth.seedPhrase.split(' ')

    try {
      await importWallet(page, arrOfWords)

      await page.waitForSelector('#walletRowUpdateBalanceBtn')
      await page.waitForSelector('#walletRowCryptoBalance')

      const balances = await page.$$eval('#walletRowCryptoBalance', (balanceTags) => {
        return balanceTags.map((tag) => tag.textContent)
      })

      expect(balances).toBeDefined()

      balances.forEach((strBalance) => {
        expect(Number(strBalance)).not.toBeNaN()
      })

      const balanceUpdateBtns = await page.$$('#walletRowUpdateBalanceBtn')
      
      balanceUpdateBtns.forEach((btn) => btn.click())

      await timeOut(300)

      balances.forEach((strBalance) => {
        expect(Number(strBalance)).not.toBeNaN()
      })
    } catch (error) {
      await browser.close()
      console.error(error)
      expect(false).toBe(true)
    }
  })

})