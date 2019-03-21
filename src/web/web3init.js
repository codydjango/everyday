import Web3 from 'web3'
import TextWriter from '~/utilities/TextWriter'

function getProviderType(provider) {
    if (provider.isMetaMask) {
        return 'metamask'
    } else if (provider.host && provider.host.indexOf('infura') !== -1) {
        return 'infura'
    } else if (provider.host && provider.host.indexOf('localhost') !== -1) {
        return 'localhost'
    }

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
    await writer.add('initiating')
    let provider, web3, defaultAccount, otherDefaultAccount
    await writer.add(`seeking provider`)
    if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
        // Web3 browser user detected. You can now use the provider.
        if (window.ethereum) await writer.add(`found ethereum`)
        provider = window.ethereum || window.web3.currentProvider
    } else {
        await writer.add(`setting up infura`)
        provider = new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/c63d2ec360ce413ea4dc8b10e0cf1fac")
    }

    const providerType = getProviderType(provider)
    await writer.add(`found provider: ${ providerType }`)
    await writer.add(`host: ${ provider.host }`)
    await writer.add(`setting up web3`)
    window.web3 = web3 = new Web3(provider)
    const web3Version = web3.version.api || web3.version
    await writer.add(`version: ${ web3Version }`)
    const isConnected = (providerType === "metamask") ? provider.isConnected() : provider.connected
    await writer.add(`connected: ${ isConnected }`)
    const networkType = await getNetworkType(web3)
    await writer.add(`network: ${ networkType }`)

    if (providerType === "metamask" && window.ethereum) {
        await writer.add(`enabling ethereum`)
        await window.ethereum.enable()
    }

    await writer.add(`sourcing default account`)
    defaultAccount = (await web3.eth.getAccounts())[0]
    await writer.add(`default account: ${ defaultAccount }`)
    await writer.add('done')
    await writer.end()

    return {
        web3,
        web3Version,
        providerType,
        isConnected,
        networkType,
        defaultAccount
    }
}
