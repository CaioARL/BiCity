import { StyleSheet } from 'react-native';
import CustomButton from './CustomButton';

const CustomEvents = StyleSheet.create({
  evento: {margin: 0, padding: 0, paddingTop: 10},
  location: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  userImage: {width: 60, height: 60, borderRadius: 50, borderWidth: 1, borderColor: '#EAEAEC', marginRight: 10},
  locationText: { fontSize: 16, fontWeight: "500", marginHorizontal: 5 },

  // SearchBox
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 100,
    paddingHorizontal: 10,
    height: 50,
    borderColor: "#555", 
    shadowColor: "#555", 
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1, 
    fontSize: 14
  },

  // Filtro
  filterContainer: { 
    flexDirection: "row", 
    justifyContent: "flex-start", 
    marginTop: 10, 
    width: "100%", 
    paddingHorizontal: 10
  },
  filterText: { 
    fontSize: 14, 
    fontWeight: "500", 
    color: "#555", paddingTop:5, 
    paddingBottom:5, paddingLeft:12, 
    paddingRight:12, 
    borderRadius: 20, 
    backgroundColor: "#f5f5f5", 
    borderWidth: 0.3, 
    borderColor: "#555", 
    marginRight: 14, 
    marginLeft: -9
  },

  // Boxs Evento
  placesContainer: {
    fontSize: 23, 
    fontWeight: "700", 
    color: "#555", 
    marginTop: 20, 
    marginBottom: 10
  },
  card: {
    height: 300, 
    marginBottom: 15, 
    borderRadius: 10, 
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
  },
  cardImage: { 
    height: 300, 
    justifyContent: "flex-end",
  },
  
  overlay: { 
    backgroundColor: "rgba(0,0,0,0.34)", 
    padding: 10, 
    position: "absolute", 
    height: "100%", 
    width: "100%", 
    borderRadius: 11 
  },

  customButtonSave:{
    flexDirection: 'row', 
    backgroundColor: 'rgba(255,255,255,0.39)', 
    borderRadius: 30, 
    paddingHorizontal: 15, 
    paddingVertical: 15,  
    alignItems: 'center', 
    marginRight: 10, 
    position: 'absolute', 
    top: 5, right: 5
  },

  cardInfo: {
    flexDirection: 'column',
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0, // Adiciona um pouco de espaço à direita
    padding: 10, // Adiciona um padding para o conteúdo
    borderRadius: 10, // Adiciona bordas arredondadas
  },

  CarduserImage: {
    width: 60, 
    height: 60, 
    borderRadius: 50, 
    borderWidth: 1, 
    borderColor: '#EAEAEC', 
    marginRight: 10, 
    top: 10
  },

  cardUserTitle: { 
    color: '#EAEAEC',
   fontSize: 12, 
   fontWeight: '700',
  },

  cardLine:{ 
    height: 1, 
    width: '120%', 
    margin: 0, 
    backgroundColor: '#ccc', 
    marginVertical: 5, 
    position: 'absolute', 
    top: 55, 
    zIndex: 2,
  },

  cardInfoBox: { 
    flexDirection: 'column', 
    alignItems: 'flex-start', 
    justifyContent: 'flex-start', 
    zIndex: 3,
    textAlign: 'left',
    marginLeft: 70,
    height: 100,
    width: 200,
    marginTop: -10,
  },

  cardTitle: { 
    color: '#EAEAEC',
    fontSize: 20, 
    fontWeight: '700',
  },

  cardLocation: { 
    color: '#EAEAEC', 
    fontSize: 9, 
    opacity: 0.9,
  },

  cardDescription: { 
    color: '#EAEAEC', 
    fontSize: 12, 
    marginBottom: 5 
  },

  cardDate: { 
    color: '#EAEAEC', 
    fontSize: 12, 
    marginBottom: 5 
  },

  customButtonToShare:{
    flexDirection: 'row', 
    backgroundColor: 'white', 
    borderRadius: 50, 
    paddingHorizontal: 20, 
    paddingVertical: 20,  
    alignItems: 'center', 
    marginRight: 10, 
    position: 'absolute', 
    bottom: 5, right: 10
  },

  containerButton:{
    flexDirection: 'row', 
    position: 'absolute',  bottom: 10, left: 10, right: 10, 
    alignItems: "center"
  },

  customButton:{
    flexDirection: 'row',  
    backgroundColor: 'rgba(255,255,255,0.39)', 
    borderRadius: 20, 
    padding: 10, 
    width: '35%', 
    alignItems: 'center', 
    marginRight: 10
  },

  customButtonText:{
    color: 'white', 
    paddingLeft: 5, 
    fontSize: 12
  },


  // Evento
  addButton:{
    width: 65,
    height: 65,
    backgroundColor: '#C3FF00',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.3,
    position: 'absolute',
    bottom: 350,
    right: 10,
    elevation: 5
  },

  addButtonText:{
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },

  CustomButtonCancelEvent: {
    textAlign: 'center', 
    width: '45%', 
    backgroundColor: '#FF0000', 
    borderRadius: 4,
    paddingHorizontal: 20, 
    paddingVertical: 15, 
  },
});

export default CustomEvents;