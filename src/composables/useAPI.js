import { ref } from 'vue';

const useAPI = () => {
  const isLoading = ref(false);
  const errorMessage = ref('');

  const call = async ({ callable, data }) => {
    isLoading.value = true;
    errorMessage.value = '';
    let response = {};
    try {
      response = await callable(data);
    } catch (error) {
      errorMessage.value = error.message;
    } finally {
      isLoading.value = false;
    }
    if (!!errorMessage.value) {
      throw new Error(errorMessage.value);
    }
    return response;
  };

  const resetError = () => {
    errorMessage.value = '';
  };

  return {
    call,
    resetError,

    isLoading,
    errorMessage,
  };
};

export default useAPI;