import { Collection, Filter, MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const clusterName = "cluster0";
const dbLogin = "admin";
const { DB_PASSWORD, NODE_ENV } = process.env;

export type Action = (collection: Collection) => Promise<any>;

const convertId = (_id: ObjectId): string => _id.toJSON();

const convert = <T extends { _id: ObjectId }>(raw: T): Omit<T, "_id"> & { id: string } => {
    if (raw === null) {
        return raw;
    }
    const { _id, ...entity } = raw;
    return {
        ...entity,
        id: convertId(_id),
    };
};

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
        this.do((collection) => collection.find(filter).toArray()).then((data) =>
            data.map(convert)
        );

    findById = (id: string): Promise<T | null> =>
        this.do((collection) => collection.findOne({ _id: new ObjectId(id) })).then(convert);

    findOne = (filter: Filter<T>): Promise<T | null> =>
        this.do((collection) => collection.findOne(filter)).then(convert);

    insertOne = (room: T): Promise<string> =>
        this.do((collection) => collection.insertOne(room).then((a) => convertId(a.insertedId)));

    deleteAll = (): Promise<void> => this.do((collection) => collection.deleteMany({}));
}
