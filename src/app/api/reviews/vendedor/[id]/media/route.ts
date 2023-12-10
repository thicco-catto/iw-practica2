import { GetReviews } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { Params } from "@/lib/route_helper";

interface RouteParams {
    id: string
}


export async function GET(_: NextRequest, {params}: Params<RouteParams>) {
    const id = params.id;

    if(!ObjectId.isValid(id)) {
        return NextResponse.json({}, {status: 406});
    }

    const reviews = await GetReviews();

    const res = await reviews.find({
        "Vendedor":{$eq:ObjectId.createFromHexString(id)}

    }).toArray();

    if(res.length === 0) {
        return NextResponse.json({}, {status: 404});
    }
    // Calculate the average score
    const totalScore = res.reduce((sum, review) => sum + review.Puntuacion, 0);
    const averageScore = totalScore / res.length;

    // Return the average score
    return NextResponse.json({averageScore}, {status: 200});
}

