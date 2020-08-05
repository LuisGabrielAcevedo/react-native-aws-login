/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {Auth, Hub} from 'aws-amplify';
import {Button, Text} from 'react-native';
import {validateToken} from './src/utils';

// Hub.listen('auth', (data) => {
//   const { payload } = data;
//   console.log('A new auth event has happened: ', payload);
// })

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const getUserData = async () => {
    try {
      setLoading(true);
      const user = await Auth.currentAuthenticatedUser();
      if (user) {
        // console.log(user);
        user.getUserData((err, userData) => {
          // console.log(userData);
          setUser({
            email: userData.UserAttributes.find((ud) => ud.Name === 'email')
              .Value,
          });
        });
      }

      const credentials = await Auth.currentUserCredentials();
      console.log(credentials);

      const session = await Auth.currentSession();
      // jwt que usamos para verificar en el back
      console.log(session.accessToken.jwtToken);
      validateToken(session.accessToken.jwtToken);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const signOut = async () => {
    setLoading(true);
    await Auth.signOut();
    setLoading(false);
    setUser(null);
  };

  const googlesSignIn = async () => {
    await Auth.federatedSignIn({provider: 'Google'});
    getUserData();
  };

  return (
    <>
      <Button title="Sign in with Google" onPress={() => googlesSignIn()} />
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator color="#0000ff" />
        </View>
      )}
      {user && (
        <View>
          <Text>{user.email}</Text>
          {/* <Button title="Cerrar sesion" onPress={() => signOut()} /> */}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
});

export default App;
