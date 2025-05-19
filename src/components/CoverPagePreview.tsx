
"use client";

import React, { forwardRef } from 'react';
import type { CoverPageData } from '@/types/cover-page';
import { format } from 'date-fns';
import Image from 'next/image'; // Import next/image

interface CoverPagePreviewProps {
  data: CoverPageData;
}

const CoverPagePreview = forwardRef<HTMLDivElement, CoverPagePreviewProps>(({ data }, ref) => {
  
  const formattedSubmissionDate = data.submissionDate 
    ? format(new Date(data.submissionDate), 'dd MMMM yyyy') 
    : 'N/A';

  const logoSrc = data.universityLogoUrl || "https://placehold.co/100x100.png";


  return (
    <div 
      ref={ref} 
      id="coverPageA4"
      className="a4-preview bg-white text-black p-12 shadow-lg mx-auto border border-gray-300 flex flex-col" // Added flex flex-col
      style={{
        width: '210mm', 
        minHeight: '297mm', 
        boxSizing: 'border-box',
        fontFamily: 'var(--font-geist-sans)', 
      }}
    >
      {/* University Header */}
      <div className="text-center mb-8">
        <Image 
            src={logoSrc} 
            alt="University Logo" 
            width={80} 
            height={80} 
            className="mx-auto mb-3 object-contain"
            data-ai-hint="university logo" 
        />
        {data.universityName && <h1 className="text-2xl font-bold">{data.universityName}{data.universityAcronym ? ` (${data.universityAcronym})` : ''}</h1>}
        {data.mainDepartmentName && <h2 className="text-xl font-semibold mt-1">{data.mainDepartmentName}</h2>}
      </div>

      {/* Report Type */}
      {data.reportType && (
        <div className="text-center mb-12">
          <h2 className="text-xl font-bold inline-block border-b-2 border-black pb-1">{data.reportType}</h2>
        </div>
      )}

      {/* Course Details */}
      {(data.courseTitle || data.courseCode) && (
        <div className="mb-10 text-lg space-y-1">
          {data.courseTitle && <p><span className="font-semibold">Course Title:</span> {data.courseTitle}</p>}
          {data.courseCode && <p><span className="font-semibold">Course Code:</span> {data.courseCode}</p>}
        </div>
      )}
      
      {/* Submitted To */}
      <div className="mb-10 space-y-1">
        <h3 className="text-lg font-semibold inline-block border-b-2 border-black pb-1 mb-2">Submitted To,</h3>
        {data.teacherName && <p className="text-lg">{data.teacherName}</p>}
        {data.teacherDesignation && <p className="text-base text-gray-800">{data.teacherDesignation}</p>}
        {data.teacherDepartment && <p className="text-base text-gray-800">{data.teacherDepartment}</p>}
        {data.universityAcronym && <p className="text-base text-gray-800">{data.universityAcronym}</p>}
      </div>

      {/* Submitted By */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold inline-block border-b-2 border-black pb-1 mb-2">Submitted by,</h3>
        {data.studentName && <p className="text-lg">{data.studentName}</p>}
        {data.studentId && <p className="text-base text-gray-800">Id-{data.studentId}</p>}
        {(data.studentBatch || data.studentSemester) && (
          <p className="text-base text-gray-800">
            {data.studentBatch && `Batch-${data.studentBatch}`}
            {data.studentBatch && data.studentSemester && " "}
            {data.studentSemester && `(${data.studentSemester})`}
          </p>
        )}
        {data.studentDepartment && <p className="text-base text-gray-800">Dept. Of {data.studentDepartment}</p>}
        {data.universityAcronym && <p className="text-base text-gray-800">{data.universityAcronym}</p>}
      </div>
      
      {/* Submission Date - Pushed to bottom */}
      <div className="mt-auto pt-12 text-left">
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
            padding: 0 !important; /* Adjust as needed for print margins */
            width: 100% !important;
            min-height: 0 !important;
            height: auto !important; /* Or 100vh for single page */
          }
        }
        @media (max-width: 850px) { 
          .a4-preview {
            width: 100%;
            height: auto;
            min-height: 0; 
            aspect-ratio: 210 / 297;
            padding: 5% !important;
          }
           .a4-preview h1 { font-size: 1.5rem; } /* Approx 24px */
           .a4-preview h2 { font-size: 1.25rem; } /* Approx 20px */
           .a4-preview h3 { font-size: 1.125rem; } /* Approx 18px */
           .a4-preview p { font-size: 0.875rem; } /* Approx 14px */
           .a4-preview .text-base { font-size: 0.875rem; }
           .a4-preview .text-lg { font-size: 1rem; } /* Approx 16px */
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
