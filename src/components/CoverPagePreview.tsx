
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
        width: '210mm', 
        minHeight: '297mm', 
        height: '297mm', 
        boxSizing: 'border-box',
        fontFamily: "'Times New Roman', Times, serif",
        border: '2px solid black',
        padding: '15mm', 
      }}
    >
      {/* University Header */}
      <div className="text-center mb-6">
        <Image 
            src={logoSrc} 
            alt="University Logo" 
            width={70} 
            height={70} 
            className="mx-auto mb-2 object-contain"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/70x70.png?text=Error";
              e.currentTarget.onerror = null; 
            }}
        />
        {data.universityName && <h1 className="text-2xl font-bold">{data.universityName}{data.universityAcronym ? ` (${data.universityAcronym})` : ''}</h1>}
        {data.mainDepartmentName && <h2 className="text-xl font-semibold mt-1">{data.mainDepartmentName}</h2>}
      </div>

      {/* Report Type */}
      {data.reportType && (
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold inline-block border-b-2 border-black pb-1">{data.reportType}</h2>
        </div>
      )}

      {/* Course Details */}
      {(data.courseTitle || data.courseCode) && (
        <div className="mb-10 text-base space-y-1 text-center"> {/* Increased mb here */}
          {data.courseTitle && <p><span className="font-semibold">Course Title:</span> {data.courseTitle}</p>}
          {data.courseCode && <p><span className="font-semibold">Course Code:</span> {data.courseCode}</p>}
        </div>
      )}
      
      {/* Submitted To */}
      <div className="mb-10 space-y-0.5 text-center"> {/* Increased mb here */}
        <h3 className="text-base font-semibold inline-block border-b-2 border-black pb-1 mb-1.5">Submitted To,</h3>
        {data.teacherName && <p className="text-base">{data.teacherName}</p>}
        {data.teacherDesignation && <p className="text-sm">{data.teacherDesignation}</p>}
        {data.teacherDepartment && <p className="text-sm">{data.teacherDepartment}</p>}
        {data.universityAcronym && <p className="text-sm">{data.universityAcronym}</p>}
      </div>

      {/* Submitted By */}
      <div className="mb-6 space-y-0.5 text-center">
        <h3 className="text-base font-semibold inline-block border-b-2 border-black pb-1 mb-1.5">Submitted by,</h3>
        {data.studentName && <p className="text-base">{data.studentName}</p>}
        {data.studentId && <p className="text-sm">Id-{data.studentId}</p>}
        {(data.studentBatch || data.studentSemester) && (
          <p className="text-sm">
            {data.studentBatch && `Batch-${data.studentBatch}`}
            {data.studentBatch && data.studentSemester && " "}
            {data.studentSemester && `(${data.studentSemester})`}
          </p>
        )}
        {data.studentDepartment && <p className="text-sm">Dept. Of {data.studentDepartment}</p>}
        {data.universityAcronym && <p className="text-sm">{data.universityAcronym}</p>}
      </div>
      
      {/* Submission Date - Pushed to bottom */}
      <div className="mt-auto pt-8 text-left"> 
        <p className="text-sm">Submission Date: {formattedSubmissionDate}</p>
      </div>

      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .a4-preview {
            border: 2px solid black !important; 
            box-shadow: none !important;
            margin: 0 !important;
            padding: 15mm !important; 
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            box-sizing: border-box !important;
          }
        }
        @media (max-width: 850px) { 
          .a4-preview {
            width: 100%; 
            height: auto; 
            min-height: 0; 
            aspect-ratio: 210 / 297; 
            padding: 5% !important; 
            border-width: 1px !important; 
          }
           .a4-preview h1 { font-size: 1.2rem; } 
           .a4-preview h2 { font-size: 1.0rem; } 
           .a4-preview h3 { font-size: 0.9rem; } 
           .a4-preview p { font-size: 0.75rem; } 
           .a4-preview .text-sm { font-size: 0.7rem; }
           .a4-preview .text-base { font-size: 0.8rem; } 
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
