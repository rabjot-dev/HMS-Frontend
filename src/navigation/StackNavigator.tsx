import DashboardScreen from "../screens/DashboardScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BookAppointmentScreen from "../screens/BookAppointmentScreen";
import AppointmentsScreen from "../screens/AppointmentsScreen";
import ProfileScreen from "../screens/ProfileScreen";
const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

       <Stack.Screen
        name="BookAppointmentScreen"
        component={BookAppointmentScreen}
      />
      <Stack.Screen name="Appointments" component={AppointmentsScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
}