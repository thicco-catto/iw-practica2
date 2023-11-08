import { GetDirecciones } from "@/lib/database";
import { GetIdFilter } from "@/lib/route_helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;

    const fromID = params.get("from");
    const toID = params.get("to");

    if(!fromID || !toID) {
        return NextResponse.json(
            {
                msg: "You need to specify parameters from and to."
            },
            {
                status: 406
            }
        );
    }

    if(fromID.length != 24 || toID.length != 24) {
        return NextResponse.json(
            {
                msg: "The object ids are not correct."
            },
            {
                status: 406
            }
        );
    }

    const direcciones = await GetDirecciones();
    const from = await direcciones.findOne(GetIdFilter(fromID));
    const to = await direcciones.findOne(GetIdFilter(toID));

    if(!from || !to) {
        return NextResponse.json(
            {

            },
            {
                status: 404
            }
        );
    }

    return NextResponse.json(
        {
            msg: "Todo"
        },
        {
            status: 502
        }
    );
}