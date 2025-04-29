
import React, { createContext, useContext, useState, ReactNode } from "react";
import { FormStructure, FormSection, FormField } from "@/services/api";

interface FormContextProps {
  formData: Record<string, any>;
  updateFormData: (fieldId: string, value: any) => void;
  formStructure: FormStructure | null;
  setFormStructure: (structure: FormStructure) => void;
  currentSectionIndex: number;
  setCurrentSectionIndex: (index: number) => void;
  validateSection: (sectionId: number) => boolean;
  getFieldError: (field: FormField, value: any) => string | null;
}

const FormContext = createContext<FormContextProps | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formStructure, setFormStructure] = useState<FormStructure | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  // Update form data
  const updateFormData = (fieldId: string, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldId]: value
    }));
  };

  // Validate a field based on its validation rules
  const getFieldError = (field: FormField, value: any): string | null => {
    // Skip validation if value is empty and field is not required
    if (!field.required && (value === undefined || value === null || value === "")) {
      return null;
    }

    // Required validation
    if (field.required && (value === undefined || value === null || value === "")) {
      return field.validation?.message || `${field.label} is required`;
    }

    // Skip other validations if value is empty 
    if (value === undefined || value === null || value === "") {
      return null;
    }

    // String validations for text, email, tel, textarea
    if (typeof value === "string" && ["text", "email", "tel", "textarea"].includes(field.type)) {
      // Min length validation
      if (field.minLength && value.length < field.minLength) {
        return `${field.label} must be at least ${field.minLength} characters`;
      }

      // Max length validation
      if (field.maxLength && value.length > field.maxLength) {
        return `${field.label} cannot exceed ${field.maxLength} characters`;
      }

      // Email validation
      if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Please enter a valid email address";
      }

      // Tel validation
      if (field.type === "tel" && !/^[0-9+\-() ]+$/.test(value)) {
        return "Please enter a valid phone number";
      }
    }

    return null;
  };

  // Validate all fields in a section
  const validateSection = (sectionId: number): boolean => {
    if (!formStructure) return false;

    const section = formStructure.sections.find(s => s.sectionId === sectionId);
    if (!section) return false;

    for (const field of section.fields) {
      const value = formData[field.fieldId];
      const error = getFieldError(field, value);
      if (error) {
        return false;
      }
    }

    return true;
  };

  const value = {
    formData,
    updateFormData,
    formStructure,
    setFormStructure,
    currentSectionIndex,
    setCurrentSectionIndex,
    validateSection,
    getFieldError
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};
