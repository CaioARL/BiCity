import { InfraestruturaGeoJson, InfraestruturaGeoJsonResponse } from "../types";



export function mapInfraestruturaGeoJsonResponseToInfraestruturaGeoJson(
  infraestruturaGeoJsonResponse: InfraestruturaGeoJsonResponse
): InfraestruturaGeoJson {
  return {
    type: "FeatureCollection",
    features: infraestruturaGeoJsonResponse.features.map((feature) => ({
      ...feature,
      properties: {
        ...feature.properties,
        stroke: feature.properties.notaMedia === 0 ? "rgba(255, 64, 0, 1)" 
        : 
        feature.properties.notaMedia < 3 ? "rgba(255, 0, 0, 1)" 
        :
        feature.properties.notaMedia < 4 ? "rgba(240, 236, 34, 1)" 
        : 
        feature.properties.notaMedia <= 5 ? "rgba(30, 247, 10, 1)" :  "rgba(88, 135, 252, 1)"
        ,
      },
    })),
  };

}