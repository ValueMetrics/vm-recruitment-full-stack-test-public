import axios from "axios";

const httpBackendClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export default httpBackendClient;
