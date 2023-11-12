const curl = "https://www.carboninterface.com/api/v1";
const authenticationKey = "Bearer F3dngTi1y1tDC5LeY2QKaQ";

export async function GetVehiclesMakes() {
    const response = await fetch(
        curl + "/vehicle_makes",
        {
            mode: "cors",
            headers: {
                Authorization: authenticationKey
            },
            method: "GET"
        }
    );

    return response.json();
}

export async function GetVehiclesModels(id: string) {
    const response = await fetch(
        curl + "/vehicle_makes/" + id + "/vehicle_models",
        {
            mode: "cors",
            headers: {
                Authorization: authenticationKey
            },
            method: "GET"
        }
    );
    return response.json();

}

/* export async function getCO2Footprint(distance: number, model: string) {
    
    const response = await fetch(
        "https://www.carboninterface.com/api/v1/estimates",
        {
            mode: "cors",
            method: "POST",
            headers: {
                "Autorization": authenticationKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type: "vehicle",
                distance_unit: "km",
                distance_value: distance,
                vehicle_model_id: model
            })
        
        }
    ).then(res=> res.json()).then(res=> console.log(res)).catch(res=>console.log(res))
    return response;
    
}
*/