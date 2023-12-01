import { GetChats } from "@/lib/database";
import { HasAllKeys } from "@/lib/dict_helper";
import { Filter, ObjectId, Document} from "mongodb";
import { NextRequest, NextResponse } from "next/server";



const KEYS: string[] = [
    "User",
    "Seller"
];

export async function GET(request: NextRequest) {
    const chats = await GetChats();
    const params = request.nextUrl.searchParams;

    const filter: Filter<Document> = {$and: []};

    const user = params.get("user");
    if(user) {
        if(ObjectId.isValid(user)){
        filter.$and?.push({"User": {$eq: ObjectId.createFromHexString(user)}});
        }
    }

    const seller = params.get("seller");
    if(seller){
        if(ObjectId.isValid(seller)){
        filter.$and?.push({"Seller": {$eq: ObjectId.createFromHexString(seller)}});
        }
    }
    if (filter.$and?.length === 0) {
        delete filter.$and;
    }
    const res = await chats.find(filter).toArray();

    return NextResponse.json(
        res,
        {
            status: 200
        }
    );
}

export async function POST(request: NextRequest) {
    const chats = await GetChats();
    const json = await request.json();

    if(!HasAllKeys(json, KEYS)) {
        return NextResponse.json(
            {msg: "Faltan atributos"},
            {
                status: 406
            }
        );
    }
    const userId = json.User;
    const SellerId = json.Seller;

    if(!(ObjectId.isValid(userId)||ObjectId.isValid(SellerId))){
        return NextResponse.json(
            {},
            {
                status: 406
            }
        );
    }



    const result = await chats.insertOne(json);
    const status = result.acknowledged? 201: 500;
    const id = result.insertedId;

    return NextResponse.json(
        {
            id: id
        },
        {
            status: status
        }
    );
}