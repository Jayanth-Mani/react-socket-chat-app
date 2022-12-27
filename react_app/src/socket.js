import { Manager } from "socket.io-client";

const URL = "http://localhost:3000";
const manager = new Manager(URL, {
  autoConnect: true
});

export default manager;