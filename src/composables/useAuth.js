import { ref } from 'vue';

const user = JSON.parse(localStorage.getItem('remittance-user'));
const token = localStorage.getItem('remittance-token');
const isLoggedIn = ref(!!user && !!token);

const useAuth = () => {
  return {
    isLoggedIn
  };
};

export default useAuth;