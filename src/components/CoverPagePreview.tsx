
"use client";

import React, { forwardRef } from 'react';
import type { CoverPageData } from '@/types/cover-page';
import { format } from 'date-fns';
import Image from 'next/image';

interface CoverPagePreviewProps {
  data: CoverPageData;
}

const CoverPagePreview = forwardRef<HTMLDivElement, CoverPagePreviewProps>(({ data }, ref) => {
  
  const formattedSubmissionDate = data.submissionDate 
    ? format(new Date(data.submissionDate), 'dd MMMM yyyy') 
    : 'N/A';

  // Use the provided logo URL or fallback to a generic placeholder if empty or undefined
  const logoSrc = data.universityLogoUrl || "https://placehold.co/100x100.png?text=Logo";


  return (
    <div 
      ref={ref} 
      id="coverPageA4"
      className="a4-preview bg-white text-black p-8 shadow-lg mx-auto border-2 border-black flex flex-col"
      style={{
        width: '210mm', 
        minHeight: '297mm', 
        boxSizing: 'border-box',
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      {/* University Header */}
      <div className="text-center mb-6">
        <Image 
            src={logoSrc} 
            alt="University Logo" 
            width={80} 
            height={80} 
            className="mx-auto mb-3 object-contain"
            onError={(e) => {
              // Fallback if the primary logo fails to load
              e.currentTarget.src = "https://placehold.co/100x100.png?text=Error";
              e.currentTarget.onerror = null; // Prevent infinite loop if placeholder also fails
            }}
        />
        {data.universityName && <h1 className="text-2xl font-bold">{data.universityName}{data.universityAcronym ? ` (${data.universityAcronym})` : ''}</h1>}
        {data.mainDepartmentName && <h2 className="text-xl font-semibold mt-1">{data.mainDepartmentName}</h2>}
      </div>

      {/* Report Type */}
      {data.reportType && (
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold inline-block border-b-2 border-black pb-1">{data.reportType}</h2>
        </div>
      )}

      {/* Course Details */}
      {(data.courseTitle || data.courseCode) && (
        <div className="mb-6 text-lg space-y-1 text-center">
          {data.courseTitle && <p><span className="font-semibold">Course Title:</span> {data.courseTitle}</p>}
          {data.courseCode && <p><span className="font-semibold">Course Code:</span> {data.courseCode}</p>}
        </div>
      )}
      
      {/* Submitted To */}
      <div className="mb-6 space-y-1 text-center">
        <h3 className="text-lg font-semibold inline-block border-b-2 border-black pb-1 mb-2">Submitted To,</h3>
        {data.teacherName && <p className="text-lg">{data.teacherName}</p>}
        {data.teacherDesignation && <p className="text-base">{data.teacherDesignation}</p>}
        {data.teacherDepartment && <p className="text-base">{data.teacherDepartment}</p>}
        {data.universityAcronym && <p className="text-base">{data.universityAcronym}</p>}
      </div>

      {/* Submitted By */}
      <div className="mb-6 space-y-1 text-center">
        <h3 className="text-lg font-semibold inline-block border-b-2 border-black pb-1 mb-2">Submitted by,</h3>
        {data.studentName && <p className="text-lg">{data.studentName}</p>}
        {data.studentId && <p className="text-base">Id-{data.studentId}</p>}
        {(data.studentBatch || data.studentSemester) && (
          <p className="text-base">
            {data.studentBatch && `Batch-${data.studentBatch}`}
            {data.studentBatch && data.studentSemester && " "}
            {data.studentSemester && `(${data.studentSemester})`}
          </p>
        )}
        {data.studentDepartment && <p className="text-base">Dept. Of {data.studentDepartment}</p>}
        {data.universityAcronym && <p className="text-base">{data.universityAcronym}</p>}
      </div>
      
      {/* Submission Date - Pushed to bottom */}
      <div className="mt-auto pt-8 text-left">
        <p className="text-base">Submission Date: {formattedSubmissionDate}</p>
      </div>

      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .a4-preview {
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important; 
            width: 100% !important;
            min-height: 0 !important;
            height: auto !important;
          }
        }
        @media (max-width: 850px) { 
          .a4-preview {
            width: 100%;
            height: auto;
            min-height: 0; 
            aspect-ratio: 210 / 297;
            padding: 5% !important; /* Keep responsive padding */
            border-width: 1px !important; /* Thinner border for mobile preview */
          }
           .a4-preview h1 { font-size: 1.3rem; } /* Adjusted sizes for mobile */
           .a4-preview h2 { font-size: 1.1rem; } 
           .a4-preview h3 { font-size: 1rem; } 
           .a4-preview p { font-size: 0.8rem; } 
           .a4-preview .text-base { font-size: 0.8rem; }
           .a4-preview .text-lg { font-size: 0.9rem; } 
        }
        #coverPageA4, #coverPageA4 * {
          color: #000000 !important; 
        }
      `}</style>
    </div>
  );
});

CoverPagePreview.displayName = "CoverPagePreview";
export default CoverPagePreview;
