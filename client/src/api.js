import axios from "axios";

const API_URL = "http://localhost:3001/api";

const instance = axios.create({
  baseURL: API_URL,
});

const API_ROUTES = {
  PRIVILEGES: {
    ALL: "/privileges",
    USERS: "/privileges/:priv/users",
    REVOKE: "/privilege/revoke",
  },
  ROLES: {
    ALL: "/roles",
    DROP: "/roles/:role",
    USERS: "/roles/:role/users",
    PRIVS: "/roles/:role/privs",
    REVOKE: "/roles/revoke",
  },
  PROFILES: {
    ALL: "/profiles",
    DROP: "/profiles/:profile",
    RES: "/profiles/:profile/res",
    USERS: "/profiles/:profile/users",
    REVOKE: "/profiles/revoke",
  },
  USERS: {
    ALL: "/users",
    DROP: "/users/:profile",
    RES: "/users/:profile/res",
    USERS: "/users/:profile/users",
    REVOKE: "/users/revoke",
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

async function postRequest(targetUrl, data) {
  try {
    const res = await instance.post(targetUrl, data);
    return res.data;
  } catch (err) {
    return err?.response?.data;
  }
}
async function deleteRequest(targetUrl) {
  try {
    const res = await instance.delete(targetUrl);
    return res.data;
  } catch (err) {
    return err?.response?.data;
  }
}

async function putRequest(targetUrl, data) {
  try {
    const res = await instance.put(targetUrl, data);
    return res.data;
  } catch (err) {
    return err?.response?.data;
  }
}
export { getRequest, postRequest, deleteRequest, putRequest, API_ROUTES };
