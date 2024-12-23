import { StyleSheet } from 'react-native';

const CustomProfile = StyleSheet.create({
  profileCard: {
    backgroundColor: 'white',
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
  topSection: {
    height: 400,
    backgroundColor: '#C3FF00',
    // borderTopLeftRadius: 50,
    // borderTopRightRadius: 20,
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 50,
    alignItems: 'center',
  },
  imageContainer: {
    position: 'absolute',
    top: 30,
    alignSelf: 'center',
  },
  profileImage: {
    width: 350,
    height: 350,
    borderRadius: 350,
    borderWidth: 3,
    borderColor: 'white', 
    backgroundColor: 'white',   

  },
  gradientOverlay: {
    position: 'absolute', 
    width: 250, 
    height: 150,
    bottom: -20, 
    zIndex: 1,
  },
  editButton: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    backgroundColor: '#C3FF00',
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
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    
  },
  iconButton: {
    backgroundColor: '#C3FF00',
    width: 400,
    height: 40,
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
});

export default CustomProfile;