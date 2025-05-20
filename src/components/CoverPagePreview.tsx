
"use client";

import React, { forwardRef } from 'react';
import type { CoverPageData } from '@/types/cover-page';
import { format } from 'date-fns';
// Using standard img tag for better compatibility with html2pdf.js
// import Image from 'next/image';

interface CoverPagePreviewProps {
  data: CoverPageData;
}

const CoverPagePreview = forwardRef<HTMLDivElement, CoverPagePreviewProps>(({ data }, ref) => {

  const formattedSubmissionDate = data.submissionDate
    ? format(new Date(data.submissionDate), 'dd MMMM yyyy')
    : 'N/A';

  // Use a placeholder if universityLogoUrl is empty or undefined
  const logoSrc = data.universityLogoUrl || "https://placehold.co/70x70.png?text=Logo";

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
        fontSize: '11pt', // Base font size for the entire cover page
        border: '3px solid black',
        padding: '10mm',
      }}
    >
      {/* University Header */}
      <div className="text-center mb-6">
        <div className="flex flex-col items-center justify-center gap-1 mb-2">
            {/* Using standard img tag */}
            <img
                id="universityLogoImage" // ID for potential direct manipulation if needed
                src={logoSrc}
                alt="University Logo"
                width={70}
                height={70}
                className="object-contain"
                // crossOrigin="anonymous" // Not needed for local images or data URIs
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/70x70.png?text=Error";
                  target.onerror = null;
                }}
            />
            {data.universityName && <h1 className="text-3xl font-bold text-center">{data.universityName}{data.universityAcronym ? ` (${data.universityAcronym})` : ''}</h1>}
        </div>
        {data.mainDepartmentName && <h2 className="text-3xl font-semibold mt-1">{data.mainDepartmentName}</h2>}
      </div>

      {/* Report Type */}
      {data.reportType && (
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold inline-block border-b-2 border-black pb-1">{data.reportType}</h2>
        </div>
      )}

      {/* Course Details */}
      {(data.courseTitle || data.courseCode) && (
        <div className="mb-10 text-lg space-y-1 text-center">
          {data.courseTitle && <p><span className="font-semibold">Course Title:</span> {data.courseTitle}</p>}
          {data.courseCode && <p><span className="font-semibold">Course Code:</span> {data.courseCode}</p>}
        </div>
      )}

      {/* Submitted To */}
      <div className="mb-10 space-y-0.5 text-center">
        <h3 className="text-lg font-semibold inline-block border-b-2 border-black pb-1 mb-1.5">Submitted To,</h3>
        {data.teacherName && <p className="text-lg">{data.teacherName}</p>}
        {data.teacherDesignation && <p className="text-sm">{data.teacherDesignation}</p>}
        {data.teacherDepartment && <p className="text-sm">{data.teacherDepartment}</p>}
        {data.universityAcronym && <p className="text-sm">{data.universityAcronym}</p>}
      </div>

      {/* Submitted By */}
      <div className="mb-4 space-y-0.5 text-center"> {/* Decreased bottom margin */}
        <h3 className="text-lg font-semibold inline-block border-b-2 border-black pb-1 mb-1.5">Submitted by,</h3>
        {data.studentName && <p className="text-lg">{data.studentName}</p>}
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
      <div className="mt-auto pt-6 text-left">
        <p className="text-base">Submission Date: {formattedSubmissionDate}</p>
      </div>

      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .a4-preview {
            border: 3px solid black !important;
            box-shadow: none !important;
          }
        }
        @media (max-width: 850px) {
          .a4-preview {
            width: 100%;
            height: auto;
            min-height: 0;
            aspect-ratio: 190 / 277;
            padding: 5% !important;
            border-width: 2px !important;
          }
           .a4-preview h1 { font-size: 1.2rem; }
           .a4-preview h2 { font-size: 1.1rem; }
           .a4-preview h3 { font-size: 0.9rem; }
           .a4-preview p { font-size: 0.825rem; }
           .a4-preview .text-sm { font-size: 0.77rem; }
           .a4-preview .text-xs { font-size: 0.715rem; }
           .a4-preview .text-base { font-size: 0.88rem; }
        }
        /* Specific styles for print and general display */
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

