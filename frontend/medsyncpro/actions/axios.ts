import axios from "axios";
import {config} from "@/lib/config";

const api = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
});

export default api;
