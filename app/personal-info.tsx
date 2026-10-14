import React, {useState,useEffect} from "react";
import { View,StyleSheet,ScrollView,Alert } from "react-native";
import {useRouter} from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { PersonalInfo } from "../types/cv.types";
import * as yup from "yup";

const personalInfoSchema = yup.object({
    fullName: yup.string().trim().required("El nombre completo es obligatorio"),
    email: yup.string().trim().email("Ingrese un email válido").required("El email es obligatorio"),
    phone: yup
        .string()
        .trim()
        .required("El teléfono es obligatorio")
        .matches(/^\+?[0-9\s()-]+$/, "Ingrese un número válido")
        .test("phone-length", "Ingrese un número válido", (value) => {
            const digitCount = value?.replace(/\D/g, "").length ?? 0;
            return digitCount >= 7 && digitCount <= 15;
        }),
    location: yup.string().trim().required("La ubicación es obligatoria"),
    summary: yup.string().trim().required("El resumen profesional es obligatorio"),
});

export default function PersonalInfoScreen() {
    const router = useRouter();
    const {cvData, updatePersonalInfo} = useCVContext();

    const [formData, setFormData] = useState<PersonalInfo>(cvData.personalInfo);
    const [errors, setErrors] = useState<Partial<Record<keyof PersonalInfo, string>>>({});

    useEffect(() =>{
        setFormData(cvData.personalInfo);
        setErrors({});
    },[cvData.personalInfo]);

    const handleChange = (field: keyof PersonalInfo, value: string) => {
        const updatedData = { ...formData, [field]: value };
        setFormData(updatedData);

        try {
            personalInfoSchema.validateSyncAt(field, updatedData);
            setErrors((currentErrors) => {
                const nextErrors = { ...currentErrors };
                delete nextErrors[field];
                return nextErrors;
            });
        } catch (error) {
            if (!(error instanceof yup.ValidationError)) {
                throw error;
            }
            setErrors((currentErrors) => ({ ...currentErrors, [field]: error.message }));
        }
    };

    const handleSave = () =>{
        const nextErrors: Partial<Record<keyof PersonalInfo, string>> = {};
        const fields: (keyof PersonalInfo)[] = ["fullName", "email", "phone", "location", "summary"];

        for (const field of fields) {
            try {
                personalInfoSchema.validateSyncAt(field, formData);
            } catch (error) {
                if (!(error instanceof yup.ValidationError)) {
                    throw error;
                }
                nextErrors[field] = error.message;
            }
        }

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
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
                    onChangeText={(text) => handleChange("fullName", text)}
                    error={errors.fullName}
                />

                <InputField
                    label="Email *"
                    placeholder="oscar@gmail.com"
                    value={formData.email}
                    onChangeText={(text) => handleChange("email", text)}
                    error={errors.email}
                />

                <InputField
                    label="Teléfono *"
                    placeholder="+593 99 999 999"
                    value={formData.phone}
                    onChangeText={(text) => handleChange("phone", text)}
                    keyboardType="phone-pad"
                    error={errors.phone}
                />

                <InputField
                    label="Ubicación *"
                    placeholder="Quito, Ecuador"
                    value={formData.location}
                    onChangeText={(text) => handleChange("location", text)}
                    error={errors.location}
                />
                
                <InputField
                    label="Resumen Profesional *"
                    placeholder="Describe brevemente tu perfil profesional... "
                    value={formData.summary}
                    onChangeText={(text) => handleChange("summary", text)}
                    error={errors.summary}
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