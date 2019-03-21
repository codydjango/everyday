import Web3 from 'web3'
import TextWriter from '~/utilities/TextWriter'

function getProviderType(provider) {
    if (provider.isMetaMask) return 'metamask(1)'
    if (provider.isTrust) return 'trust'
    if (providerisGoWallet) return 'goWallet'
    if (provider.isAlphaWallet) return 'alphaWallet'
    if (provider.isStatus) return 'status'
    if (provider.isToshi) return 'coinbase'
    if (typeof window.__CIPHER__ !== 'undefined') return 'cipher'
    if (provider.host && provider.host.indexOf('infura') !== -1) return 'infura'
    if (provider.host && provider.host.indexOf('localhost') !== -1) return 'localhost'
    if (window.ethereum && window.ethereum.isMetaMask) return 'metamask(2)'

    return 'unknown'
}

async function getNetworkType(web3) {
    let networkType

    try {
        networkType = await web3.eth.net.getNetworkType()
    } catch (err) {
        console.log('can\'t detect web3 network type')
        networkType = 'unknown'
    }

    return networkType
}

export default async function web3Init() {
    const writer = new TextWriter('init')

    await writer.add('initialization')
    await writer.add('browser and web3 detection')
    let provider, web3, defaultAccount, otherDefaultAccount, providerType
    await writer.add(`seeking provider`)
    if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
        // Web3 browser user detected. You can now use the provider.
        // if (window.ethereum) await writer.add(`found ethereum`)
        provider = window.web3.currentProvider
        providerType = getProviderType(provider)
        await writer.add(`identified provider: ${ providerType }`)
    } else {
        provider = new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/c63d2ec360ce413ea4dc8b10e0cf1fac")
        providerType = getProviderType(provider)
        await writer.add(`integrating with infura socket pipeline`)
    }


    await writer.add(`configuring web3`)
    window.web3 = web3 = new Web3(provider)
    provider = window.web3.currentProvider

    await writer.add(`host: ${ provider.host }`)
    await writer.add(`syncing with deep web`)
    await writer.add(`randomizing blockchains`)
    const web3Version = web3.version.api || web3.version
    await writer.add(`version: ${ web3Version }`)

    let isConnected, listening

    if (web3.eth) await writer.add('connection gateway detected')
    if (web3.eth.net) await writer.add('net portal activated')
    if (web3.eth.net.isListening) await writer.add('listening procedure initiated')
    if (web3.eth.net.isConnected) await writer.add('connection procedure initiated')

    try {
        listening = await web.eth.net.isListening()
        await writer.add(listening)
    } catch(err) {
        await writer.add(err.message)
    }

    try {
        let connected = await web.eth.net.isConnected()
        await writer.add(connected)
    } catch(err) {
        await writer.add(err.message)
    }

    await writer.add(`connected (1): ${ provider.connected }`)
    await writer.add(`connected (2): ${ provider.isConnected }`)

    isConnected = provider.connected || provider.isConnected

    if (typeof isConnected === 'function') {
        await writer.add(`forcing connection`)

        try {
            isConnected = icConnected()
        } catch (err) {
            await writer.add(err.message)
        }

    }

    isConnected = isListening

    await writer.add(`connected: ${ isConnected }`)
    await writer.add(`configuring darknet proxy`)

    const networkType = await getNetworkType(web3)
    await writer.add(`network: ${ networkType }`)

    if (window.ethereum) {
        await writer.add(`enabling ethereum`)
        await window.ethereum.enable()
    }

    await writer.add(`sourcing default account`)

    try {
        if (web3.eth) await writer.add(`bypass ethereum gateway proxy`)
        if (web3.eth.getAccounts) await writer.add(`accessing user accounts`)
        const accounts = await web3.eth.getAccounts()
        if (accounts && accounts.length > 0) {
            await writer.add(`accounts accessed: ${ accounts.length }`)
            defaultAccount = accounts[0]
            await writer.add(`${ defaultAccount }`)
        } else {
            await writer.add(`accounts denied`)
            defaultAccount = null
        }
    } catch(err) {
        await writer.add(`${ err.message }`)
    }

    await writer.add('program initialization complete')
    await writer.end(3000)

    return {
        web3,
        web3Version,
        providerType,
        isConnected,
        networkType,
        defaultAccount
    }
}
