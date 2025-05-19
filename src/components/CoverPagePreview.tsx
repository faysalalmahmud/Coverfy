"use client";

import React, { forwardRef, useEffect, useState } from 'react';
import type { CoverPageData } from '@/types/cover-page';
import { format } from 'date-fns';

interface CoverPagePreviewProps {
  data: CoverPageData;
}

const CoverPagePreview = forwardRef<HTMLDivElement, CoverPagePreviewProps>(({ data }, ref) => {
  const [submissionDate, setSubmissionDate] = useState('');

  useEffect(() => {
    setSubmissionDate(format(new Date(), 'MMMM dd, yyyy'));
  }, []);

  const renderField = (label: string, value: string | undefined | null, className: string = "text-base") => {
    if (!value || value.trim() === '') return null;
    return (
      <p className={className}>
        <span className="font-semibold">{label}: </span>{value}
      </p>
    );
  };
  
  const renderSectionTitle = (title: string) => {
    return <h3 className="text-lg font-semibold mt-6 mb-2 border-b pb-1">{title}</h3>;
  }

  return (
    <div 
      ref={ref} 
      id="coverPageA4"
      className="a4-preview bg-white text-black p-8 shadow-lg mx-auto border border-gray-300 overflow-hidden"
      style={{
        width: '210mm', // Fixed width for PDF generation accuracy
        minHeight: '297mm', // Fixed height
        boxSizing: 'border-box',
        fontFamily: 'var(--font-geist-sans)', // Ensures Geist font is used
      }}
    >
      <div className="text-center mb-12">
        {data.reportType && <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{data.reportType}</h1>}
        {data.courseTitle && <h2 className="text-2xl font-semibold mb-1">{data.courseTitle}</h2>}
        {data.courseCode && <p className="text-lg text-gray-700">({data.courseCode})</p>}
      </div>

      <div className="space-y-3 mb-10">
         {renderSectionTitle("Submitted To")}
         {data.teacherName && <p className="text-lg">{data.teacherName}</p>}
         {data.teacherDesignation && <p className="text-md text-gray-800">{data.teacherDesignation}</p>}
         {data.teacherDepartment && <p className="text-md text-gray-800">{data.teacherDepartment}</p>}
      </div>

      <div className="space-y-3">
        {renderSectionTitle("Submitted By")}
        {data.studentName && <p className="text-lg">{data.studentName}</p>}
        {data.studentId && <p className="text-md text-gray-800">ID: {data.studentId}</p>}
        {data.studentDepartment && <p className="text-md text-gray-800">Department: {data.studentDepartment}</p>}
        {data.studentBatch && <p className="text-md text-gray-800">Batch: {data.studentBatch}</p>}
        {data.studentSemester && <p className="text-md text-gray-800">Semester: {data.studentSemester}</p>}
      </div>
      
      <div className="mt-20 text-center">
        <p className="text-md font-semibold">Date of Submission</p>
        <p className="text-md text-gray-800">{submissionDate}</p>
      </div>

      {/* Styling to ensure the preview scales down on smaller screens while maintaining aspect ratio for html2pdf */}
      <style jsx global>{`
        @media (max-width: 850px) { /* Approx 210mm + padding */
          .a4-preview {
            width: 100%;
            height: auto;
            min-height: 0; /* Allow height to be determined by aspect ratio */
            aspect-ratio: 210 / 297;
            padding: 5%; /* Responsive padding */
            transform-origin: top left;
          }
           .a4-preview h1 { font-size: 1.875rem; } /* 30px */
           .a4-preview h2 { font-size: 1.5rem; } /* 24px */
           .a4-preview p, .a4-preview h3 { font-size: 0.875rem; } /* 14px */
        }
        /* Ensure specific text styling for PDF */
        #coverPageA4, #coverPageA4 * {
          color: #000000 !important; /* Black text */
        }
      `}</style>
    </div>
  );
});

CoverPagePreview.displayName = "CoverPagePreview";
export default CoverPagePreview;
