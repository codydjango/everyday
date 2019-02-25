import React from 'react'
import { render } from 'react-dom'
import App from './Components/App'
import PleaseSwitch from './components/PleaseSwitch'
import web3Init from './web3init'
import { DEBUG } from './settings'

import 'babel-polyfill'
import './scss/index.scss'


(async function init() {
    // figure out web3. we're gonna install our own and use an infura provider
    // if they don't have their own provider set up.
    window.web3 = web3Init(window)
    console.log('web3', window.web3.version.api || window.web3.version)

    // figure out network. If it's not on the mainnet give them a little prompt.
    let networkType
    try {
        networkType = await web3.eth.net.getNetworkType()
        console.log(`network type: ${ networkType }`)
    } catch (err) {
        console.log('can\'t detect web3 network type')
        networkType = 'unknown'
    }

    let userAccount
    try {
        userAccount = (await web3.eth.getAccounts())[0]
        console.log(`user account: ${ userAccount }`)
    } catch (err) {
        console.log('can\'t detect user account')
        userAccount = null
    }

    const user = 'unknown'

    console.log(`debug: ${ DEBUG }`)

    if (DEBUG) {
        render(<App web3={ web3 } user={ user } />, document.getElementById('root'))
    } else {
        render((networkType === 'main') ? (<App web3={ web3 } user={ user }/>) : (<PleaseSwitch />), document.getElementById('root'))
    }
})()
