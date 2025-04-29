
import React, { useEffect, useState } from "react";
import { FormField as FormFieldType } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "@/context/FormContext";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  field: FormFieldType;
}

const FormField: React.FC<FormFieldProps> = ({ field }) => {
  const { formData, updateFormData, getFieldError } = useForm();
  const [error, setError] = useState<string | null>(null);
  const value = formData[field.fieldId];
  
  // Validate on value change
  useEffect(() => {
    if (value !== undefined) {
      const validationError = getFieldError(field, value);
      setError(validationError);
    }
  }, [value, field, getFieldError]);

  // Handle change for different field types
  const handleChange = (newValue: any) => {
    updateFormData(field.fieldId, newValue);
  };

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "tel":
      case "email":
        return (
          <Input
            id={field.fieldId}
            type={field.type}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            className={cn(error && "border-red-500")}
            data-testid={field.dataTestId}
            maxLength={field.maxLength}
          />
        );
      
      case "textarea":
        return (
          <Textarea
            id={field.fieldId}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            className={cn(error && "border-red-500")}
            data-testid={field.dataTestId}
            maxLength={field.maxLength}
          />
        );
      
      case "date":
        return (
          <Input
            id={field.fieldId}
            type="date"
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            className={cn(error && "border-red-500")}
            data-testid={field.dataTestId}
          />
        );
      
      case "dropdown":
        return (
          <Select
            value={value || ""}
            onValueChange={handleChange}
          >
            <SelectTrigger className={cn(error && "border-red-500")} data-testid={field.dataTestId}>
              <SelectValue placeholder={field.placeholder || "Select option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value} 
                  data-testid={option.dataTestId}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case "checkbox":
        return (
          <div className="space-y-2 mt-1">
            {field.options?.map((option) => {
              const isChecked = Array.isArray(value) && value.includes(option.value);
              
              return (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.fieldId}-${option.value}`}
                    checked={isChecked}
                    data-testid={option.dataTestId}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        // Add to array if checked
                        const newValues = [...(Array.isArray(value) ? value : []), option.value];
                        handleChange(newValues);
                      } else {
                        // Remove from array if unchecked
                        const newValues = Array.isArray(value) 
                          ? value.filter(v => v !== option.value) 
                          : [];
                        handleChange(newValues);
                      }
                    }}
                  />
                  <Label 
                    htmlFor={`${field.fieldId}-${option.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              );
            })}
          </div>
        );
      
      case "radio":
        return (
          <RadioGroup
            value={value || ""}
            onValueChange={handleChange}
            className="mt-1"
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option.value} 
                  id={`${field.fieldId}-${option.value}`}
                  data-testid={option.dataTestId}
                />
                <Label 
                  htmlFor={`${field.fieldId}-${option.value}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2 mb-4">
      <Label htmlFor={field.fieldId} className={cn(field.required && "after:content-['*'] after:ml-0.5 after:text-red-500")}>
        {field.label}
      </Label>
      {renderField()}
      {error && <p className="text-sm text-red-500" data-testid={`error-${field.dataTestId}`}>{error}</p>}
    </div>
  );
};

export default FormField;
