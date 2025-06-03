import React, { useRef, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import MapView, { Geojson, Marker } from 'react-native-maps'
// import { Ionicons } from '@expo/vector-icons'


import { InfraestruturaGeoJson, InfraestruturaGeoJsonFeature, Problema, RequestInfraestruturaByRadius, RequestProblemaByRadius } from 'types'
import { getInfraestrutura } from 'api/infraestrutura'
import { mapInfraestruturaGeoJsonResponseToInfraestruturaGeoJson } from 'util/mapInfraestrutura'

import { createAudioPlayer } from 'expo-audio'
import { StatusBar } from 'expo-status-bar'
import { calculateBearing, isPointNearLine, isPointNearPoint } from 'util/map-util'
import ProblemaView from 'components/ProblemaView'
import { getProblemaByRadius } from 'api/problema'
import { sounds, prompts } from 'constants/index'
import { AudioSpeaker } from 'util/audioSpeaker'

export default function Navigator() {
  const [requestInfraestrutura, setRequestInfraestrutura] = useState<RequestInfraestruturaByRadius>()
  const [infraestrutura, setInfraestrutura] = useState<InfraestruturaGeoJson>()
  const [problemas, setProblemas] = useState<Problema[]>([])

  const [nearProblems, setNearProblems] = useState<Problema[]>([])
  const [infraProblems, setInfraProblems] = useState<Problema[]>([])

  const [pinProblemaSelector, setPinProblemaSelector] = useState<Problema | null>(null)
  const [requestProblemas, setRequestProblemas] = useState<RequestProblemaByRadius>()
  const notifiedProblemsId = useRef<number[]>([])
  
  const lastRequestLocation = useRef<{ latitude: number, longitude: number } | null>(null)
  const emptyGeoJson: InfraestruturaGeoJson = {
    type: "FeatureCollection",
    features: [],
  }  
  const mapRef = useRef<MapView>(null)
  const headingRef = useRef<number | null>(null)
  const headingExtremesRef = useRef<[number, number]>([0, 0])

  const lastUserLocation = useRef<{ latitude: number, longitude: number } | null>(null)
  const lastInfra = useRef<InfraestruturaGeoJsonFeature | null>(null)

  const speechRef = useRef(new AudioSpeaker())  

  const Play = async (audio: {src: any, duration: number}) => {
  const player = createAudioPlayer(audio.src)
  player.play()
    setTimeout(() => {
    // this.player.remove()
    player.release()
    }, audio.duration * 1000)
  }

  const checkAndRequestStreets = (latitude: number, longitude: number) => {
    const currentLocation = { latitude, longitude }

    // Check if the user has moved significantly
    if (lastRequestLocation.current) {
      // Skip request if moved less than 750 meters
      if (isPointNearPoint(currentLocation, lastRequestLocation.current, 750)) return
    }

    // Update last request location
    lastRequestLocation.current = currentLocation

    // Fetch streets around the new location
    setRequestInfraestrutura({
      latitude,
      longitude,
      raio: 750,
    })
    setRequestProblemas({
      latitude,
      longitude,
      raio: 750,
    })

  }

  const extremesOfOneDirection = (direction: number): [number, number] => {
    let left = direction - 90
    let right = direction + 90
    if (left < 0) left = 360 + left
    if (right > 360) right = right - 360
    return [left, right]
  }

  const handleLocationChange = (latitude: number, longitude: number) => {
    if (!infraestrutura) return
    const currentLocation = { latitude, longitude }

    
    
    // Check if the user has moved significantly
    if (lastUserLocation.current) {
      // Skip if moved less than 10 meters
      if (isPointNearPoint(currentLocation, lastUserLocation.current, 10)) return
    }
    
    lastUserLocation.current = currentLocation
    
    const matchedFeature = infraestrutura.features.find((feature) => {
      const geometry = feature.geometry
      if (geometry.type === 'LineString') {
        return isPointNearLine(currentLocation, geometry.coordinates as [number, number][])  
      }
      return false
    })

    // Avoid redundant updates
    if (matchedFeature && matchedFeature !== lastInfra.current) {
      console.log('User is now on street:', matchedFeature.properties.name)
      lastInfra.current = matchedFeature
      getHeading(matchedFeature)
      const geometry = matchedFeature.geometry
      if (geometry.type === 'LineString') {
        setInfraProblems(
          problemas.filter((problema) => {
            return isPointNearLine(problema, geometry.coordinates as [number, number][])
          })
        )
      }
    }
    if(!matchedFeature) {
      headingRef.current = null
      return
    }
    
    setNearProblems(
      problemas.filter((problema) => {
        if(matchedFeature)
        return isPointNearPoint(currentLocation, problema, 20)
      })
    )
  } 
    
  useEffect(() => {
    if (!headingRef.current) return
    headingExtremesRef.current = extremesOfOneDirection(headingRef.current)
  }, [headingRef.current])

  useEffect(() => {
    if (nearProblems.length <= 0) return
    nearProblems.forEach((problema) => {
      if (notifiedProblemsId.current.includes(problema.id)) return
      notifiedProblemsId.current.push(problema.id)
      Play(sounds.problem_notification)
    })
  }, [nearProblems])

  useEffect(() => {
    if (!infraProblems || infraProblems.length <= 0) return
    console.log("Problemas de infraestrutura detectados:")
      infraProblems.forEach((problema) => {
          Play(sounds.beep).then(()=>{
            speechRef.current.speak(prompts.problema.find(p => (problema.tipoProblema.id === p.id))?.prompt || `Problema detectado próximo a você.`)
          })
          console.log(`Problema de tipo ${problema.tipoProblema.descricao} detectado na infraestrutura próxima a você.`)
      })
  }, [infraProblems])

  useEffect(() => {
    return () => {
      speechRef.current.stop()
    }
  }, [])

  const changeMapView = (lat: number, long: number, heading: number) => {
    let h
    if (!headingRef.current) {
      h = heading
    } else {
      const [left, right] = headingExtremesRef.current
      h = (heading >= left && heading <= right) ? headingRef.current : headingRef.current - 180 >= 0 ? headingRef.current - 180 : headingRef.current + 180
    }
    if (mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: lat,
          longitude: long,
        },
        pitch: 90, // Lays the map down
        heading: h,
        zoom: 18,
      }, { duration: 1000 })
    }
  }

  

  const getHeading = (feature: InfraestruturaGeoJsonFeature) => {
    if (!feature) return
    const geometry = feature.geometry
    let coords: number[][] = []

    if (geometry.type === 'LineString') {
      coords = geometry.coordinates as number[][]
    } else if (geometry.type === 'MultiLineString') {
      coords = (geometry.coordinates as number[][][])[0] || []
    } else {
      // GeometryCollection or other types are not handled
      return
    }

    if (coords.length > 1) {
      const [start, next] = coords
      const bearing = calculateBearing(
        start[1],
        start[0],
        next[1],
        next[0],
      )
      headingRef.current = bearing
    }
  }


  useEffect(() => {
    if (!requestInfraestrutura) { return }
    getInfraestrutura(requestInfraestrutura, null)
      .then((response) => {
        setInfraestrutura(mapInfraestruturaGeoJsonResponseToInfraestruturaGeoJson(response))
      })
      .catch((response) => {
        // setErrorMessage("Error ao carregar infraestrutura: " + response.message)
      })
      .finally(() => {
        console.log("Teriminou a requisição de infraestrutura")
      })
  }, [requestInfraestrutura])

      useEffect(() => {
        if (!requestProblemas) {return}
        getProblemaByRadius(requestProblemas, null)
        .then((response) => {
          setProblemas(response)
        })
        .catch((response)=>{
          // setErrorMessage("Error ao carregar problemas: " + response.message)
        })
        .finally(()=>{
          // console.log("Teriminou a requisição de problemas")
          // isContentLoading && setIsContentLoading(false)
        })
      }
      , [requestProblemas])

  return (
    <SafeAreaView>
      <MapView style={{ width: '100%', height: '100%' }}
        ref={mapRef}
        googleMapId={process.env.EXPO_PUBLIC_MAP_STYLE_ID}
        showsUserLocation={true}
        zoomEnabled={false}
        scrollEnabled={false}
        rotateEnabled={false}
        showsMyLocationButton={false}
        onUserLocationChange={(e) => {
          if (e.nativeEvent.coordinate) {
            const { latitude, longitude , heading} = e.nativeEvent.coordinate
            if (latitude && longitude) {
              changeMapView(latitude, longitude, heading)
              handleLocationChange(latitude, longitude)
              checkAndRequestStreets(latitude, longitude)
            }
          }
        }}
      >

        <Geojson
          geojson={infraestrutura || emptyGeoJson}
          strokeWidth={10}
        />

        {problemas.map((problema) => (        
                    <Marker 
                        key={problema.id} 
                        tracksViewChanges={false}
                        coordinate={problema} 
                        titleVisibility='hidden'
                        image={
                          problema.tipoProblema.id === 1?( require('../../assets/pins/pin_problema_tipo_1_round.png')) 
                          :
                          problema.tipoProblema.id === 2?( require('../../assets/pins/pin_problema_tipo_2_round.png') )
                          : 
                          problema.tipoProblema.id === 3?( require('../../assets/pins/pin_problema_tipo_3_round.png') )
                          :
                          problema.tipoProblema.id === 4?( require('../../assets/pins/pin_problema_tipo_4_round.png') ) 
                          :
                          problema.tipoProblema.id === 5?( require('../../assets/pins/pin_problema_tipo_5_round.png') )   
                          :
                          problema.tipoProblema.id === 6?( require('../../assets/pins/pin_problema_tipo_6_round.png') )   
                          :
                          problema.tipoProblema.id === 7?( require('../../assets/pins/pin_problema_tipo_7_round.png') )   
                          :  
                          problema.tipoProblema.id === 8?( require('../../assets/pins/pin_problema_tipo_8_round.png') )   
                          :  
                            require('../../assets/pins/pin_problema_tipo_1_round.png')
                            
                        }
                        onPress={()=>setPinProblemaSelector(problema)}
                      >
                      </Marker>
                  ))}

      </MapView>
      {/* <TouchableOpacity
                className='absolute z-0 top-[20px] left-[20px] bg-primary_green p-[10px] rounded-[30px] justify-center items-center'
                onPress={(() => {getCurrentLocation()})}
              >
        <Ionicons name="locate" size={24} color="black" />
      </TouchableOpacity> */}

      {pinProblemaSelector &&
        <ProblemaView
          problema={pinProblemaSelector}
          onClose={() => setPinProblemaSelector(null)}
        />
      }

        <StatusBar
          style="dark"
        />
    </SafeAreaView>
  )
}
