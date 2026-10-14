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
import { Experience } from "../types/cv.types";
import * as yup from "yup";

const getMonthYearValue = (value: string) => {
  const [month, yearText] = value.toLocaleLowerCase().split(" de ");
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const monthIndex = months.indexOf(month);
  const year = Number(yearText);
  return monthIndex >= 0 && Number.isInteger(year) ? year * 12 + monthIndex : null;
};

const experienceSchema = yup.object({
  company: yup
    .string()
    .trim()
    .min(2, "La empresa debe tener al menos 2 caracteres")
    .required("La empresa es obligatoria"),
  position: yup
    .string()
    .trim()
    .min(2, "El cargo debe tener al menos 2 caracteres")
    .required("El cargo es obligatorio"),
  startDate: yup.string().required("La fecha de inicio es obligatoria"),
  endDate: yup
    .string()
    .test(
      "end-date-after-start",
      "La fecha de fin no puede ser anterior a la fecha de inicio",
      function (value) {
        if (!value || !this.parent.startDate) {
          return true;
        }

        const endDate = getMonthYearValue(value);
        const startDate = getMonthYearValue(this.parent.startDate);
        return endDate === null || startDate === null || endDate >= startDate;
      }
    ),
  description: yup
    .string()
    .trim()
    .test(
      "description-length",
      "La descripción debe tener al menos 10 caracteres",
      (value) => !value || value.length >= 10
    ),
});

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
  const [errors, setErrors] = useState<
    Partial<Record<keyof Omit<Experience, "id">, string>>
  >({});

  const handleChange = (
    field: keyof Omit<Experience, "id">,
    value: string
  ) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);

    const fieldsToValidate: (keyof Omit<Experience, "id">)[] =
      field === "startDate" ? ["startDate", "endDate"] : [field];
    fieldsToValidate.forEach((fieldToValidate) => {
      try {
        experienceSchema.validateSyncAt(fieldToValidate, updatedData);
        setErrors((currentErrors) => {
          const nextErrors = { ...currentErrors };
          delete nextErrors[fieldToValidate];
          return nextErrors;
        });
      } catch (error) {
        if (!(error instanceof yup.ValidationError)) {
          throw error;
        }
        setErrors((currentErrors) => ({
          ...currentErrors,
          [fieldToValidate]: error.message,
        }));
      }
    });
  };

  const handleAdd = () => {
    const nextErrors: Partial<
      Record<keyof Omit<Experience, "id">, string>
    > = {};

    try {
      experienceSchema.validateSync(formData, { abortEarly: false });
    } catch (error) {
      if (!(error instanceof yup.ValidationError)) {
        throw error;
      }
      error.inner.forEach((validationError) => {
        if (validationError.path) {
          nextErrors[validationError.path as keyof Omit<Experience, "id">] =
            validationError.message;
        }
      });
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
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
    setErrors({});

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
          onChangeText={(text) => handleChange("company", text)}
          error={errors.company}
        />

        <InputField
          label="Cargo *"
          placeholder="Tu posición"
          value={formData.position}
          onChangeText={(text) => handleChange("position", text)}
          error={errors.position}
        />

        <DatePickerField
          label="Fecha de Inicio *"
          placeholder="Ej: Enero 2020"
          value={formData.startDate}
          onChangeValue={(startDate) => handleChange("startDate", startDate)}
          error={errors.startDate}
        />

        <DatePickerField
          label="Fecha de Fin"
          placeholder="Selecciona una fecha (opcional)"
          value={formData.endDate}
          onChangeValue={(endDate) => handleChange("endDate", endDate)}
          error={errors.endDate}
        />

        <InputField
          label="Descripción"
          placeholder="Describe tus responsabilidades y logros..."
          value={formData.description}
          onChangeText={(text) =>
            handleChange("description", text)
          }
          error={errors.description}
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
