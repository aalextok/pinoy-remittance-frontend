import { ref } from 'vue';

// TODO: user and token as reactive

const user = JSON.parse(localStorage.getItem('remittance-user'));
const token = localStorage.getItem('remittance-token');
const isLoggedIn = ref(!!user && !!token);

const useAuth = () => {
  return {
    isLoggedIn,
    user,
    token,
  };
};

export default useAuth;