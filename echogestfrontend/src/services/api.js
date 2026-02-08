import axios from "axios";

const api = axios.create({
  baseURL: "https://echogestapp.onrender.com", // backend later
});

export default api;