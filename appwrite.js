import { Client, Account, Databases, Storage, ID, Permission, Role , Query  } from "appwrite";

const client = new Client();

client
    .setEndpoint('https://vp.swellty.ovh/v1') // Your API Endpoint 51.91.97.19:8082
    .setProject('app1') // Your project ID
;
const account = new Account(client);
const storage = new Storage(client);

const db = new Databases(client);


export {client, account, storage, ID, db,Permission, Role, Query };

