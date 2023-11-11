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

}

export async function getCO2Footprint(distance: Number , model: string){
    const response = await fetch("https://www.carboninterface.com/api/v1/estimates", {mode:'cors', method: 'POST', 
    headers:{'Autorization': authenticationKey},body: JSON.stringify({
    type: 'vehicle', 
    distance_unit: 'km', 
    distance_value: 100, 
    vehicle_model_id: '7268a9b7-17e8-4c8d-acca-57059252afe9'})})
    return response.json();



}