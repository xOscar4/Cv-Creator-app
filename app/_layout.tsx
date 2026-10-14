import {Stack} from "expo-router";
import { CVProvider } from "../context/CVContext";
import { StackScreen } from "expo-router/build/layouts/stack-utils";

export default function RootLayout(){
  return(
    <CVProvider>
      <Stack screenOptions={{
        headerStyle: {backgroundColor:"#3498db"},
        headerTintColor:"#fff",
        headerTitleStyle:{ fontWeight:"bold"},
        }}
      >
        <StackScreen name="index" options={{title:"Crear CV",headerShown:true}}/>
        <StackScreen name="Personal-info" options={{title:"Informacion Persoonal"}}/>
        <StackScreen name="Education" options={{title:"Educacion"}}/>
        <StackScreen name="preview" options={{title:"Vista Previa", presentation: "modal"}}/>
      </Stack>
    </CVProvider>
  );
};

