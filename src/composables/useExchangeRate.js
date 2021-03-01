import { ref } from 'vue';
import { format, parse, parseISO } from 'date-fns';
import { ExchangeRateApi } from './../services/ApiRequest';

const exchangeRate = ref({
  bank: {},
  remittance: {}
});
const recentRates = ref([]);
const rateExists = ref(false);

const useExchangeRate = () => {

  const loadExchangeRateData = () => {
    ExchangeRateApi.getActiveAndRecent().then(response => {
      const { 
        active: { 
          bank: { 
            peso: bankPeso, 
            baht: bankBaht 
          } = { }, 
          remittance: {
            peso: remittancePeso,
            baht: remittanceBaht
          } = { } 
        } = {},
        recent = []
      } = response;
      if (!!bankPeso && !!remittancePeso) {
        rateExists.value = true;
        exchangeRate.value = {
          bank: { peso: bankPeso, baht: bankBaht },
          remittance: { peso: remittancePeso, baht: remittanceBaht }
        };
      }
      recentRates.value = recent.map(row => {
        const { id, baht: _baht, peso: _peso, type, date: _date, created_at: createdAt } = row;
        return {
          id,
          baht: _baht,
          peso: _peso,
          type,
          date: format(parse(_date, 'yyyy-MM-dd', new Date()), 'PP'),
          createdAt: format(parseISO(createdAt), 'yyyy-MM-dd HH:mm:ss'),
        };
      });
    }).catch(error => {
  
    });
  };

  return {
    rateExists,
    exchangeRate,
    recentRates,
    loadExchangeRateData,
  };
};

export default useExchangeRate;