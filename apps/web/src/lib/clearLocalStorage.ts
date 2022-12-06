const clearLocalStorage = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('lensfolio.store');
};
export default clearLocalStorage;
