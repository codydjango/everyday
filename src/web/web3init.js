import Web3 from 'web3'

export default function web3Init(window) {
    if ((typeof window.ethereum !== 'undefined')
    || (typeof window.web3 !== 'undefined')) {
        return new Web3(window['ethereum'] || window.web3.currentProvider)
    }

    return null
}
