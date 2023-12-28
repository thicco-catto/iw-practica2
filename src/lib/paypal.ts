import paypal from "@paypal/checkout-server-sdk";
import { NextResponse } from "next/server";
const client_id = process.env.PAYPAL_CLIENT_ID;
const client_secret = process.env.PAYPAL_CLIENT_SECRET;

let environment: paypal.core.SandboxEnvironment;
if(client_id && client_secret){
 environment = new paypal.core.SandboxEnvironment(client_id, client_secret);

}



export function setClient(){
return new paypal.core.PayPalHttpClient(environment);
}

export async function checkoutOrder(price: number, producto: string){
    const client = setClient();
    const request = new paypal.orders.OrdersCreateRequest();

    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "EUR",
                    value: price.toString()
                },
                items: [
                    {
                        name: producto,
                        quantity: "1",
                        unit_amount: {
                            currency_code:"EUR",
                            value: price.toString()
                        },
                        category: "PHYSICAL_GOODS"
                    }


                ]
            }
        ]
        
    });
    const response = await client.execute(request);
    console.log(response);

    return NextResponse.json({
        id: response.result.id
    });
}