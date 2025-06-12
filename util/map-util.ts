

    export const isPointNearLine = (
      point: { latitude: number, longitude: number },
      coordinates: [number, number][],
      toleranceMeters: number = 5
    ): boolean => {
        const earthRadius = 6371000 

      for (let i = 0; i < coordinates.length - 1; i++) {
        const start = { lng: coordinates[i][0], lat: coordinates[i][1] }
        const end = { lng: coordinates[i + 1][0], lat: coordinates[i + 1][1] }
        const pointCoord = { lng: point.longitude, lat: point.latitude }
  
        // Converter para radianos
        const lat1 = (start.lat * Math.PI) / 180
        const lon1 = (start.lng * Math.PI) / 180
        const lat2 = (end.lat * Math.PI) / 180
        const lon2 = (end.lng * Math.PI) / 180
        const latP = (pointCoord.lat * Math.PI) / 180
        const lonP = (pointCoord.lng * Math.PI) / 180
  
        // Calcular distâncias usando fórmula de Haversine
        const dLat1 = latP - lat1
        const dLon1 = lonP - lon1
        const a1 = Math.sin(dLat1 / 2) ** 2 + Math.cos(lat1) * Math.cos(latP) * Math.sin(dLon1 / 2) ** 2
        const c1 = 2 * Math.atan2(Math.sqrt(a1), Math.sqrt(1 - a1))
        const distToStart = earthRadius * c1
  
        const dLat2 = latP - lat2
        const dLon2 = lonP - lon2
        const a2 = Math.sin(dLat2 / 2) ** 2 + Math.cos(lat2) * Math.cos(latP) * Math.sin(dLon2 / 2) ** 2
        const c2 = 2 * Math.atan2(Math.sqrt(a2), Math.sqrt(1 - a2))
        const distToEnd = earthRadius * c2
  
        // Calcular distância perpendicular do ponto ao segmento de linha
        const A = pointCoord.lat - start.lat
        const B = pointCoord.lng - start.lng
        const C = end.lat - start.lat
        const D = end.lng - start.lng
  
        const dot = A * C + B * D
        const lenSq = C * C + D * D
        const param = lenSq !== 0 ? dot / lenSq : -1
  
        let xx, yy
        if (param < 0) {
          xx = start.lat
          yy = start.lng
        } else if (param > 1) {
          xx = end.lat
          yy = end.lng
        } else {
          xx = start.lat + param * C
          yy = start.lng + param * D
        }
  
        const dLatP = ((pointCoord.lat - xx) * Math.PI) / 180
        const dLonP = ((pointCoord.lng - yy) * Math.PI) / 180
        const aP =
          Math.sin(dLatP / 2) ** 2 +
          Math.cos((pointCoord.lat * Math.PI) / 180) * Math.cos((xx * Math.PI) / 180) * Math.sin(dLonP / 2) ** 2
        const cP = 2 * Math.atan2(Math.sqrt(aP), Math.sqrt(1 - aP))
        const distance = earthRadius * cP
  
        if (distance <= toleranceMeters) {
          return true
        }
      }
      return false
    }

    export const isPointNearPoint = (
      point: { latitude: number, longitude: number },
      target: { latitude: number, longitude: number },
      toleranceMeters: number = 5
    ): boolean => {
        const earthRadius = 6371000 // Raio da Terra em metros

        const toRadians = (deg: number) => (deg * Math.PI) / 180

        const lat1 = toRadians(point.latitude)
        const lon1 = toRadians(point.longitude)
        const lat2 = toRadians(target.latitude)
        const lon2 = toRadians(target.longitude)

        const dLat = lat2 - lat1
        const dLon = lon2 - lon1

        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

        const distance = earthRadius * c

        return distance <= toleranceMeters
      }

    export const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const toRadians = (deg: any) => (deg * Math.PI) / 180
        const toDegrees = (rad: any) => (rad * 180) / Math.PI
    
        const dLon = toRadians(lon2 - lon1)
    
        const y = Math.sin(dLon) * Math.cos(toRadians(lat2))
        const x =
          Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
          Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(dLon)
    
        let bearing = toDegrees(Math.atan2(y, x))
        bearing = (bearing + 360) % 360 // Normalize to 0-360
        return bearing
      }
    