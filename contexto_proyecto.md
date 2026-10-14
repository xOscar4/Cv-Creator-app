# Contexto Completo del Proyecto CV-CREATOR-APP


================================================
ðŸ“„ ARCHIVO: .gitignore
================================================

# Learn more https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files

# dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Native
.kotlin/
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local

# typescript
*.tsbuildinfo

example

# generated native folders
/ios
/android


================================================
ðŸ“„ ARCHIVO: AGENTS.md
================================================

This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md


================================================
ðŸ“„ ARCHIVO: app\education.tsx
================================================

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Education } from "../types/cv.types";

export default function EducationScreen() {
  const router = useRouter();
  const { cvData, addEducation, deleteEducation } = useCVContext();

  const [formData, setFormData] = useState<Omit<Education, "id">>({
    institution: "",
    degree: "",
    field: "",
    graduationYear: "",
  });

  const handleAdd = () => {
    if (!formData.institution || !formData.degree) {
      Alert.alert("Error", "Por favor completa al menos institución y título");
      return;
    }

    const newEducation: Education = {
      id: Date.now().toString(),
      ...formData,
    };

    addEducation(newEducation);

    // Limpiar formulario
    setFormData({
      institution: "",
      degree: "",
      field: "",
      graduationYear: "",
    });

    Alert.alert("Éxito", "Educación agregada correctamente");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta educación?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteEducation(id),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Educación</Text>

        <InputField
          label="Institución *"
          placeholder="Nombre de la universidad/institución"
          value={formData.institution}
          onChangeText={(text) =>
            setFormData({ ...formData, institution: text })
          }
        />

        <InputField
          label="Título/Grado *"
          placeholder="Ej: Licenciatura, Maestría"
          value={formData.degree}
          onChangeText={(text) => setFormData({ ...formData, degree: text })}
        />

        <InputField
          label="Área de Estudio"
          placeholder="Ej: Ingeniería en Sistemas"
          value={formData.field}
          onChangeText={(text) => setFormData({ ...formData, field: text })}
        />

        <InputField
          label="Año de Graduación"
          placeholder="Ej: 2023"
          value={formData.graduationYear}
          onChangeText={(text) =>
            setFormData({ ...formData, graduationYear: text })
          }
          keyboardType="numeric"
        />

        <NavigationButton title="Agregar Educación" onPress={handleAdd} />

        {cvData.education.length > 0 && (
          <>
            <Text style={styles.listTitle}>Educación Agregada</Text>
            {cvData.education.map((edu) => (
              <View key={edu.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{edu.degree}</Text>
                  <Text style={styles.cardSubtitle}>{edu.field}</Text>
                  <Text style={styles.cardInstitution}>{edu.institution}</Text>
                  <Text style={styles.cardDate}>{edu.graduationYear}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(edu.id)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <NavigationButton
          title="Volver"
          onPress={() => router.back()}
          variant="secondary"
          style={{ marginTop: 16 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  cardInstitution: {
    fontSize: 14,
    color: "#95a5a6",
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 12,
    color: "#95a5a6",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});



================================================
ðŸ“„ ARCHIVO: app\experience.tsx
================================================

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Experience } from "../types/cv.types";

export default function ExperienceScreen() {
  const router = useRouter();
  const { cvData, addExperience, deleteExperience } = useCVContext();

  const [formData, setFormData] = useState<Omit<Experience, "id">>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleAdd = () => {
    if (!formData.company || !formData.position || !formData.startDate) {
      Alert.alert(
        "Error",
        "Por favor completa al menos empresa, cargo y fecha de inicio"
      );
      return;
    }

    const newExperience: Experience = {
      id: Date.now().toString(),
      ...formData,
    };

    addExperience(newExperience);

    // Limpiar formulario
    setFormData({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    });

    Alert.alert("Éxito", "Experiencia agregada correctamente");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta experiencia?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteExperience(id),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Experiencia</Text>

        <InputField
          label="Empresa *"
          placeholder="Nombre de la empresa"
          value={formData.company}
          onChangeText={(text) => setFormData({ ...formData, company: text })}
        />

        <InputField
          label="Cargo *"
          placeholder="Tu posición"
          value={formData.position}
          onChangeText={(text) => setFormData({ ...formData, position: text })}
        />

        <InputField
          label="Fecha de Inicio *"
          placeholder="Ej: Enero 2020"
          value={formData.startDate}
          onChangeText={(text) => setFormData({ ...formData, startDate: text })}
        />

        <InputField
          label="Fecha de Fin"
          placeholder="Ej: Diciembre 2023 o 'Actual'"
          value={formData.endDate}
          onChangeText={(text) => setFormData({ ...formData, endDate: text })}
        />

        <InputField
          label="Descripción"
          placeholder="Describe tus responsabilidades y logros..."
          value={formData.description}
          onChangeText={(text) =>
            setFormData({ ...formData, description: text })
          }
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: "top" }}
        />

        <NavigationButton title="Agregar Experiencia" onPress={handleAdd} />

        {cvData.experiences.length > 0 && (
          <>
            <Text style={styles.listTitle}>Experiencias Agregadas</Text>
            {cvData.experiences.map((exp) => (
              <View key={exp.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{exp.position}</Text>
                  <Text style={styles.cardSubtitle}>{exp.company}</Text>
                  <Text style={styles.cardDate}>
                    {exp.startDate} - {exp.endDate || "Actual"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(exp.id)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <NavigationButton
          title="Volver"
          onPress={() => router.back()}
          variant="secondary"
          style={{ marginTop: 16 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: "#95a5a6",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});


================================================
ðŸ“„ ARCHIVO: app\index.tsx
================================================

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useCVContext } from "../context/CVContext";

export default function HomeScreen() {
  const router = useRouter();
  const { cvData } = useCVContext();

  console.log("CV Data cargado:", cvData); // Para debugging

  const isPersonalInfoComplete =
    cvData.personalInfo.fullName && cvData.personalInfo.email;
  const hasExperience = cvData.experiences.length > 0;
  const hasEducation = cvData.education.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crea tu CV Profesional</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Información Personal</Text>
        <Text style={styles.status}>
          {isPersonalInfoComplete ? "✓ Completado" : "Pendiente"}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/personal-info")}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Experiencia</Text>
        <Text style={styles.status}>
          {hasExperience
            ? `✓ ${cvData.experiences.length} agregada(s)`
            : "Pendiente"}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/experience")}
        >
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Educación</Text>
        <Text style={styles.status}>
          {hasEducation
            ? `✓ ${cvData.education.length} agregada(s)`
            : "Pendiente"}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/education")}
        >
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 30 }}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#2ecc71" }]}
          onPress={() => router.push("/preview")}
        >
          <Text style={styles.buttonText}>Ver Vista Previa del CV</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    color: "#27ae60",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#3498db",
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
});



================================================
ðŸ“„ ARCHIVO: app\personal-info.tsx
================================================

import React, {useState,useEffect} from "react";
import { View,StyleSheet,ScrollView,Alert } from "react-native";
import {useRouter} from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { PersonalInfo } from "../types/cv.types";

export default function PersonalInfoScreen() {
    const router = useRouter();
    const {cvData, updatePersonalInfo} = useCVContext();

    const [formData, setFormData] = useState<PersonalInfo>(cvData.personalInfo);

    useEffect(() =>{
        setFormData(cvData.personalInfo);
    },[cvData.personalInfo]);

    const handleSave = () =>{
        if(!formData.fullName || !formData.email){
            Alert.alert("Error","Por favor completa al menos el nombre y el email");
            return;
        }

        updatePersonalInfo(formData);
        Alert.alert("Éxito", "Informacion guardada correctamente",[
            {text: "OK", onPress:() => router.back()},
        ]);
    };

    return(
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <InputField
                    label="Nombre Completo *"
                    placeholder="Oscar Borja"
                    value={formData.fullName}
                    onChangeText={(text) => setFormData({ ...formData,fullName: text})}
                />

                <InputField
                    label="Email *"
                    placeholder="oscar@gmail.com"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData,
                    email: text})}
                />

                <InputField
                    label="Teléfono *"
                    placeholder="+593 99 999 999"
                    value={formData.phone}
                    onChangeText={(text) => setFormData({ ...formData,
                    phone: text})}
                />

                <InputField
                    label="Ubicación *"
                    placeholder="Quito, Ecuador"
                    value={formData.location}
                    onChangeText={(text) => setFormData({ ...formData,location: text})}
                />
                
                <InputField
                    label="Resumen Profesional *"
                    placeholder="Describe brevemente tu perfil profesional... "
                    value={formData.summary}
                    onChangeText={(text) => setFormData({ ...formData,summary: text})}
                    multiline
                    numberOfLines={4}
                    style={{height: 100, textAlignVertical: "top" }}
                />

                <NavigationButton title="Guardar Informacion" onPress={handleSave} />

                <NavigationButton title="Cancelar" onPress={() => router.back()} variant="secondary"/>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    content:{
        padding: 20,
    },
})

================================================
ðŸ“„ ARCHIVO: app\preview.tsx
================================================

import React from "react";
import { View, StyleSheet } from "react-native";
import { useCVContext } from "../context/CVContext";
import { CVPreview } from "../components/CVPreview";

export default function PreviewScreen(){
    const {cvData} = useCVContext()

    return(
    <View style={styles.container}> 
        <CVPreview cvData={cvData}/>
    </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:"#fff"
    }
})

================================================
ðŸ“„ ARCHIVO: app\_layout.tsx
================================================

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



================================================
ðŸ“„ ARCHIVO: app.json
================================================

{
  "expo": {
    "name": "cv-creator-app",
    "slug": "cv-creator-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "cvcreatorapp",
    "userInterfaceStyle": "automatic",
    "ios": {
      "icon": "./assets/expo.icon"
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#208AEF",
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 76
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}


================================================
ðŸ“„ ARCHIVO: components\CVPreview.tsx
================================================

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { CVData } from "../types/cv.types";

interface CVPreviewProps {
  cvData: CVData;
}

export const CVPreview: React.FC<CVPreviewProps> = ({ cvData }) => {
  const { personalInfo, experiences, education } = cvData;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header con información personal */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalInfo.fullName || "Tu Nombre"}
          </Text>
          <View style={styles.contactInfo}>
            {personalInfo.email && (
              <Text style={styles.contactText}>📧 {personalInfo.email}</Text>
            )}
            {personalInfo.phone && (
              <Text style={styles.contactText}>📱 {personalInfo.phone}</Text>
            )}
            {personalInfo.location && (
              <Text style={styles.contactText}>📍 {personalInfo.location}</Text>
            )}
          </View>
        </View>

        {/* Resumen profesional */}
        {personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RESUMEN PROFESIONAL</Text>
            <Text style={styles.summaryText}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Experiencia laboral */}
        {experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EXPERIENCIA LABORAL</Text>
            {experiences.map((exp) => (
              <View key={exp.id} style={styles.item}>
                <Text style={styles.itemTitle}>{exp.position}</Text>
                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                <Text style={styles.itemDate}>
                  {exp.startDate} - {exp.endDate || "Actual"}
                </Text>
                {exp.description && (
                  <Text style={styles.itemDescription}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Educación */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDUCACIÓN</Text>
            {education.map((edu) => (
              <View key={edu.id} style={styles.item}>
                <Text style={styles.itemTitle}>{edu.degree}</Text>
                {edu.field && (
                  <Text style={styles.itemSubtitle}>{edu.field}</Text>
                )}
                <Text style={styles.itemInstitution}>{edu.institution}</Text>
                {edu.graduationYear && (
                  <Text style={styles.itemDate}>{edu.graduationYear}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Mensaje si no hay datos */}
        {!personalInfo.fullName &&
          experiences.length === 0 &&
          education.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No hay información para mostrar.{"\n"}
                Completa las secciones para ver tu CV.
              </Text>
            </View>
          )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: "#3498db",
    paddingBottom: 16,
    marginBottom: 24,
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 12,
  },
  contactInfo: {
    gap: 4,
  },
  contactText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 12,
    letterSpacing: 1,
  },
  summaryText: {
    fontSize: 14,
    color: "#34495e",
    lineHeight: 20,
  },
  item: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  itemInstitution: {
    fontSize: 14,
    color: "#95a5a6",
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: "#95a5a6",
    fontStyle: "italic",
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 13,
    color: "#34495e",
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#95a5a6",
    textAlign: "center",
    lineHeight: 24,
  },
});


================================================
ðŸ“„ ARCHIVO: components\InputField.tsx
================================================

import React from "react";
import {View,Text,TextInput,StyleSheet,TextInputProps} from "react-native";

interface InputFieldProps extends TextInputProps{
    label: string;
    error?: string;
};

export const InputField = ({ label, error, ...props}:InputFieldProps) =>{
    return(
        <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={[styles.input, error && styles.inputError]}
            placeholderTextColor="#999"
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        marginBottom: 16,
    },
    label:{
        fontSize: 16,
        fontWeight: "600",
        color:'#333',
        marginBottom: 8,
    },
    input:{
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#fff"
    },
    inputError:{
        borderColor: "#e74c3c"
    },
    errorText:{
        color: "#e74c3c",
        fontSize: 12,
        marginTop: 4,
    },
});

================================================
ðŸ“„ ARCHIVO: components\NavigationButton.tsx
================================================

import React from "react";
import { TouchableOpacity,Text,StyleSheet,ViewStyle } from "react-native";

interface NavigationButtonProps{
    title: string;
    onPress:() => void;
    variant?: "primary" | "secondary" | "danger";
    style?: ViewStyle;
};

export const NavigationButton = ({title,onPress,variant="primary",style}:NavigationButtonProps) =>{
    return(
        <TouchableOpacity style={[styles.button, styles[variant], style]} onPress={onPress} activeOpacity={0.8}
        >
            <Text style={[styles.text, variant === "secondary" && styles.textSecondary]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles= StyleSheet.create({
    button:{
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 8,
    },
    primary:{
        backgroundColor: "#3498db",
    },
    secondary:{
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#3496db",
    },
    danger:{
        backgroundColor: "#e74c3c",
    },
    text:{
        color:"#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    textSecondary:{
        color:"#3498db"
    }
});

================================================
ðŸ“„ ARCHIVO: context\CVContext.tsx
================================================

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CVData, PersonalInfo, Experience, Education } from "../types/cv.types";

interface CVContextType {
  cvData: CVData;
  updatePersonalInfo: (info: PersonalInfo) => void;
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Experience) => void;
  deleteExperience: (id: string) => void;
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Education) => void;
  deleteEducation: (id: string) => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider = ({ children }: { children: ReactNode }) => {
  const [cvData, setCVData] = useState<CVData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    },
    experiences: [],
    education: [],
  });

  const updatePersonalInfo = (info: PersonalInfo) => {
    setCVData((prev) => ({ ...prev, personalInfo: info }));
  };

  const addExperience = (exp: Experience) => {
    setCVData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, exp],
    }));
  };

  const updateExperience = (id: string, exp: Experience) => {
    setCVData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === id ? exp : e)),
    }));
  };

  const deleteExperience = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  };

  const addEducation = (edu: Education) => {
    setCVData((prev) => ({
      ...prev,
      education: [...prev.education, edu],
    }));
  };

  const updateEducation = (id: string, edu: Education) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? edu : e)),
    }));
  };

  const deleteEducation = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  };

  return (
    <CVContext.Provider
      value={{
        cvData,
        updatePersonalInfo,
        addExperience,
        updateExperience,
        deleteExperience,
        addEducation,
        updateEducation,
        deleteEducation,
      }}
    >
      {children}
    </CVContext.Provider>
  );
};

export const useCVContext = () => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error("useCVContext debe usarse dentro de CVProvider");
  }
  return context;
};


================================================
ðŸ“„ ARCHIVO: expo-env.d.ts
================================================

/// <reference types="expo/types" />

// NOTE: This file should not be edited and should be in your git ignore

================================================
ðŸ“„ ARCHIVO: package.json
================================================

{
  "name": "cv-creator-app",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "dependencies": {
    "@expo/ui": "~57.0.24",
    "expo": "~57.0.29",
    "expo-constants": "~57.0.22",
    "expo-device": "~57.0.2",
    "expo-font": "~57.0.4",
    "expo-glass-effect": "~57.0.4",
    "expo-image": "~57.0.5",
    "expo-linking": "~57.0.13",
    "expo-router": "~57.0.27",
    "expo-splash-screen": "~57.0.10",
    "expo-status-bar": "~57.0.1",
    "expo-symbols": "~57.0.3",
    "expo-system-ui": "~57.0.4",
    "expo-web-browser": "~57.0.3",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-native": "0.86.3",
    "react-native-gesture-handler": "~2.32.0",
    "react-native-reanimated": "4.5.1",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "~4.26.0",
    "react-native-web": "~0.21.0",
    "react-native-worklets": "0.10.1"
  },
  "devDependencies": {
    "@types/react": "~19.2.2",
    "typescript": "~6.0.3"
  },
  "scripts": {
    "start": "expo start",
    "reset-project": "node ./scripts/reset-project.js",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "private": true
}


================================================
ðŸ“„ ARCHIVO: README.md
================================================

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


================================================
ðŸ“„ ARCHIVO: tsconfig.json
================================================

{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": [
        "./src/*"
      ],
      "@/assets/*": [
        "./assets/*"
      ]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}


================================================
ðŸ“„ ARCHIVO: types\cv.types.ts
================================================

export interface PersonalInfo{
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
}

export interface Experience{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface Education{
    id: string;
    institution: string;
    degree: string;
    field: string;
    graduationYear: string;
}

export interface CVData{
    personalInfo: PersonalInfo;
    experiences: Experience[];
    education: Education[];
   
}