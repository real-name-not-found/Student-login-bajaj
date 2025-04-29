
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "@/context/FormContext";
import apiService, { User } from "@/services/api";
import FormSection from "@/components/FormSection";
import ProgressIndicator from "@/components/ProgressIndicator";
import { toast } from "@/components/ui/sonner";

const FormPage: React.FC = () => {
  const {
    formStructure,
    setFormStructure,
    currentSectionIndex,
    formData,
  } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const userString = sessionStorage.getItem("user");
    if (!userString) {
      toast.error("Please login first");
      navigate("/");
      return;
    }

    // Fetch form structure
    const fetchForm = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getForm();
        if (response.success && response.form) {
          setFormStructure(response.form);
        } else {
          toast.error("Failed to load form");
          navigate("/");
        }
      } catch (error) {
        toast.error("An error occurred while loading the form");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [navigate, setFormStructure]);

  const handleFormSubmit = () => {
    // Submit the form data
    console.log("Form submitted with data:", formData);
    toast.success("Form submitted successfully!");
    
    // Show the form data
    alert("Form submitted! Check console for form data");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-student-light">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-student-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-student-secondary font-medium">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!formStructure) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-student-light">
        <div className="text-center">
          <p className="text-red-500">Failed to load form</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-student-primary text-white rounded-md"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  const currentSection = formStructure.sections[currentSectionIndex];

  return (
    <div className="min-h-screen bg-student-light py-8 px-4">
      <div className="container max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-student-secondary">
          {formStructure.title}
        </h1>

        <ProgressIndicator
          sections={formStructure.sections}
          currentSectionIndex={currentSectionIndex}
        />

        <FormSection
          section={currentSection}
          isFirst={currentSectionIndex === 0}
          isLast={currentSectionIndex === formStructure.sections.length - 1}
          onSubmit={handleFormSubmit}
        />
      </div>
    </div>
  );
};

// Wrapped component to ensure FormContext is available
const FormPageWrapper: React.FC = () => {
  return (
    <FormProvider>
      <FormPage />
    </FormProvider>
  );
};

export default FormPageWrapper;
