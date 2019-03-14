import React from 'react'

function withProvider(Component, providers) {
    if (!providers) return Component
    if (!Array.isArray(providers)) providers = [providers]

    const Provider = providers.shift()

    const wrapped = props => (<Provider><Component { ...props } /></Provider>)

    if (providers.length === 0) return wrapped
    return withProvider(wrapped, providers)

}

function withContext(Component, contexts) {
    if (!contexts) return Component
    if (!Array.isArray(contexts)) contexts = [contexts]

    const Context = contexts.shift()

    const wrapped = props => (
        <Context.Consumer>
            { state => (<Component { ...props } { ...state } />) }
        </Context.Consumer>
    )

    if (contexts.length === 0) return wrapped
    return withContext(wrapped, contexts)
}

export {
    withProvider,
    withContext
}
