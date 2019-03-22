import Web3 from 'web3'
import TextWriter from '~/utilities/TextWriter'

function getProviderType(provider) {
    if (provider.isMetaMask) return 'metamask'
    if (provider.isTrust) return 'trust'
    if (provider.isGoWallet) return 'goWallet'
    if (provider.isAlphaWallet) return 'alphaWallet'
    if (provider.isStatus) return 'status'
    if (provider.isToshi) return 'coinbase'
    if (typeof window.__CIPHER__ !== 'undefined') return 'cipher'
    if (provider.host && provider.host.indexOf('infura') !== -1) return 'infura'
    if (provider.host && provider.host.indexOf('localhost') !== -1) return 'localhost'
    if (window.ethereum && window.ethereum.isMetaMask) return 'metamask(2)'

    return 'unknown'
}





function trustTest(web3, writer) {
    return new Promise(async (resolve, reject) => {
        await writer.add(`special trust configuration`)


        let networkType, accounts


        try {
            await writer.add(`attempt web3.eth.net.getNetworkType`)
            networkType = await new Promise((resolve, reject) => {
                web3.eth.net.getNetworkType())
                resolve(true)
                    // .then(data => resolve(data))
                    // .catch(err => reject(err))
            })
            await writer.add(`result: ${ networkType }`)
        } catch (err) {
            await writer.add(`trust error: ${ err.message }`)
        }


        try {
            await writer.add(`attempt web3.eth.net.getId`)
            networkId = await new Promise((resolve, reject) => {
                web3.eth.net.getId()
                resolve(true)
                    // .then(data => resolve(data))
                    // .catch(err => reject(err))
            })
            await writer.add(`result: ${ networkId }`)
        } catch (err) {
            await writer.add(`trust error: ${ err.message }`)
        }


        try {
            await writer.add(`web3.eth.getAccounts`)
            accounts = await new Promise((resolve, reject) => {
                web3.eth.getAccounts()
                resolve(true)
                    // .then(data => resolve(data))
                    // .catch(err => reject(err))
            })
            await writer.add(`result: ${ accounts }`)
        } catch (err) {
            await writer.add(`trust error: ${ err.message }`)
        }


        await writer.wait(10000 * 60)

        resolve(true)
    })
}


export default async function web3Init() {
    const writer = new TextWriter('init')

    await writer.add('initialization')
    await writer.add('browser and web3 detection')


    let provider, web3, defaultAccount, otherDefaultAccount, providerType, validProvider

    await writer.add(`seeking provider`)


    if (typeof window.ethereum !== 'undefined') await writer.add(`ethereum detected`)
    if (typeof window.web3 !== 'undefined') await writer.add(`web3 detected`)


    if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
        provider = window.web3.currentProvider
    } else {
        provider = new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/c63d2ec360ce413ea4dc8b10e0cf1fac")
        await writer.add(`provider injection accomplished`)
    }


    try {
        providerType = getProviderType(provider)
        await writer.add(`provider qualification: ${ providerType }`)
        if (provider.host) await writer.add(`provider host: ${ provider.host }`)
    } catch (err) {
        await writer.add(`error: ${ err.message }`)
    }


    await writer.add(`configuring web3 portal`)
    web3 = new Web3(provider)


    if (providerType === 'trust') await trustTest(web3, writer)


    await writer.add(`syncing with deep web`)
    await writer.add(`randomizing blockchains`)


    const web3Version = web3.version.api || web3.version
    await writer.add(`version: ${ web3Version }`)


    let isConnected, listening
    if (web3.eth) await writer.add('connection gateway detected')
    if (web3.eth.net) await writer.add('net portal activated')


    isConnected = provider.connected || provider.isConnected


    if (typeof isConnected === 'function') {
        await writer.add(`forcing connection`)
        try {
            isConnected = isConnected()
            await writer.add(`connected: ${ isConnected }`)
        } catch (err) {
            await writer.add(`error: ${ err.message }`)
        }
    } else {
        await writer.add(`connected: ${ isConnected }`)
    }


    let networkType
    await writer.add(`configuring darknet proxy`)
    try {
        await writer.add(`attempt network`)
        networkType = await web3.eth.net.getNetworkType()
        await writer.add(`network: ${ networkType }`)
    } catch (err) {
        await writer.add(`error: ${ err.message }`)
        networkType = 'unknown'
    }


    if (window.ethereum) {
        await writer.add(`enabling ethereum`)
        await window.ethereum.enable()
    }


    await writer.add(`sourcing default account`)


    if (web3.eth) await writer.add(`bypass ethereum gateway proxy`)
    if (web3.eth.getAccounts) await writer.add(`accessing user accounts`)


    let accounts
    try {
        await writer.add(`accounts attempt`)
        accounts = await web3.eth.getAccounts()
    } catch (err) {
        await writer.add(`error: ${ err.message }`)
    }


    if (accounts && accounts.length > 0) {
        await writer.add(`accounts accessed: ${ accounts.length }`)
        defaultAccount = accounts[0]
        await writer.add(`${ defaultAccount }`)
    } else {
        await writer.add(`accounts denied`)
        defaultAccount = null
    }


    await writer.add('program initialization complete')
    await writer.end(1000)


    validProvider = false
    if (defaultAccount) validProvider = true


    window.web3 = web3


    return {
        web3,
        web3Version,
        providerType,
        isConnected,
        networkType,
        defaultAccount,
        validProvider
    }
}
