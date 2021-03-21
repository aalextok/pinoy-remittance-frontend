<template>
  <div class="content">

    <div class="notification is-danger is-light" v-if="errorMessage">
      {{ errorMessage }}
      <button class="delete" @click="resetError"></button>
    </div>

    <div v-if="Object.keys(transaction).length > 0">

      <div class="tile is-ancestor">
        <div class="tile is-12 is-parent">
          <div class="tile is-child box notification is-light" :class="'is-' + statusColor[transaction.status]">
            <span>TX#{{ transaction.uuid }}:</span> <span class="tx-status">{{ transaction.status }}</span>
          </div>
        </div>
      </div>
      
      <div class="tile is-ancestor">
        <div class="tile is-12 is-parent">

          <div class="tile is-child box">
            <div class="columns is-mobile is-centered">
              <div class="column has-text-right is-italic">{{ translation.amount_to_send[lang] }}:</div>
              <div class="column has-text-weight-bold">&#3647;{{ transaction.baht }}</div>
            </div>
            <div class="columns is-mobile is-centered">
              <div class="column has-text-right is-italic">{{ translation.amount_to_receive[lang] }}:</div>
              <div class="column has-text-weight-bold">&#8369;{{ transaction.peso }}</div>
            </div>
            <div class="columns is-mobile is-centered">
              <div class="column has-text-right is-italic">{{ translation.exchange_rate[lang] }}:</div>
              <div class="column has-text-weight-bold">&#3647;1 = &#8369;{{ transaction.exchange_rate }}</div>
            </div>
            <div class="columns is-mobile is-centered">
              <div class="column has-text-right is-italic">{{ translation.fee[lang] }}:</div>
              <div class="column has-text-weight-bold">&#3647;{{ transaction.fee }}</div>
            </div>
            <div class="columns is-mobile is-centered">
              <div class="column has-text-right is-italic">{{ translation.posted_at[lang] }}:</div>
              <div class="column has-text-weight-bold">{{ format(new Date(transaction.created_at), 'yyyy-MM-dd HH:mm:ss') }}</div>
            </div>
          </div>

          <div class="tile is-child ">
            <div class="tile is-parent is-vertical">

              <div class="tile is-child box">
                <div class="columns is-mobile is-centered">
                  <div class="column has-text-right is-italic">{{ translation.sender[lang] }}:</div>
                  <div class="column">
                    <div class="has-text-weight-bold">
                      {{ transaction.customer.firstname }} {{ transaction.customer.middlename }} {{ transaction.customer.lastname }}
                    </div>
                    <div>{{ transaction.customer.email }}</div>
                    <div>{{ transaction.customer.phone }}</div>
                  </div>
                </div>
              </div>

              <div class="tile is-child box">
                <div class="columns is-mobile is-centered" v-if="!!transaction.bank_account">
                  <div class="column has-text-right is-italic">{{ translation.bank_account[lang] }}:</div>
                  <div class="column">
                    <div class="has-text-weight-bold">{{transaction.bank_account.account}} {{transaction.bank_account.bank}} </div>
                    <div>{{ transaction.bank_account.name }}</div>
                    <div>{{ transaction.bank_account.phone }}</div>
                  </div>
                </div>
                <div class="columns is-mobile is-centered" v-else-if="!!transaction.receiver">
                  <div class="column has-text-right is-italic">{{ translation.receiver[lang] }}:</div>
                  <div class="column">
                    <div class="has-text-weight-bold">{{transaction.receiver.name}}</div>
                    <div>{{ transaction.receiver.date_of_birth }}</div>
                    <div>{{ transaction.receiver.address }}</div>
                    <div>{{ transaction.receiver.phone }}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>

      <div class="tile is-ancestor" v-if="transaction.status === 'Awaiting'">
        <div class="tile is-parent">
          <div class="tile is-child box notification is-danger is-light">
            <div class="is-flex is-justify-content-space-between">
              <div style="width: 60%" class="make-payment-reminder">
                {{ translation.make_payment[lang] }}:
              </div>
              <div style="width: 30%">
                <img v-bind:src="baseURL + '/promptpay_logo.png'" />
              </div>
            </div>
            <div class="is-flex is-justify-content-space-around">
              <img style="width: 70%" v-bind:src="baseURL + '/promptpay_qr.png'" />
            </div>
          </div>
        </div>
        <div class="tile is-parent">
          <div class="tile is-child box">
            <div class="file-uploader-wrap">
              <p class="file has-name is-boxed">
                <label class="file-label">
                  <input class="file-input" type="file" accept="image/*" @change="readFile">
                  <span class="file-cta" v-if="receipt.dataURL">
                    <img v-bind:src="receipt.dataURL" />
                  </span>
                  <span class="file-cta" v-else :class="[!receipt.dataURL ? 'danger' : '']">
                    <span class="file-icon">
                      <i class="fas fa-upload"></i>
                    </span>
                    <span class="file-label">
                      {{ translation.upload_payment_receipt[lang] }}
                    </span>
                  </span>
                  <span class="file-name" v-if="receipt.name">
                    {{ receipt.name }}
                  </span>
                </label>
              </p>
              <p>
                <button class="button is-primary" @click="uploadReceipt" :class="[isLoading ? 'is-loading' : '']" v-bind:disabled="!receipt.dataURL">
                  {{ translation.upload[lang] }}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';
import useAPI from './../composables/useAPI';
import { TransactionApi, baseURL } from '../services/ApiRequest';
import translation from './../translation';
import { statusColor } from './../miscellaneous';

export default {
  name: 'Transaction',
  props: ['id'],
  setup: ({ id: transactionId }) => {

    const lang = ref(localStorage.getItem('remittance-lang') || 'fil');

    const { call, errorMessage, resetError, isLoading } = useAPI();
    const transaction = ref({});
    const receipt = ref({});

    onMounted(() => {
      call({ callable: TransactionApi.get, id: transactionId }).then(result => {
        transaction.value = result;
      });
    });

    const readFile = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = _event => {
          receipt.value = {
            name: file.name,
            lastModified: file.lastModified,
            size: file.size,
            type: file.type,
            dataURL: reader.result,
          };
        };
        reader.readAsDataURL(file);
      }
    };

    const uploadReceipt = () => {
      const data = {
        payment_receipt: receipt.value,
      };
      call({ callable: TransactionApi.edit, data, id: transactionId }).then(result => {
        console.log(result);
      });
    };

    return {
      transaction,
      receipt,
      statusColor,
      baseURL,
      readFile,
      uploadReceipt,

      errorMessage,
      resetError,
      isLoading,

      lang,
      translation,
      format
    };
  },
}
</script>
<style scoped>
  .tx-status {
    font-weight: bold;
  }
  .make-payment-reminder {
    font-weight: bold;
    font-style: italic;
  }
  .file-name {
    max-width: unset;
  }
  .danger {
    background-color: rgb(254, 236, 240);
    color: rgb(204, 15, 53);
  }
  .file-cta, .file-name {
    white-space: normal;
  }
  .file-uploader-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
</style>