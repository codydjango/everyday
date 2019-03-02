import React from 'react'
import { render } from 'react-dom'
import App from './Components/App'
import SwitchNetwork from './components/SwitchNetwork'
import InstallMetamask from './components/InstallMetamask'
import web3Init from './web3init'

import 'babel-polyfill'
import './scss/index.scss'

(async function init() {
    // figure out web3. we're gonna install our own and use an infura provider
    // if they don't have their own provider set up.
    const { providerType, networkType } = await web3Init(window)

    // if no metamask ask to install
    if (providerType !== "metamask") return render(<InstallMetamask />, document.getElementById('root'))

    // figure out network. If it's not on the mainnet give them a little prompt.
    if (networkType !== 'main') return render(<SwitchNetwork />, document.getElementById('root'))

    // all good, start the app
    render(<App web3={ web3 } />, document.getElementById('root'))
})()
