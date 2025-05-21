import { StyleSheet } from 'react-native';


const CustomProfile = StyleSheet.create({
  profileCard: {
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  topSection: {
    height: 400,
    // borderTopLeftRadius: 50,
    // borderTopRightRadius: 20,
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 50,
    alignItems: 'center',
  },
  imageContainer: {
    position: 'absolute',
    top: 30,
    // left: 3.5,
    alignSelf: 'center',
  },
  profileImage: { width: '100%',
    height: '100%',
    borderRadius: 350,
    borderWidth: 0,
    borderColor: 'white', 
    backgroundColor: 'white',   
   

  },
  gradientOverlay: {
    position: 'absolute', 
    width: 250, 
    height: 150,
    bottom: -20, 
    zIndex: 1,
    borderTopRightRadius: 50,
  },
  editButton: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    borderRadius: 50,
    padding: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  bottomSection: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  title: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  nivelHabilidadeContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  nivelHabilidade: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 5, 
  },
  informaçõesContainer: {
    marginTop: 16,
  },
  link: {
    color: '#ff4500',
    fontSize: 14,
    fontWeight: '500',
    marginVertical: 4,
  },
  iconSection: {
    padding: 16,  
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  iconButton: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius:10,
    width: '108%',
    height: 58,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  passwordInput: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  button: {
    position: 'absolute',
    padding: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    bottom: 95,
    right: '5%',
    alignSelf: 'center',
  },
  button2: {
    padding: 15,
    paddingHorizontal: 30,
    width: '33%',
    right: '-3.5%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonSalve: {
    position: 'absolute',
    backgroundColor: '#C3FF00',
    padding: 15,
    paddingHorizontal: 35,
    borderRadius: 8,
    alignItems: 'center',
    bottom: 150,
    right: '5%',
    alignSelf: 'center',
  }
});

export default CustomProfile;

