import axios from 'axios';
import pathh from './path';
axios.defaults.baseURL = `${pathh}`;

export default axios;