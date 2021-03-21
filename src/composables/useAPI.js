import { ref } from 'vue';

const useAPI = () => {
  const isLoading = ref(false);
  const errorMessage = ref('');

  const call = async ({ callable, data, id }) => {
    isLoading.value = true;
    errorMessage.value = '';
    let response = {};
    try {
      response = !!id && !!data ? await callable(id, data) : !!data ? await callable(data) : !!id ? await callable(id) : await callable();
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