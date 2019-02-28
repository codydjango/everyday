import React from 'react'
import { render } from 'react-dom'
import App from './Components/App'
import SwitchNetwork from './components/SwitchNetwork'
import InstallMetamask from './components/InstallMetamask'
import web3Init from './web3init'

import 'babel-polyfill'
import './scss/index.scss'

async function getNetworkType(web3) {
    let networkType
    try {
        networkType = await web3.eth.net.getNetworkType()
        console.log(`network type: ${ networkType }`)
    } catch (err) {
        console.log('can\'t detect web3 network type')
        networkType = 'unknown'
    }

    return networkType
}

(async function init() {
    // figure out web3. we're gonna install our own and use an infura provider
    // if they don't have their own provider set up.
    window.web3 = web3Init(window)

    console.log('web3', window.web3.version.api || window.web3.version)

    // if no metamask ask to install
    if (!window.web3) return render(<InstallMetamask />, document.getElementById('root'))

    // figure out network. If it's not on the mainnet give them a little prompt.
    const networkType = await getNetworkType(window.web3)
    console.log('networkType', networkType)
    if (networkType !== 'main') return render(<SwitchNetwork />, document.getElementById('root'))

    // all good, start the app
    render(<App web3={ web3 } />, document.getElementById('root'))
})()
