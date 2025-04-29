
import React from "react";
import { FormSection } from "@/services/api";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  sections: FormSection[];
  currentSectionIndex: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  sections,
  currentSectionIndex,
}) => {
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        {sections.map((section, index) => (
          <React.Fragment key={section.sectionId}>
            {/* Circle indicator */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium",
                  index < currentSectionIndex
                    ? "bg-student-secondary text-white"
                    : index === currentSectionIndex
                    ? "bg-student-primary text-white"
                    : "bg-gray-200 text-gray-600"
                )}
                data-testid={`progress-step-${index + 1}`}
              >
                {index + 1}
              </div>
              <span className="text-xs mt-1 font-medium text-gray-600 max-w-[80px] text-center">
                {section.title}
              </span>
            </div>
            
            {/* Line between circles */}
            {index < sections.length - 1 && (
              <div className="flex-1 mx-2">
                <div 
                  className={cn(
                    "h-1 w-full", 
                    index < currentSectionIndex 
                      ? "bg-student-secondary" 
                      : "bg-gray-200"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
