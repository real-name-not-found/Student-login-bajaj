
import { toast } from "@/components/ui/sonner";

// User type definition
export interface User {
  rollNumber: string;
  name: string;
}

// Form field type definitions
export interface FormField {
  fieldId: string;
  type: "text" | "tel" | "email" | "textarea" | "date" | "dropdown" | "radio" | "checkbox";
  label: string;
  placeholder?: string;
  required: boolean;
  dataTestId: string;
  validation?: {
    message: string;
  };
  options?: Array<{
    value: string;
    label: string;
    dataTestId?: string;
  }>;
  maxLength?: number;
  minLength?: number;
}

// Section type definition
export interface FormSection {
  sectionId: number;
  title: string;
  description: string;
  fields: FormField[];
}

// Form structure type definition
export interface FormStructure {
  formTitle: string;
  formId: string;
  version: string;
  sections: FormSection[];
}

// API response types
interface ApiResponse {
  message: string;
  success?: boolean;
}

export interface FormResponse extends ApiResponse {
  form: FormStructure;
}

export interface UserResponse extends ApiResponse {
  user?: User;
}

// API URLs
const API_BASE_URL = "https://dynamic-form-generator-9rl7.onrender.com";

// API service for the application
const apiService = {
  createUser: async (user: User): Promise<UserResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/create-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rollNumber: user.rollNumber,
          name: user.name,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast.error(data.message || "Failed to create user");
        return { success: false, message: data.message || "Failed to create user" };
      }
      
      toast.success(data.message || "User created successfully");
      return { success: true, message: data.message || "User created successfully", user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  },
  
  getForm: async (rollNumber: string): Promise<FormResponse | { success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-form?rollNumber=${rollNumber}`);
      
      const data = await response.json();
      
      if (!response.ok) {
        toast.error(data.message || "Failed to fetch form");
        return { success: false, message: data.message || "Failed to fetch form" };
      }
      
      return { ...data, success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  }
};

export default apiService;
