import React from 'react'
import Auth from '~/components/Auth'
import Logo from '~/components/Logo'

export default props => (<header className="header">
    <Logo />
    <Auth web3={ props.web3 } />
</header>)
