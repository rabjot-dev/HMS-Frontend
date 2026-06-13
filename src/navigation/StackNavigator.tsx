import DashboardScreen from "../screens/DashboardScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BookAppointmentScreen from "../screens/BookAppointmentScreen";
import AppointmentsScreen from "../screens/AppointmentsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import EditPersonalInfoScreen from "../screens/EditPersonalInfoScreen";
import EditContactInfoScreen from "../screens/EditContactInfoScreen";
import EditMedicalInfoScreen from "../screens/EditMedicalInfoScreen";
import EditEmergencyContactScreen from "../screens/EditContactInfoScreen";
import EditInsuranceScreen from "../screens/EditInsuranceScreen";
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
      <Stack.Screen name="EditPersonalInfo"    component={EditPersonalInfoScreen} />
<Stack.Screen name="EditContactInfo"     component={EditContactInfoScreen} />
<Stack.Screen name="EditEmergencyContact" component={EditEmergencyContactScreen} />
<Stack.Screen name="EditMedicalInfo"     component={EditMedicalInfoScreen} />
<Stack.Screen name="EditInsurance"       component={EditInsuranceScreen} />
    </Stack.Navigator>
  );
}