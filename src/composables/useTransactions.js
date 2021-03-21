import { ref } from 'vue';
import { TransactionApi } from './../services/ApiRequest';

const transactions = ref([]);

const useTransactions = () => {
  const loadTransactionsList = () => {
    TransactionApi.list().then(response => {
      transactions.value = response;
    });
  };

  return {
    transactions,
    loadTransactionsList,
  };
};

export default useTransactions;