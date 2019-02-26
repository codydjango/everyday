import axios from 'axios'
import React from 'react'
import Button from '~/components/Button'

import 'babel-polyfill'

class User {
    constructor(none, publicAddress) {
        this.nonce
        this.publicAddress
    }
}

class Auth extends React.Component {
    constructor(props) {
        super(props)

        console.log('auth contructor')
        this.state = { account: null }
        this.web3 = props.web3
        this.registerWithMetamask = this.registerWithMetamask.bind(this)

        this.pingForActiveAccount()
    }

    updateAccount(account) {
        console.log('updateAccount', account)
        this.setState({ account })
    }

    async pingForActiveAccount(callback) {
        const web3 = this.web3
        let account

        try {
            account = (await web3.eth.getAccounts())[0]
            console.log(`user account: ${ account }`)
        } catch (err) {
            console.log('can\'t detect user account')
        }

        this.setState({ account }, () => {
            setInterval(async () => {
                account = (await web3.eth.getAccounts())[0]
                if (account !== this.state.account) {
                    this.setState({ account })
                }
            }, 10000)
        })
    }

    get requestUrl() {
        return `http://localhost:3001/nonce/${ this.state.account }`
    }

    async registerWithMetamask() {
        let nonce
        try {
            const response = await axios.get(this.requestUrl)
            console.log('response', response)
            nonce = response.nonce
        } catch (err) {
            console.log('err', err)
        }

        alert(nonce)
    }


    render() {
        const showUser = () => (<h3>Account: { this.state.account }</h3>)
        const showPrompt = () => (<Button action={ this.registerWithMetamask } text="Login with Metamask" />)

        return (<div className="auth">
            <h2>Authentication</h2>
            { showUser() }
            { showPrompt() }
        </div>)
    }
}

export default Auth

