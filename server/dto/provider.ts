import { Collection, MongoClient } from "mongodb";

const clusterName = "cluster0";
const dbLogin = "admin";
const { DB_PASSWORD } = process.env;

export type Action = (collection: Collection) => any;

export class Provider {
    collectionName: string;

    constructor(collectionName: string) {
        this.collectionName = collectionName;
    }

    do = async (action: Action) => {
        const uri = `mongodb+srv://${dbLogin}:${DB_PASSWORD}@${clusterName}.z1twa.mongodb.net/${clusterName}?retryWrites=true&w=majority`;
        const client = new MongoClient(uri);
        await client.connect();

        const collection = client.db("production").collection("rooms");

        const result = await action(collection);

        await client.close();

        return result;
    };
}
