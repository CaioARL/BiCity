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
        stroke: feature.properties.notaMedia? feature.properties.notaMedia === 0 ? "rgba(195, 255, 0, 1)" 
        : 
        feature.properties.notaMedia < 3 ? "rgba(255, 0, 0, 1)" 
        :
        feature.properties.notaMedia < 4 ? "rgba(249, 168, 48, 1)" 
        : 
         "rgba(195, 255, 0, 1)"
        :
         "rgba(195, 255, 0, 1)"
        ,
      },
    })),
  };

}