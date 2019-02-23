import Web3 from 'web3'

export default function web3Init(window) {
    let provider

    if ((typeof window.ethereum !== 'undefined')
    || (typeof window.web3 !== 'undefined')) {
        provider = window['ethereum'] || window.web3.currentProvider
    } else {
        provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/c63d2ec360ce413ea4dc8b10e0cf1fac')
    }

    return new Web3(provider)
}
