
"use client";

import React, { forwardRef, useRef, useState, useEffect, useCallback } from 'react';
import type { CoverPageData } from '@/types/cover-page';

interface CoverPagePreviewProps {
  data: CoverPageData;
}

const CoverPagePreview = forwardRef<HTMLDivElement, CoverPagePreviewProps>(({ data }, ref) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const updateScale = useCallback(() => {
    if (wrapperRef.current) {
      const containerWidth = wrapperRef.current.offsetWidth;
      const a4WidthPx = 190 * 3.7795; // 190mm in px (~718px)
      if (containerWidth < a4WidthPx) {
        setScale(containerWidth / a4WidthPx);
      } else {
        setScale(1);
      }
    }
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  const displaySubmissionDate = data.submissionDate || 'N/A';
  const logoSrc = data.universityLogoUrl || "https://placehold.co/80x80.png";


  const a4HeightPx = 277 * 3.7795; // ~1047px

  return (
    <div
      ref={wrapperRef}
      className="a4-preview-wrapper"
      style={{ height: scale < 1 ? `${a4HeightPx * scale}px` : 'auto' }}
    >
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
        fontSize: '12pt',
        border: '4px solid black',
        padding: '10mm',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        transformOrigin: 'top left',
        transform: scale < 1 ? `scale(${scale})` : 'none',
      }}
    >
      {/* University Header */}
      <div className="text-center mb-6 preview-content-block university-header-block">
        <div className="flex flex-col items-center justify-center gap-1 mb-2">
            <img
                id="universityLogoImage"
                src={logoSrc}
                alt="University Logo"
                className="object-contain university-logo-img"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/80x80.png"; // Fallback placeholder
                  target.onerror = null; // Prevent infinite loop if placeholder also fails
                }}
            />
            {data.universityName && <h1 className="text-2xl font-bold text-center university-name-heading">{data.universityName}{data.universityAcronym ? ` (${data.universityAcronym})` : ''}</h1>}
        </div>
        {data.mainDepartmentName && <h2 className="text-2xl font-semibold mt-1 main-department-heading">{data.mainDepartmentName}</h2>}
      </div>

      {/* Report Type */}
      {data.reportType && (
        <div className="text-center mb-10 preview-content-block report-type-spacing">
          <h2 className="text-2xl font-semibold inline-block border-b-2 border-black pb-1 report-type-heading">{data.reportType}</h2>
        </div>
      )}

      {/* Course Details */}
      {(data.courseTitle || data.courseCode) && (
        <div className="mb-12 text-center preview-content-block course-details-block">
          {data.courseTitle && <p className="text-xl"><span className="font-semibold">Course Title:</span> {data.courseTitle}</p>}
          {data.courseCode && <p className="text-xl mt-0.5"><span className="font-semibold">Course Code:</span> {data.courseCode}</p>}
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

        #coverPageA4, #coverPageA4 * {
          color: #000000 !important;
        }
 `}</style>
    </div>
    </div>
  );
});

CoverPagePreview.displayName = "CoverPagePreview";
export default CoverPagePreview;

