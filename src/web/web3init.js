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

async function getNetworkType(web3, writer) {
    let networkType

    try {
        networkType = await web3.eth.net.getNetworkType()
    } catch (err) {
        console.log('can\'t detect web3 network type')
        networkType = 'unknown'
        await writer.add(err)
    }

    return networkType
}

export default async function web3Init() {
    const writer = new TextWriter('init')

    await writer.add('initialization')
    await writer.add('browser and web3 detection')



    let provider, web3, defaultAccount, otherDefaultAccount, providerType, ptype



    await writer.add(`seeking provider`)
    if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
        provider = window.web3.currentProvide
        await writer.add(`provider analysis achieved`)
    } else {
        provider = new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/c63d2ec360ce413ea4dc8b10e0cf1fac")
        await writer.add(`provider injection accomplished`)
    }

    try {
        ptype = getProviderType(provider)
        await writer.add(`original provider qualification: ${ ptype }`)
        await writer.add(`original provider host: ${ provider.host }`)
    } catch (err) {
        await writer.add(`error: ${ err.message }`)
    }

    return;

    await writer.add(`configuring web3 portal`)
    web3 = new Web3(provider)


    try {
        ptype = getProviderType(web3.givenProvider)
        await writer.add(`given provider qualification: ${ ptype }`)
        if (web3.givenProvider && web3.givenProvider.host) await writer.add(`given provider host: ${ web3.givenProvider.host }`)
    } catch (err) {
        await writer.add(`error: ${ err.message }`)
    }


    try {
        ptype = getProviderType(web3.currentProvider)
        await writer.add(`given provider qualification: ${ ptype }`)
        if (web3.currentProvider && web3.currentProvider.host) await writer.add(`current provider host: ${ web3.currentProvider.host }`)
    } catch (err) {
        await writer.add(`error: ${ err.message }`)
    }


    await writer.add(`syncing with deep web`)
    await writer.add(`randomizing blockchains`)


    const web3Version = web3.version.api || web3.version
    await writer.add(`version: ${ web3Version }`)


    let isConnected, listening
    if (web3.eth) await writer.add('connection gateway detected')
    if (web3.eth.net) await writer.add('net portal activated')

    // if (web3.eth.net.isListening) await writer.add('listening procedure initiated')
    // if (web3.eth.net.isListening) {
    //     try {
    //         listening = await web3.eth.net.isListening()
    //         await writer.add(`listening: ${ listening }`)
    //     } catch(err) {
    //         await writer.add(`error: ${ err.message }`)
    //     }
    // }

    // if (web3.eth.net.isConnected) await writer.add('connection procedure initiated')
    // if (web3.eth.net.isConnected) {
    //     try {
    //         let connected = await web3.eth.net.isConnected()
    //         await writer.add(`connected: ${ connected }`)
    //     } catch(err) {
    //         await writer.add(`error: ${ err.message }`)
    //     }
    // }

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
        networkType = await getNetworkType(web3, writer)
        await writer.add(`network: ${ networkType }`)
    } catch (err) {
        await writer.add(`error: ${ err.message }`)
    }



    if (window.ethereum) {
        await writer.add(`enabling ethereum`)
        await window.ethereum.enable()
    }



    await writer.add(`sourcing default account`)


    if (web3.eth) await writer.add(`bypass ethereum gateway proxy`)
    if (web3.eth.getAccounts) await writer.add(`accessing user accounts`)
    // try {
    //     if (web3.eth.defaultAccount) await writer.add(`new ${ web3.eth.defaultAccount}`)
    //     web3.eth.defaultAccount = window.web3.eth.defaultAccount
    //     if (web3.eth.defaultAccount) await writer.add(`from window ${ web3.eth.defaultAccount}`)
    // } catch(err) {
    //     await writer.add(`error: ${ err.message }`)
    // }

    let accounts
    try {
        accounts = await new Promise((resolve, reject) => {
            window.web3.eth.getAccounts(async (error, accs) => {
                if (error) {
                    await writer.add(`accounts accessed: ${ error }`)
                } else {
                    await writer.add(`accounts accessed: ${ accs }`)
                }

                if (error) return reject(error)
                return resolve(accs)
            })
        })

    } catch (err) {
        await writer.add(`error1: ${ err.message }`)
    }

    try {
        accounts = await new Promise((resolve, reject) => {
            web3.eth.getAccounts(async (error, accs) => {
                if (error) {
                    await writer.add(`accounts accessed: ${ error }`)
                } else {
                    await writer.add(`accounts accessed: ${ accs }`)
                }

                if (error) return reject(error)
                return resolve(accs)
            })
        })
    } catch (err) {
        await writer.add(`error2: ${ err.message }`)
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
    await writer.end(8000)

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
