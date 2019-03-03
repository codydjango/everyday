import Web3 from 'web3'

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
    let provider, web3, enabled, defaultAccount, otherDefaultAccount

    // https://metamask.github.io/metamask-docs/Advanced_Concepts/Provider_API
    if (typeof window.ethereum !== 'undefined'
        || (typeof window.web3 !== 'undefined')) {

          // Web3 browser user detected. You can now use the provider.
        provider = window['ethereum'] || window.web3.currentProvider
    } else {
        provider = new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/c63d2ec360ce413ea4dc8b10e0cf1fac")
    }

    window.web3 = web3 = new Web3(provider)

    if (window.ethereum) {
        defaultAccount = (await window.ethereum.enable())[0]
        otherDefaultAccount = (await web3.eth.getAccounts())[0]

        console.log(`web3 enabled with default account: ${ defaultAccount }`)
        console.log(`web3 enabled with other default account: ${ otherDefaultAccount }`)
        // use the checksum address
        defaultAccount = otherDefaultAccount
    }

    const web3Version = web3.version.api || web3.version
    console.log(`web3 version: ${ web3Version }`)
    const providerType = getProviderType(provider)
    console.log(`web3 provider type: ${ providerType }`)
    const isConnected = (providerType === "metamask") ? provider.isConnected() : provider.connected
    console.log(`web3 provider connected: ${ isConnected }`)
    const networkType = await getNetworkType(web3)
    console.log(`web3 connected network: ${ networkType }`)

    return {
        web3,
        web3Version,
        providerType,
        isConnected,
        networkType,
        defaultAccount
    }
}
