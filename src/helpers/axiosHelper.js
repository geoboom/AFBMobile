import axios from 'axios';
import { REQUEST_TIMEOUT_MS } from '../constants';

const request = async (args) => {
  const source = axios.CancelToken.source();
  const timer = setTimeout(() => {
    source.cancel('Request timeout.');
  }, REQUEST_TIMEOUT_MS);
  try {
    const response = await axios({ ...args, cancelToken: source.token });
    clearTimeout(timer);
    return response;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
};

const handleError = (error) => {
  if (error.response) {
    return error.response.data;
  }
  if (error.request) {
    return error.request;
  }
  return error.message;
};

export default {
  request,
  handleError,
};
