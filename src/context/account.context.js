import React from 'react'

const AccountContext = React.createContext({ 
    nav: []
});

export default props => {
    return (<AccountContext.Provider>
        {props.children}
    </AccountContext.Provider>)
};