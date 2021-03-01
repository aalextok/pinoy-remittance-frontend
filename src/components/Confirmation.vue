<template>
  <div class="card">
    <div class="card-content">
      <div class="content">
        <form @submit.prevent="submit">
            <div class="field is-horizontal">
              <div class="field-body is-justify-content-space-between">
                <div class="field">
                  <div class="control has-text-right">
                    <button type="submit" class="button is-primary" :class="[isSaving ? 'is-loading' : '']">
                      Request money transfer
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { TransactionApi } from './../services/ApiRequest';
import useAPI from './../composables/useAPI';

export default {
  name: 'Confirmation',
  props: [ 'lang', 'data' ],
  setup: ({ lang, data }) => {

    // TODO: display transaction details
    const { isLoading: isSaving, errorMessage, call, resetError } = useAPI();

    const submit = () => {
      console.log(data)
      call({ callable: TransactionApi.post, data }).then(result => {
        console.log(result);
      });
    };
    return {
      isSaving,
      errorMessage,

      lang,
      submit
    };
  }
}
</script>