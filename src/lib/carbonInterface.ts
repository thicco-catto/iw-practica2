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

 export async function getCO2Footprint(distance: number, model: string) {
    
    const getData = async () => {
        try {
          const response = await fetch('https://www.carboninterface.com/api/v1/estimates', {
            method: 'POST',
            body: JSON.stringify({
              type: "vehicle",
            distance_unit: "km",
            distance_value: distance,
            vehicle_model_id: model
            }),
            headers: {
              Authorization: "Bearer F3dngTi1y1tDC5LeY2QKaQ",
              'Content-type':'application/json'
            }
          })
          const res = await response.json()

          return res;
        } catch (error) {
          console.error(error)
          return undefined;
        }
      }  
      const result = await getData()
      return  result;
}