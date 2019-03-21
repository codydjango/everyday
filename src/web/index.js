import 'babel-polyfill'
import './scss/index.scss'

import React from 'react'
import { render } from 'react-dom'

import App from './Components/App'
import web3Init from './web3init'
import Message from '~/components/Message'
import Layout from '~/components/Layout'



(async function init() {
    // figure out web3. we're gonna install our own and use an infura provider
    // if they don't have their own provider set up.

    const { providerType, networkType } = await web3Init(window)

    function getInitial() {
        // if no metamask ask to install
        if (providerType !== "metamask") return (<Message
            className="container"
            children="install metamask to continue" />)

        // figure out network. If it's not on the mainnet give them a little prompt.
        if (networkType !== 'main') return (<Message
                className="container"
                children="please switch to the mainnet" />)

        // else return app
        return (<App />)
    }

    render(<Layout>{ getInitial() }</Layout>, document.getElementById('root'))
})()
