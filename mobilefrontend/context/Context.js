import React from 'react';

export default React.createContext({
  user: [],
  userTokens: [],
  addUser : (user) => {},
  removeUser : () => {},
  addTokens : (refresh, access) => {}
});