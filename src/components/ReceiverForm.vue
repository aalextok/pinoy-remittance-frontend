<template>
  <div class="card">
    <div class="card-content">
      <div class="content">
        <form @submit.prevent="next">
          <div class="field is-horizontal" v-if="receivers.length > 0">
            <div class="field-body">
              <div class="field">
                <div class="select">
                  <select v-model="receiverId" @change="onReceiverSelect" >
                    <option :key="0" :value="0">-- {{ translation.existing_receivers[lang] }} --</option>
                    <option v-for="receiver in receivers" :key="receiver.id" :value="receiver.id">
                      {{ receiver.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-body">
              <div class="field">
                <p class="control has-icons-left">
                  <input class="input" v-model="name" type="text" v-bind:placeholder="translation.receiver_name[lang] + ' *'" >
                  <span class="icon is-small is-left">
                    <i class="fa fa-address-card"></i>
                  </span>
                  <span class="help is-info">{{ translation.receiver_name[lang] }}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-body">
              <div class="field">
                <p class="control has-icons-left">
                  <input class="input" v-model="phone" type="text" v-bind:placeholder="translation.telephone[lang] + ' *'" >
                  <span class="icon is-small is-left">
                    <i class="fas fa-phone"></i>
                  </span>
                  <span class="help is-info">{{ translation.telephone[lang] }}</span>
                </p>
              </div>
              <div id="date_of_birth" class="field">
                <p class="control has-icons-left">
                  <datepicker v-model="dateOfBirth" :startingView="'year'" />
                  <span class="icon is-small is-left">
                    <i class="fa fa-calendar"></i>
                  </span>
                  <span class="help is-info">{{ translation.receiver_date_of_birth[lang] }}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-body">
              <div class="field">
                <p class="control">
                  <textarea class="textarea" v-model="address" v-bind:placeholder="translation.receiver_address[lang] + ' *'" ></textarea>
                  <span class="help is-info">{{ translation.receiver_address[lang] }}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-body is-flex is-justify-content-space-between">
              <button type="button" class="button is-ghost" @click="next('back')" >
                <i class="fas fa-angle-left"></i>
              </button>
              <button type="submit" class="button is-ghost" v-bind:disabled="submitIsDisabled" >
                <i class="fas fa-angle-right"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { format } from 'date-fns';
import translation from './../translation';
import Datepicker from 'vue3-datepicker';
// import vSelect from 'vue-select';
import useAPI from './../composables/useAPI';
import useAuth from './../composables/useAuth';
import { CustomerApi } from './../services/ApiRequest';

export default {
  name: 'ReceiverForm',
  components: { 
    Datepicker, 
    // vSelect 
  },
  props: [ 'lang', 'data' ],
  emits: [ 'nextStep' ],
  setup: ({ lang, data = {} }, { emit }) => {
    // when receiver selected, fill all fields
    // when receiver deselected, empty all fileds
    // if receiver is selected and any field is edited, deselect receiver, but keep data in fields

    const dateFormat = 'yyyy-MM-dd';
    const submitIsDisabled = ref(true);
    const { isLoggedIn } = useAuth();

    const { receiver = {} } = data;

    const name = ref(receiver.name || null);
    const address = ref(receiver.address || null);
    const dateOfBirth = ref(!!receiver.date_of_birth ? new Date(receiver.date_of_birth) : null);
    const phone = ref(receiver.phone || null);
    const receiverId = ref(0);

    const receivers = ref([]);

    const isSubmitDisabled = () => !(!!name.value && !!address.value && !!dateOfBirth.value && !!phone.value);

    onMounted(() => {
      const datepickerElementDate = document.getElementById('date_of_birth').getElementsByClassName('v3dp__datepicker')[0];
      const inputElementDate = datepickerElementDate.getElementsByTagName('input')[0];
      inputElementDate.setAttribute('class', 'input');
      inputElementDate.setAttribute('placeholder', `${translation.receiver_date_of_birth[lang]} *`);

      submitIsDisabled.value = isSubmitDisabled();

      if (isLoggedIn.value) {
        const { call } = useAPI();
        call({ callable: CustomerApi.getReceivers }).then(result => {
          receivers.value = result;
          receiverId.value = ref(receiver.id || 0);
        });
      }
    });

    const onReceiverSelect = () => {
      if (receiverId.value > 0) {
        const _receiver = receivers.value.find(_r => _r.id === receiverId.value);
        name.value = _receiver.name;
        address.value = _receiver.address;
        phone.value = _receiver.phone;
        if (!!_receiver.date_of_birth) {
          dateOfBirth.value = new Date(_receiver.date_of_birth);
        }
      } else {
        name.value = null;
        address.value = null;
        dateOfBirth.value = null;
        phone.value = null;
      }
    };

    watch([ name, address, dateOfBirth, phone, receiverId ], (values, prevValues) => {
      const [ _name, _address, _dbo, _phone, _receiverId ] = values;
      const [ _prevName, _prevAddress, _prevDbo, _prevPhone, _prevReceiverId ] = prevValues;
      submitIsDisabled.value = !(!!_name && !!_address && !!_dbo && !!_phone);
      
      // Diselect receiver if any field has changed:
      const idChanged = !!_receiverId && !!_prevReceiverId && _receiverId !== _prevReceiverId;
      const nameChanged = !!_prevName && _name !== _prevName;
      const addressChanged = !!_prevAddress && _address !== _prevAddress;
      const phoneChanged = !!_prevPhone && _phone !== _prevPhone;
      const dboChanged = (!!_dbo && !!_prevDbo && format(_dbo, dateFormat) !== format(_prevDbo, dateFormat));
      if (!idChanged && (nameChanged || addressChanged || phoneChanged || dboChanged)) {
        receiverId.value = 0;
      }
    });

    const next = (direction = 'next') => {
      const _data = {
        step: direction === 'back' ? 1 : 3,
        receiver: {
          id: receiverId.value,
          name: name.value,
          date_of_birth: dateOfBirth.value ? format(dateOfBirth.value, dateFormat) : null,
          address: address.value,
          phone: phone.value,
        }
      };
      emit('nextStep', _data);
    };

    return {
      name,
      address,
      dateOfBirth,
      phone,
      receiverId,

      receivers,

      translation,
      lang,
      submitIsDisabled,
      isLoggedIn,

      next,
      onReceiverSelect,
    };
  },
}
</script>
<style scoped>
  .select {
    width: 100%;
  }
  .select select {
    width: 100%;
  }
</style>