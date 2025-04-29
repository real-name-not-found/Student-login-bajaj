
import React from "react";
import { FormSection as FormSectionType } from "@/services/api";
import FormField from "./FormField";
import { useForm } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FormSectionProps {
  section: FormSectionType;
  isFirst: boolean;
  isLast: boolean;
  onSubmit: () => void;
}

const FormSection: React.FC<FormSectionProps> = ({
  section,
  isFirst,
  isLast,
  onSubmit,
}) => {
  const { validateSection, currentSectionIndex, setCurrentSectionIndex } = useForm();

  const handleNext = () => {
    if (validateSection(section.sectionId)) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handlePrev = () => {
    setCurrentSectionIndex(currentSectionIndex - 1);
  };

  const handleSubmitForm = () => {
    if (validateSection(section.sectionId)) {
      onSubmit();
    }
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-student-secondary">{section.title}</CardTitle>
        {section.description && (
          <CardDescription>{section.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {section.fields.map((field) => (
          <FormField key={field.fieldId} field={field} />
        ))}

        <div className="flex justify-between mt-6">
          {!isFirst && (
            <Button 
              type="button" 
              onClick={handlePrev}
              variant="outline"
              className="border-student-primary text-student-primary hover:bg-student-accent hover:text-student-secondary"
              data-testid="prev-button"
            >
              Previous
            </Button>
          )}
          
          <div className="ml-auto">
            {isLast ? (
              <Button 
                type="button" 
                onClick={handleSubmitForm}
                className="bg-student-secondary hover:bg-student-primary"
                data-testid="submit-button"
              >
                Submit
              </Button>
            ) : (
              <Button 
                type="button" 
                onClick={handleNext}
                className="bg-student-primary hover:bg-student-secondary"
                data-testid="next-button"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormSection;
