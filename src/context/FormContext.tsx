
import React, { createContext, useContext, useState, ReactNode } from "react";
import { FormStructure, FormSection } from "@/services/api";

interface FormContextProps {
  formData: Record<string, any>;
  updateFormData: (fieldId: string, value: any) => void;
  formStructure: FormStructure | null;
  setFormStructure: (structure: FormStructure) => void;
  currentSectionIndex: number;
  setCurrentSectionIndex: (index: number) => void;
  validateSection: (sectionId: string) => boolean;
  getFieldError: (fieldId: string, value: any) => string | null;
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
  const getFieldError = (fieldId: string, value: any): string | null => {
    if (!formStructure) return null;

    // Find the field in any section
    let field = null;
    for (const section of formStructure.sections) {
      const foundField = section.fields.find(f => f.id === fieldId);
      if (foundField) {
        field = foundField;
        break;
      }
    }

    if (!field || !field.validation) return null;

    const validation = field.validation;

    // Required validation
    if (validation.required && (value === undefined || value === null || value === "")) {
      return `${field.label} is required`;
    }

    // Skip other validations if value is empty and not required
    if (value === undefined || value === null || value === "") {
      return null;
    }

    // Type-specific validations
    if (typeof value === "string") {
      // Min length validation
      if (validation.minLength && value.length < validation.minLength) {
        return `${field.label} must be at least ${validation.minLength} characters`;
      }

      // Max length validation
      if (validation.maxLength && value.length > validation.maxLength) {
        return `${field.label} cannot exceed ${validation.maxLength} characters`;
      }

      // Pattern validation
      if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
        return `${field.label} is not in a valid format`;
      }
    }

    if (typeof value === "number") {
      // Min value validation
      if (validation.min !== undefined && value < validation.min) {
        return `${field.label} must be at least ${validation.min}`;
      }

      // Max value validation
      if (validation.max !== undefined && value > validation.max) {
        return `${field.label} cannot exceed ${validation.max}`;
      }
    }

    return null;
  };

  // Validate all fields in a section
  const validateSection = (sectionId: string): boolean => {
    if (!formStructure) return false;

    const section = formStructure.sections.find(s => s.id === sectionId);
    if (!section) return false;

    for (const field of section.fields) {
      if (!field.validation?.required && (formData[field.id] === undefined || formData[field.id] === null || formData[field.id] === "")) {
        continue; // Skip non-required empty fields
      }

      const error = getFieldError(field.id, formData[field.id]);
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
