
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

  const logoSrc = data.universityLogoUrl || "https://placehold.co/100x100.png?text=Logo";

  return (
    <div 
      ref={ref} 
      id="coverPageA4"
      className="a4-preview bg-white text-black shadow-lg mx-auto flex flex-col"
      style={{
        width: '190mm', 
        minHeight: '277mm', 
        height: '277mm', 
        boxSizing: 'border-box',
        fontFamily: "'Times New Roman', Times, serif",
        border: '3px solid black', 
        padding: '10mm', 
      }}
    >
      {/* University Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-1"> {/* Reduced gap */}
            <Image 
                src={logoSrc} 
                alt="University Logo" 
                width={70} 
                height={70} 
                className="object-contain"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/70x70.png?text=Error";
                  e.currentTarget.onerror = null; 
                }}
            />
            <div className="w-[3px] h-16 bg-black"></div> {/* Removed mx-3 */}
            {data.universityName && <h1 className="text-2xl font-bold text-left">{data.universityName}{data.universityAcronym ? ` (${data.universityAcronym})` : ''}</h1>}
        </div>
        {data.mainDepartmentName && <h2 className="text-2xl font-semibold mt-1">{data.mainDepartmentName}</h2>}
      </div>

      {/* Report Type */}
      {data.reportType && (
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold inline-block border-b-2 border-black pb-1">{data.reportType}</h2>
        </div>
      )}

      {/* Course Details */}
      {(data.courseTitle || data.courseCode) && (
        <div className="mb-10 text-base space-y-1 text-center">
          {data.courseTitle && <p><span className="font-semibold">Course Title:</span> {data.courseTitle}</p>}
          {data.courseCode && <p><span className="font-semibold">Course Code:</span> {data.courseCode}</p>}
        </div>
      )}
      
      {/* Submitted To */}
      <div className="mb-10 space-y-0.5 text-center"> 
        <h3 className="text-base font-semibold inline-block border-b-2 border-black pb-1 mb-1.5">Submitted To,</h3>
        {data.teacherName && <p className="text-base">{data.teacherName}</p>}
        {data.teacherDesignation && <p className="text-xs">{data.teacherDesignation}</p>}
        {data.teacherDepartment && <p className="text-xs">{data.teacherDepartment}</p>}
        {data.universityAcronym && <p className="text-xs">{data.universityAcronym}</p>}
      </div>

      {/* Submitted By */}
      <div className="mb-6 space-y-0.5 text-center">
        <h3 className="text-base font-semibold inline-block border-b-2 border-black pb-1 mb-1.5">Submitted by,</h3>
        {data.studentName && <p className="text-base">{data.studentName}</p>}
        {data.studentId && <p className="text-xs">Id-{data.studentId}</p>}
        {(data.studentBatch || data.studentSemester) && (
          <p className="text-xs">
            {data.studentBatch && `Batch-${data.studentBatch}`}
            {data.studentBatch && data.studentSemester && " "}
            {data.studentSemester && `(${data.studentSemester})`}
          </p>
        )}
        {data.studentDepartment && <p className="text-xs">Dept. Of {data.studentDepartment}</p>}
        {data.universityAcronym && <p className="text-xs">{data.universityAcronym}</p>}
      </div>
      
      {/* Submission Date - Pushed to bottom */}
      <div className="mt-auto pt-6 text-left"> 
        <p className="text-sm">Submission Date: {formattedSubmissionDate}</p>
      </div>

      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .a4-preview {
            border: 3px solid black !important; /* Ensure border prints */
            box-shadow: none !important;
            /* Avoid overriding dimensions set for html2pdf unless specifically needed for direct print */
          }
        }
        @media (max-width: 850px) { /* Responsive adjustments for smaller screens */
          .a4-preview {
            width: 100%; 
            height: auto; 
            min-height: 0; 
            aspect-ratio: 190 / 277; /* Maintain A4-like aspect ratio */
            padding: 5% !important; /* Adjust padding for smaller view */
            border-width: 2px !important; /* Thinner border for smaller view */
          }
           /* Adjust font sizes for smaller preview */
           .a4-preview h1 { font-size: 1.2rem; } 
           .a4-preview h2 { font-size: 1.0rem; } 
           .a4-preview h3 { font-size: 0.9rem; } 
           .a4-preview p { font-size: 0.75rem; } 
           .a4-preview .text-sm { font-size: 0.7rem; }
           .a4-preview .text-xs { font-size: 0.65rem; } 
           .a4-preview .text-base { font-size: 0.8rem; } 
        }
        /* Ensure Times New Roman and black text for PDF generation */
        #coverPageA4, #coverPageA4 * {
          color: #000000 !important; 
          font-family: 'Times New Roman', Times, serif !important;
        }
      `}</style>
    </div>
  );
});

CoverPagePreview.displayName = "CoverPagePreview";
export default CoverPagePreview;

