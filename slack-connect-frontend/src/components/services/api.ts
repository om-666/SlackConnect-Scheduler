import axios from 'axios';

const API = axios.create({
  baseURL: 'https://slackconnect-scheduler.onrender.com',
});

export default API;
