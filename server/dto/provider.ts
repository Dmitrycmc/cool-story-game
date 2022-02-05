import { Collection, MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const clusterName = "cluster0";
const dbLogin = "admin";
const { DB_PASSWORD, NODE_ENV } = process.env;

export type Action = (collection: Collection) => Promise<any>;

export class Provider {
    collectionName: string;

    constructor(collectionName: string) {
        this.collectionName = collectionName;
    }

    protected do = async (action: Action): Promise<any> => {
        const uri = `mongodb+srv://${dbLogin}:${DB_PASSWORD}@${clusterName}.z1twa.mongodb.net/${clusterName}?retryWrites=true&w=majority`;
        const client = new MongoClient(uri);
        await client.connect();

        const collection = client
            .db(NODE_ENV === "test" ? "test" : "prod")
            .collection(this.collectionName);

        const result = await action(collection);

        await client.close();

        return result;
    };
}
