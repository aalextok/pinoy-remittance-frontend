
const baseURL = 'http://localhost:8000'; // TODO: move to config
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

const postData = async (url, data = {}) => {
  setAuthorizationHeader();
  const response = await fetch(url, {
    method: 'POST',
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
  post: async (data) => await postData(`${baseURL}/${apiPrefix}/transaction`, data),
};
