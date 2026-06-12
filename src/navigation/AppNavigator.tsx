import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import DashboardScreen from "../screens/DashboardScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AppointmentsScreen from "../screens/AppointmentsScreen";
import BookAppointmentScreen from "../screens/BookAppointmentScreen";

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  ResetPassword: undefined;
  Dashboard: undefined;
  Profile: undefined;
  Appointments: undefined;
  BookAppointment: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Appointments" component={AppointmentsScreen} />
        <Stack.Screen
          name="BookAppointment"
          component={BookAppointmentScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
