import React from 'react';

export default React.createContext({
  user: null,
  userTokens: [],
  addUser : (user) => {},
  removeUser : () => {},
  addTokens : (refresh, access) => {}
});