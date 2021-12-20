import React from 'react'

const NavContext = React.createContext({ 
    nav: []
});

export default props => {
    return (<NavContext.Provider>
        {props.children}
    </NavContext.Provider>)
};