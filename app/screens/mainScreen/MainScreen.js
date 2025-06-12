import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Feather';
import HomeScreen from './HomeScreen';
import DibsScreen from './DibsScreen';
import MyPageScreen from '../myPageScreen/MyPageScreen';
import SearchScreen from '../mainScreen/SearchScreen';


const Tab = createBottomTabNavigator();


// MainScreen 컴포넌트
function MainScreen() {
  const ProfileComponent = () => <MyPageScreen key={Math.random()} />;
  return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: '#4FAF5A',
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: '홈',
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" color={color} size={size} />
            ),
            tabBarLabelStyle: styles.text
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            title: '검색',
            tabBarIcon: ({ color, size }) => (
              <Icon name="search" color={color} size={size} />
            ),
            tabBarLabelStyle: styles.text
          }}
        />
        <Tab.Screen
          name="Dibs"
          component={DibsScreen}
          options={{
            title: '찜',
            tabBarIcon: ({ color, size }) => (
              <Icon2 name="heart" color={color} size={size} />
            ),
            tabBarLabelStyle: styles.text
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileComponent}
          options={{
            title: '프로필',
            tabBarIcon: ({ color, size }) => (
              <Icon name="person" color={color} size={size} />
            ),
            tabBarLabelStyle: styles.text
          }}
        />

      </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'GmarketSansMedium'
  },
});

export default MainScreen;