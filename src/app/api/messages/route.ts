import { GetMessages } from "@/lib/database";
import { HasAllKeys } from "@/lib/dict_helper";
import { Filter, ObjectId, Document} from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const KEYS: string[] = [
    "Message",
    "Sender",
    "Chat"
];

export async function GET(request: NextRequest) {
    const chats = await GetMessages();
    const params = request.nextUrl.searchParams;
    const filter: Filter<Document> = {$and: []};

    const sender = params.get("sender");
    if(sender) {
        if(ObjectId.isValid(sender)){
        filter.$and?.push({"Sender": {$eq: ObjectId.createFromHexString(sender)}});
        }
    }
    const res = await chats.find(filter).sort({Time: -1}).toArray();

    return NextResponse.json(
        res,
        {
            status: 200
        }
    );
}

export async function POST(request: NextRequest) {
    const chats = await GetMessages();
    const json = await request.json();

    if(!HasAllKeys(json, KEYS)) {
        return NextResponse.json(
            {msg: "Faltan atributos"},
            {
                status: 406
            }
        );
    }
    const senderId = json.Sender;

    if(!(ObjectId.isValid(senderId))){
        return NextResponse.json(
            {},
            {
                status: 406
            }
        );
    }

    json["Time"] = new Date(Date.now());
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