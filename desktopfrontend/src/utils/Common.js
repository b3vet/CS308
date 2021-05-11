// return the user data from the session storage
export const getUser = () => {
    const userStr = localStorage.getItem('user') || null;
    if (userStr) return JSON.parse(userStr); //user JSON.parser(userStr) but problematic for the now
    else return null;
  }
   
  // return the token from the session storage
  export const getRefreshToken = () => {
    return localStorage.getItem('refreshToken') || null;
  }

  export const getAccessToken = () => {
    return localStorage.getItem('accessToken') || null;
  }
   
  // remove the token and user from the session storage
  export const removeUserSession = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
  }
   
  // set the token and user from the session storage
  export const setUserSession = (refresh, access, user) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('user', JSON.stringify(user));
  }

  export const saveProducts = (products) => {
    localStorage.setItem('products', JSON.stringify(products));
  }

  export const getProducts = () => {
    return JSON.parse(localStorage.getItem('products')) || null;
  }
