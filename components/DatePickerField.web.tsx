import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
  const [selectedDate, setSelectedDate] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value;
    setSelectedDate(dateValue);
    onChangeValue(
      dateValue ? formatDate(new Date(`${dateValue}T12:00:00`), dateFormat) : ""
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {React.createElement("input", {
        type: "date",
        value: value ? selectedDate : "",
        onChange: handleChange,
        "aria-label": label,
        "aria-invalid": !!error,
        title: placeholder,
        style: {
          ...inputStyle,
          border: error ? "1px solid #e74c3c" : inputStyle.border,
        },
      })}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {value !== "" && (
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => {
            setSelectedDate("");
            onChangeValue("");
          }}
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>Quitar fecha</Text>
        </TouchableOpacity>
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
  clearButton: {
    alignSelf: "flex-end",
    paddingTop: 8,
  },
  clearButtonText: {
    color: "#7f8c8d",
    fontSize: 14,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    marginTop: 4,
  },
});

const inputStyle: React.CSSProperties = {
  boxSizing: "border-box",
  width: "100%",
  border: "1px solid #ddd",
  borderRadius: 8,
  padding: 12,
  fontSize: 16,
  backgroundColor: "#fff",
  color: "#333",
};
