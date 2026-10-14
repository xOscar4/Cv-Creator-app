import React, { useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";

interface DatePickerFieldProps {
  label: string;
  placeholder: string;
  value: string;
  dateFormat?: "monthYear" | "year";
  onChangeValue: (value: string) => void;
  error?: string;
}

const formatDate = (date: Date, dateFormat: "monthYear" | "year") => {
  if (dateFormat === "year") {
    return date.getFullYear().toString();
  }

  const formattedDate = date.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};

export const DatePickerField = ({
  label,
  placeholder,
  value,
  dateFormat = "monthYear",
  onChangeValue,
  error,
}: DatePickerFieldProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [draftDate, setDraftDate] = useState(selectedDate);
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const openPicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: value ? selectedDate : new Date(),
        mode: "date",
        design: "material",
        title: label,
        onValueChange: (_event, date) => {
          setSelectedDate(date);
          onChangeValue(formatDate(date, dateFormat));
        },
        onError: (error) => {
          console.error("No se pudo abrir el selector de fecha:", error);
          Alert.alert(
            "Error",
            "No se pudo abrir el selector de fecha. Inténtalo de nuevo."
          );
        },
      });
      return;
    }

    setDraftDate(value ? selectedDate : new Date());
    setIsPickerVisible(true);
  };

  const handleClear = () => {
    onChangeValue("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={openPicker}
        style={[styles.input, error && styles.inputError]}
      >
        <Text style={value ? styles.value : styles.placeholder}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {value !== "" && (
        <TouchableOpacity
          accessibilityRole="button"
          onPress={handleClear}
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>Quitar fecha</Text>
        </TouchableOpacity>
      )}

      {Platform.OS === "ios" && isPickerVisible && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={draftDate}
            mode="date"
            display="spinner"
            locale="es-ES"
            onValueChange={(_event, date) => setDraftDate(date)}
          />
          <View style={styles.pickerActions}>
            <TouchableOpacity onPress={() => setIsPickerVisible(false)}>
              <Text style={styles.actionText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedDate(draftDate);
                onChangeValue(formatDate(draftDate, dateFormat));
                setIsPickerVisible(false);
              }}
            >
              <Text style={styles.actionText}>Listo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    minHeight: 48,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#e74c3c",
  },
  value: {
    color: "#333",
    fontSize: 16,
  },
  placeholder: {
    color: "#999",
    fontSize: 16,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    marginTop: 4,
  },
  clearButton: {
    alignSelf: "flex-end",
    paddingTop: 8,
  },
  clearButtonText: {
    color: "#7f8c8d",
    fontSize: 14,
  },
  pickerContainer: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  pickerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionText: {
    color: "#208AEF",
    fontSize: 16,
    fontWeight: "600",
  },
});
