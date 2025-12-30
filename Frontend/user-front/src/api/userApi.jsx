import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost/EthioEvents/Backend/public",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = (user) =>
  API.post("/signup", {
    name: user.name,
    username: user.username,
    dob: user.dob,
    phone_number: user.phone_number,
    email: user.email,
    password: user.password,
  });

export const loginUser = (email, password) =>
  API.post("/login", { email, password });

export const getProfile = (jwt) =>
  API.get("/profile", {
    headers: { Authorization: `Bearer ${jwt}` },
  });

export const updateProfile = (jwt, data) =>
  API.put("/profile", data, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  export const changePassword = (payload, jwt) => 
  API.post("/user/change-password", payload, {
    headers: { Authorization: `Bearer ${jwt}` 
    },
  });


export default API;
