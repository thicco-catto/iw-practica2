import GetClient from "@/lib/database";
import { NextResponse } from "next/server";


export async function GET() {
    const client = await GetClient();
    const db = client.db("sample_mflix");
    const movies = (await db.collection("movies").find({
        year: {$gt: 2000}
    }).sort({
        year: 1
    })
    .limit(20)
    .toArray()).map(x => {
        return {
            year: x.year,
            title: x.title
        };
    });

    return NextResponse.json(
        movies,
        {
            status: 200
        }
    );
}