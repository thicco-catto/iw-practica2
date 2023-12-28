import { HasAllKeys } from "@/lib/dict_helper";
import { checkoutOrder } from "@/lib/paypal";
import { NextRequest, NextResponse } from "next/server";

const KEYS: string[] = [
  "Precio",
];
export async function POST(request: NextRequest){

  const json = await request.json();

  if(!HasAllKeys(json, KEYS)) {
      return NextResponse.json(
          {msg: "Faltan atributos"},
          {
              status: 406
          }
      );
  }

  const precio = json.Precio;

 const response = await checkoutOrder(Number.parseFloat(precio));
 return NextResponse.json({response},{status: 201});

}