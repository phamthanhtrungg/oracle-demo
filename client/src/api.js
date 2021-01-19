import axios from "axios";

const API_URL = "http://localhost:3001/api";

const instance = axios.create({
  baseURL: API_URL,
});

const API_ROUTES = {
  PRIVILEGES: {
    ALL: "/privileges",
    USERS: "/privileges/:priv/users",
  },
};

async function getRequest(targetUrl) {
  try {
    const res = await instance.get(targetUrl);
    return res.data;
  } catch (err) {
    return err?.response?.data;
  }
}

export { getRequest, API_ROUTES };