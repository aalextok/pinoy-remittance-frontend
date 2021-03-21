
// export const baseURL = 'http://localhost:8000'; // TODO: move to config
export const baseURL = 'http://192.168.0.103:8000';
const apiPrefix = 'api';
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

const setAuthorizationHeader = () => {
  const token = localStorage.getItem('remittance-token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
};

const postData = async (url, data = {}, method = 'POST') => {
  setAuthorizationHeader();
  const response = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(data),
    credentials: 'same-origin',
  });
  const json = await response.json();
  if (response.status >= 400) {
    throw new Error(json.message);
  }
  return json;
};

const fetchData = async (url) => {
  setAuthorizationHeader();
  const response = await fetch(url, { headers });
  const json = await response.json();
  if (response.status >= 400) {
    throw new Error(json.message);
  }
  return json;
};

// const fetchCookie = async () => {
//   const response = await fetch(`${baseURL}/sanctum/csrf-cookie`, { headers, credentials: 'same-origin' });
//   console.log(response.headers.get('Set-Cookie'));
//   return;
// };

export const ExchangeRateApi = {
  getActiveAndRecent: async () => await fetchData(`${baseURL}/${apiPrefix}/exchange-rate`),
  post: async (data) => await postData(`${baseURL}/${apiPrefix}/exchange-rate`, data),
};

export const AuthApi = {
  login: async (data) => await postData(`${baseURL}/${apiPrefix}/login`, data),
  logout: async () => await fetchData(`${baseURL}/${apiPrefix}/logout`),
};

export const TransactionApi = {
  get: async (id) => await fetchData(`${baseURL}/${apiPrefix}/transaction/${id}`),
  post: async (data) => await postData(`${baseURL}/${apiPrefix}/transaction`, data),
  edit: async (id, data) => await postData(`${baseURL}/${apiPrefix}/transaction/${id}`, data, 'PUT'),
  list: async () => await fetchData(`${baseURL}/${apiPrefix}/transactions`),
};

export const CustomerApi = {
  get: async (id = '') => await fetchData(`${baseURL}/${apiPrefix}/customer/details/${id}`),
  getReceivers: async (id = '') => await fetchData(`${baseURL}/${apiPrefix}/customer/receivers/${id}`),
  getBankAccounts: async (id = '') => await fetchData(`${baseURL}/${apiPrefix}/customer/bank-accounts/${id}`),
};
