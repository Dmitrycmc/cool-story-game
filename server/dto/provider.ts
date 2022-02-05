import { Collection, MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const clusterName = "cluster0";
const dbLogin = "admin";
const { DB_PASSWORD } = process.env;

export type Action = (collection: Collection) => Promise<any>;

export class Provider {
    collectionName: string;
    envType: string;

    constructor(collectionName: string, envType?: string) {
        this.collectionName = collectionName;
        this.envType = envType || "production";
    }

    protected do = async (action: Action): Promise<any> => {
        const uri = `mongodb+srv://${dbLogin}:${DB_PASSWORD}@${clusterName}.z1twa.mongodb.net/${clusterName}?retryWrites=true&w=majority`;
        const client = new MongoClient(uri);
        await client.connect();

        const collection = client
            .db(this.envType)
            .collection(this.collectionName);

        const result = await action(collection);

        await client.close();

        return result;
    };
}
