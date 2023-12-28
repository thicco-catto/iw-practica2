import { HasAllKeys } from "@/lib/dict_helper";
import { checkoutOrder } from "@/lib/paypal";
import { NextRequest, NextResponse } from "next/server";

const KEYS: string[] = [
  "Producto",
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
  const producto = json.Producto;
  const precio = json.Precio;

 const response = await checkoutOrder(Number.parseFloat(precio), producto);
 return NextResponse.json({response},{status: 201});

}