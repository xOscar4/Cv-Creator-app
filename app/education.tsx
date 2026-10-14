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
import { DatePickerField } from "../components/DatePickerField";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import { Education } from "../types/cv.types";
import * as yup from "yup";

const educationSchema = yup.object({
  institution: yup
    .string()
    .trim()
    .min(2, "La institución debe tener al menos 2 caracteres")
    .required("La institución es obligatoria"),
  degree: yup
    .string()
    .trim()
    .min(2, "El título debe tener al menos 2 caracteres")
    .required("El título o grado es obligatorio"),
  field: yup
    .string()
    .trim()
    .test(
      "field-name",
      "Ingrese un área de estudio válida",
      (value) => !value || /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(value)
    ),
  graduationYear: yup
    .string()
    .matches(/^\d{4}$/, {
      message: "Seleccione un año de graduación válido",
      excludeEmptyString: true,
    }),
});

export default function EducationScreen() {
  const router = useRouter();
  const { cvData, addEducation, deleteEducation } = useCVContext();

  const [formData, setFormData] = useState<Omit<Education, "id">>({
    institution: "",
    degree: "",
    field: "",
    graduationYear: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof Omit<Education, "id">, string>>
  >({});

  const handleChange = (
    field: keyof Omit<Education, "id">,
    value: string
  ) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);

    try {
      educationSchema.validateSyncAt(field, updatedData);
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

  const handleAdd = () => {
    const nextErrors: Partial<
      Record<keyof Omit<Education, "id">, string>
    > = {};

    try {
      educationSchema.validateSync(formData, { abortEarly: false });
    } catch (error) {
      if (!(error instanceof yup.ValidationError)) {
        throw error;
      }
      error.inner.forEach((validationError) => {
        if (validationError.path) {
          nextErrors[validationError.path as keyof Omit<Education, "id">] =
            validationError.message;
        }
      });
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
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
    setErrors({});

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
          onChangeText={(text) => handleChange("institution", text)}
          error={errors.institution}
        />

        <InputField
          label="Título/Grado *"
          placeholder="Ej: Licenciatura, Maestría"
          value={formData.degree}
          onChangeText={(text) => handleChange("degree", text)}
          error={errors.degree}
        />

        <InputField
          label="Área de Estudio"
          placeholder="Ej: Ingeniería en Sistemas"
          value={formData.field}
          onChangeText={(text) => handleChange("field", text)}
          error={errors.field}
        />

        <DatePickerField
          label="Año de Graduación"
          placeholder="Ej: 2023"
          value={formData.graduationYear}
          dateFormat="year"
          onChangeValue={(graduationYear) =>
            handleChange("graduationYear", graduationYear)
          }
          error={errors.graduationYear}
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
