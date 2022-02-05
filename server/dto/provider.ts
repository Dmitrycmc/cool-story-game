import { Collection, Filter, MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const clusterName = "cluster0";
const dbLogin = "admin";
const { DB_PASSWORD, NODE_ENV } = process.env;

export type Action = (collection: Collection) => Promise<any>;

export class Provider<T> {
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

    find = (filter: Filter<T> = {}): Promise<T[]> =>
        this.do((collection) => collection.find(filter).toArray());

    findById = (id: string): Promise<T> =>
        this.do((collection) => collection.findOne({ _id: new ObjectId(id) }));

    insertOne = (room: T): Promise<string> =>
        this.do((collection) =>
            collection.insertOne(room).then((a) => a.insertedId.toJSON())
        );

    deleteAll = (): Promise<void> =>
        this.do((collection) => collection.deleteMany({}));
}
