import axios from "axios";

const trackerApi = axios.create({
  baseURL: "http://localhost:3000/api",
  // baseURL: "https://blog-api.david-konate.fr/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default trackerApi;
