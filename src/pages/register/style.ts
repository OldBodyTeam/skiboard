import { StyleSheet } from 'react-native';

const registerStyles = StyleSheet.create({
  container: {
    // backgroundColor: '#131416',
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  labelItem: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 24,
  },
  labelItemText: {
    fontSize: 16,
    lineHeight: 19,
    color: 'white',
    opacity: 0.4,
    marginBottom: 24,
  },
  labelItemInput: {
    lineHeight: 24,
    fontSize: 20,
    color: 'white',
    paddingBottom: 16,
    height: 40,
    borderColor: 'rgba(255,255,255,0.4)',
    borderBottomWidth: 1,
  },
  form: {
    paddingLeft: 28,
    paddingRight: 28,
    width: '100%',
  },
});

export { registerStyles };
