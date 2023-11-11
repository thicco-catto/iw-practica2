const curl = "https://www.carboninterface.com/api/v1"
const authenticationKey = "Bearer F3dngTi1y1tDC5LeY2QKaQ"

export async function GetVehiclesMakes(){
 const response = await fetch(curl + "/vehicle_makes", {mode: 'cors',
    headers: {Authorization: authenticationKey}, method: 'GET'})
        return response.json();


}

export async function GetVehiclesModels(id : string){
    const response = await fetch(curl + "/vehicle_makes/" + id + "/vehicle_models", {mode: 'cors',
    headers: {Authorization: authenticationKey}, method: 'GET'})
        return response.json();

}