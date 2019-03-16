import axios from 'axios'
import Cookies from 'js-cookie'
import { ENDPOINT, ENVIRONMENT } from '~/settings'


class Comms {
    static parseJwt(token) {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace('-', '+').replace('_', '/')

        return JSON.parse(window.atob(base64))
    }

    static verifyTokenForAccount(token, account) {
        if (!account) return false

        try {
            return (account === Comms.parseJwt(token).account)
        } catch (err) {
            console.log(`Auth error parsing ${ token }`, err)
            return false
        }
    }

    constructor() {
        this.account = null
        this.token = null
    }

    get(url) {
        return axios.get(`${ ENDPOINT }${ url }`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

    post(url, data) {
        return axios.post(`${ ENDPOINT }${ url }`, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

    getCookie(name) {
        return Cookies.get(name)
    }

    setCookie(name, data) {
        Cookies.set(name, data, { secure: (ENVIRONMENT === 'production') })
    }

    clearCookie(name) {
        Cookies.remove(name)
    }

    updateAuth({ account, token }, logout = false) {
        if (logout) {
            this.clearCookie(account)
            account = null
            token = null
        }

        delete axios.defaults.headers.common['Authorization']

        if (account && token && Comms.verifyTokenForAccount(token, account)) {
            this.setCookie(account, token)
            axios.defaults.headers.common['Authorization'] = token
            return true
        } else {
            return false
        }
    }
}

export default new Comms()
