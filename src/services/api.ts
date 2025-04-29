
import { toast } from "@/components/ui/sonner";

// User type definition
export interface User {
  rollNumber: string;
  name: string;
}

// Form field type definitions
export interface FormField {
  id: string;
  type: "text" | "number" | "email" | "select" | "textarea" | "checkbox" | "radio";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
}

// Section type definition
export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

// Form structure type definition
export interface FormStructure {
  id: string;
  title: string;
  sections: FormSection[];
}

// Mock API functions with success/error handling
const mockAPI = {
  createUser: async (user: User): Promise<{ success: boolean; message: string; user?: User }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock validation
    if (!user.rollNumber || !user.name) {
      return { 
        success: false, 
        message: "Roll number and name are required" 
      };
    }
    
    // Mock successful response
    console.log("User registered:", user);
    return { 
      success: true, 
      message: "User registered successfully", 
      user 
    };
  },
  
  getForm: async (): Promise<{ success: boolean; message: string; form?: FormStructure }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock form structure
    const mockForm: FormStructure = {
      id: "student-application-form",
      title: "Student Application Form",
      sections: [
        {
          id: "personal-info",
          title: "Personal Information",
          description: "Please provide your personal details",
          fields: [
            {
              id: "fullName",
              type: "text",
              label: "Full Name",
              placeholder: "Enter your full name",
              validation: {
                required: true,
                minLength: 3,
                maxLength: 50
              }
            },
            {
              id: "email",
              type: "email",
              label: "Email Address",
              placeholder: "Enter your email address",
              validation: {
                required: true,
                pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
              }
            },
            {
              id: "phone",
              type: "text",
              label: "Phone Number",
              placeholder: "Enter your phone number",
              validation: {
                required: true,
                pattern: "^[0-9]{10}$"
              }
            }
          ]
        },
        {
          id: "academic-info",
          title: "Academic Information",
          description: "Please provide your academic details",
          fields: [
            {
              id: "highestQualification",
              type: "select",
              label: "Highest Qualification",
              options: [
                { value: "high-school", label: "High School" },
                { value: "bachelors", label: "Bachelor's Degree" },
                { value: "masters", label: "Master's Degree" },
                { value: "phd", label: "PhD" }
              ],
              validation: {
                required: true
              }
            },
            {
              id: "yearOfPassing",
              type: "number",
              label: "Year of Passing",
              placeholder: "Enter year of passing",
              validation: {
                required: true,
                min: 1990,
                max: new Date().getFullYear()
              }
            },
            {
              id: "cgpa",
              type: "number",
              label: "CGPA / Percentage",
              placeholder: "Enter your CGPA or percentage",
              validation: {
                required: true,
                min: 0,
                max: 100
              }
            }
          ]
        },
        {
          id: "course-preferences",
          title: "Course Preferences",
          description: "Select your preferred courses",
          fields: [
            {
              id: "preferredCourse",
              type: "select",
              label: "Preferred Course",
              options: [
                { value: "computer-science", label: "Computer Science" },
                { value: "electrical", label: "Electrical Engineering" },
                { value: "mechanical", label: "Mechanical Engineering" },
                { value: "civil", label: "Civil Engineering" },
                { value: "business", label: "Business Administration" }
              ],
              validation: {
                required: true
              }
            },
            {
              id: "secondaryInterests",
              type: "checkbox",
              label: "Secondary Interests",
              options: [
                { value: "ai-ml", label: "AI & Machine Learning" },
                { value: "blockchain", label: "Blockchain" },
                { value: "iot", label: "Internet of Things" },
                { value: "data-science", label: "Data Science" },
                { value: "cloud-computing", label: "Cloud Computing" }
              ]
            },
            {
              id: "comments",
              type: "textarea",
              label: "Additional Comments",
              placeholder: "Any additional information you'd like to provide"
            }
          ]
        }
      ]
    };
    
    return { 
      success: true, 
      message: "Form fetched successfully", 
      form: mockForm 
    };
  }
};

// API service for the application
const apiService = {
  createUser: async (user: User) => {
    try {
      const response = await mockAPI.createUser(user);
      
      if (!response.success) {
        toast.error(response.message);
        return { success: false, message: response.message };
      }
      
      toast.success(response.message);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  },
  
  getForm: async () => {
    try {
      const response = await mockAPI.getForm();
      
      if (!response.success || !response.form) {
        toast.error(response.message || "Failed to fetch form");
        return { success: false, message: response.message || "Failed to fetch form" };
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  }
};

export default apiService;
