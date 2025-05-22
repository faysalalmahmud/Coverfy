
"use client";

import React, { forwardRef } from 'react';
import type { CoverPageData } from '@/types/cover-page';
// Using standard img tag for better compatibility with html2pdf.js

interface CoverPagePreviewProps {
  data: CoverPageData;
}

const CoverPagePreview = forwardRef<HTMLDivElement, CoverPagePreviewProps>(({ data }, ref) => {

  const displaySubmissionDate = data.submissionDate || 'N/A';
  const logoSrc = data.universityLogoUrl || "https://placehold.co/80x80.png";


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
        fontSize: '12pt', // Base font size for PDF
        border: '3px solid black',
        padding: '10mm',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}
    >
      {/* University Header */}
      <div className="text-center mb-6 preview-content-block">
        <div className="flex flex-col items-center justify-center gap-1 mb-2">
            <img
                id="universityLogoImage"
                src={logoSrc}
                alt="University Logo"
                className="object-contain university-logo-img"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/80x80.png";
                  target.onerror = null;
                }}
            />
            {data.universityName && <h1 className="text-2xl font-bold text-center">{data.universityName}{data.universityAcronym ? ` (${data.universityAcronym})` : ''}</h1>}
        </div>
        {data.mainDepartmentName && <h2 className="text-2xl font-semibold mt-1">{data.mainDepartmentName}</h2>}
      </div>

      {/* Report Type */}
      {data.reportType && (
        <div className="text-center mb-10 preview-content-block report-type-spacing">
          <h2 className="text-2xl font-semibold inline-block border-b-2 border-black pb-1">{data.reportType}</h2>
        </div>
      )}

      {/* Course Details */}
      {(data.courseTitle || data.courseCode) && (
        <div className="mb-10 text-xl space-y-1 text-center preview-content-block">
          {data.courseTitle && <p><span className="font-semibold">Course Title:</span> {data.courseTitle}</p>}
          {data.courseCode && <p><span className="font-semibold">Course Code:</span> {data.courseCode}</p>}
        </div>
      )}

      {/* Submitted To */}
      <div className="mb-10 space-y-0.5 text-center preview-content-block">
        <h3 className="text-xl font-semibold inline-block border-b-2 border-black pb-1 mb-1.5">Submitted To,</h3>
        {data.teacherName && <p className="text-xl">{data.teacherName}</p>}
        {data.teacherDesignation && <p className="text-base">{data.teacherDesignation}</p>}
        {data.teacherDepartment && <p className="text-base">{data.teacherDepartment}</p>}
        {data.universityAcronym && <p className="text-base">{data.universityAcronym}</p>}
      </div>

      {/* Submitted By */}
      <div className="mb-6 space-y-0.5 text-center preview-content-block">
        <h3 className="text-xl font-semibold inline-block border-b-2 border-black pb-1 mb-1.5">Submitted by,</h3>
        {data.studentName && <p className="text-xl">{data.studentName}</p>}
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
      <div className="mt-auto pt-6 text-left">
        <p className="text-lg">Submission Date: {displaySubmissionDate}</p>
      </div>

      <style jsx global>{`
        .university-logo-img {
          width: 80px; 
          height: 80px; 
          object-fit: contain;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .a4-preview {
            box-shadow: none !important; 
          }
        }
        
        @media (max-width: 850px) { 
          .a4-preview {
            width: 100%;
            height: auto;
            min-height: 0;
            aspect-ratio: 190 / 277;
            padding: 2% !important; 
            border-width: 1px !important; 
          }
           .a4-preview h1 { font-size: 1.4rem !important; } 
           .a4-preview h2 { font-size: 1.3rem !important; } 
           .a4-preview h3 { font-size: 1.2rem !important; } 
           .a4-preview p { font-size: 1.1rem !important; } 
           .a4-preview .text-sm { font-size: 1.0rem !important; } 
           .a4-preview .text-xs { font-size: 0.9rem !important; } 
           .a4-preview .text-base { font-size: 1.1rem !important; } 
           .a4-preview .text-lg { font-size: 1.2rem !important; } 
           .a4-preview .text-xl { font-size: 1.3rem !important; } 
           .a4-preview .university-logo-img {
             width: 55px !important;
             height: 55px !important;
           }
           .a4-preview .preview-content-block {
             margin-bottom: 0.6rem !important; 
           }
           .a4-preview .report-type-spacing { /* Added class for report type div */
             margin-bottom: 1.2rem !important; /* Increase space after report type for small devices */
           }
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

