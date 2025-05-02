import React, {useState, useRef, useEffect} from 'react';

const Context = React.createContext();

export const ContextProvider = props => {
  const [isAuth, setIsAuth] = useState(false);
  const [scrollOn, setScrollOn] = useState(false);
  // false === user
  const [userOrMerchant, setUserOrMerchant] = useState(false);
  const componentIsMounted = useRef(true);

  useEffect(() => {
    // Component did mount & component did update
    console.log(componentIsMounted);
    console.log('Runned');
    return () => {
      // Component will unmount
      console.log('Return runned');
    };
  }, []);

  const setScroll = value => [setScrollOn(value)];
  const settingUserOrMerchant = value => [setUserOrMerchant(value)];

  return (
    <Context.Provider
      value={{
        isAuth: isAuth,
        scrollOn: scrollOn,
        setScroll: setScroll,
        settingUserOrMerchant: settingUserOrMerchant,
      }}>
      {props.children}
    </Context.Provider>
  );
};

export const withAppContext = Component => {
  const AppContextComponent = props => (
    <Context.Consumer>
      {appContextProps => <Component {...appContextProps} {...props} />}
    </Context.Consumer>
  );
  return AppContextComponent;
};
