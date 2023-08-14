import { toast } from 'react-toastify';

export default (text, type) => toast[type](text);
