import { GetDirecciones } from "@/lib/database";
import { GetIdFilter } from "@/lib/route_helper";
import { NextRequest, NextResponse } from "next/server";
import { GetOSMAddress } from "../direccion/[id]/route";

function degToRad(degrees: number)
{
  const pi = Math.PI;
  return degrees * (pi/180);
}

//TODO: Minor, but find a way to calculate the actual distance, not just a straight line.
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

    const fromOSM = await GetOSMAddress(from);
    const toOSM = await GetOSMAddress(to);

    const lat1 = degToRad(fromOSM.lat);
    const lon1 = degToRad(fromOSM.lon);

    const lat2 = degToRad(toOSM.lat);
    const lon2 = degToRad(toOSM.lon);

    const distance = Math.acos(Math.sin(lat1)*Math.sin(lat2)+Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1))*6371;

    return NextResponse.json(
        {
            distance: distance
        },
        {
            status: 200
        }
    );
}