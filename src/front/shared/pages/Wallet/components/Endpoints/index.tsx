import React from 'react'
import config from 'app-config'
import Href from 'components/Href/Href'

const ApiEndpoint = (props) => {
  const { symbol, isERC20, isBTC, children } = props
  const lowerSymbol = symbol.toLowerCase()
  let api = '.'

  if (isERC20 || lowerSymbol === 'eth') {
    api = config.binance ? config.link.bscscan[0] : config.api.etherscan[0]
  } else if (isBTC) { // btc [pin, sms, multisig]
    api = config.api.bitpay
  } else if (lowerSymbol === 'ghost') {
    api = config.api.ghostscan
  } else if (lowerSymbol === 'next') {
    api = config.api.nextExplorer
  }

  return <Href tab={api}>{children}</Href>
}

const LinkEndpoint = (props) => {
  const {
    symbol,
    address,
    children,
    contractAddress,
    isERC20,
    isBTC,
  } = props
  const lowerSymbol = symbol.toLowerCase()
  let link = '.'

  if (isERC20 || lowerSymbol === 'eth') {
    link = config.binance ? config.link.bscscan : config.link.etherscan
  } else if (isBTC) { // btc [pin, sms, multisig]
    link = config.link.bitpay
  } else if (lowerSymbol === 'ghost') {
    link = config.link.ghostscan
  } else if (lowerSymbol === 'next') { // only mainnet link
    link = config.link.nextExplorer
  }

  return (
    <>
      {lowerSymbol === 'next'
        ? <Href tab={`${link}/#/address/${address}`}>{children}</Href>
        : isERC20
        ? <Href tab={`${link}/token/${contractAddress}?a=${address}`}>{children}</Href>
        : <Href tab={`${link}/address/${address}`}>{children}</Href>
      }
    </>
  )
}

export {
  ApiEndpoint,
  LinkEndpoint,
}
