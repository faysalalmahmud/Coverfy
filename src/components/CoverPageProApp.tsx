
"use client";

import React, { useState, useRef, useEffect } from 'react';
import type { CoverPageData } from '@/types/cover-page';
import { initialCoverPageData } from '@/types/cover-page';
import CoverPageForm from '@/components/CoverPageForm';
import CoverPagePreview from '@/components/CoverPagePreview';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function CoverPageProApp() {
  const [formData, setFormData] = useState<CoverPageData>(initialCoverPageData);
  const coverPageRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDownloadPdf = async () => {
    const element = coverPageRef.current;
    if (!element) {
      toast({
        variant: "destructive",
        title: "Preview Not Found",
        description: "Could not find the preview element to download.",
      });
      return;
    }

    const logoImgElement = element.querySelector('#universityLogoImage') as HTMLImageElement | null;
    let originalLogoOnload: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    let originalLogoOnerror: OnErrorEventHandler = null;
    let newSrcApplied = false; // Tracks if we've modified handlers for pre-loading

    try {
      // This block is mainly for ensuring local images are rendered before PDF capture
      // if they might not have been fully processed by the browser yet.
      if (logoImgElement && formData.universityLogoUrl && formData.universityLogoUrl.startsWith('images/')) {
        // Check if the image is already loaded and rendered by the browser
        if (!logoImgElement.complete || logoImgElement.naturalHeight === 0) {
          originalLogoOnload = logoImgElement.onload;
          originalLogoOnerror = logoImgElement.onerror;
          newSrcApplied = true;

          await new Promise<void>((resolve, reject) => {
            const currentOnload = logoImgElement.onload; // Original onload we might want to call
            const currentOnerror = logoImgElement.onerror; // Original onerror

            logoImgElement.onload = (event: Event) => { // Accept the event
              if (currentOnload) {
                currentOnload.call(logoImgElement, event); // Pass the event
              }
              // Restore original handlers *after* our logic and resolving
              logoImgElement.onload = originalLogoOnload;
              logoImgElement.onerror = originalLogoOnerror;
              resolve();
            };

            logoImgElement.onerror = (e, source, lineno, colno, error) => {
              if (currentOnerror) {
                if (typeof currentOnerror === 'function') {
                  currentOnerror.call(logoImgElement, e, source, lineno, colno, error);
                }
              }
              // Restore original handlers *after* our logic and rejecting
              logoImgElement.onload = originalLogoOnload;
              logoImgElement.onerror = originalLogoOnerror;
              console.error("Error explicitly loading local image for PDF:", e);
              reject(new Error("Error preparing local image for PDF."));
            };

            // If the src is already correct for local images, re-setting it might not be necessary
            // unless there's a specific reason to re-trigger the load event.
            // For now, we assume the browser will handle it if `complete` is false.
            // If issues persist, uncommenting the src reset might be needed:
            // if (logoImgElement.src !== (new URL(formData.universityLogoUrl, window.location.href)).href) {
            //    logoImgElement.src = formData.universityLogoUrl;
            // } else {
            //    // If src is already set and image is not complete, it might be a broken link or still loading.
            //    // The handlers above will catch this.
            // }
          });
        }
      }

      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: 10,
        filename: `${formData.courseCode || 'course'}_${formData.reportType || 'report'}_cover.pdf`,
        image: { type: 'png' },
        html2canvas: {
          scale: 3,
          useCORS: true,
          logging: false,
          imageTimeout: 0,
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().from(element).set(opt).save();
      toast({
        title: "Download Started",
        description: "Your PDF cover page is being downloaded.",
      });
    } catch (error) {
      console.error("Failed to download PDF or process logo:", error);
      const isLogoError = error instanceof Error && error.message.includes("local image for PDF");

      toast({
        variant: "destructive",
        title: isLogoError ? "Local Logo Error" : "Download Failed",
        description: error instanceof Error ? error.message : "There was an error generating your PDF. Please try again.",
      });
    } finally {
       if (newSrcApplied && logoImgElement) {
        // Ensure original handlers are restored if we overwrote them
        logoImgElement.onload = originalLogoOnload;
        logoImgElement.onerror = originalLogoOnerror;
      }
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 bg-primary shadow-sm">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: '#180c52' }}>Coverfy</h1>
          <p className="text-primary-foreground/90 mt-1">
            A  Team Musketeer's Academic cover generator
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <CoverPageForm onDataChange={setFormData} initialData={formData} />
            <div className="mt-6 flex justify-center">
              <Button onClick={handleDownloadPdf} variant="outline" size="lg" className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="sticky top-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Preview</h2>
              </div>
              <div className="bg-muted p-2 md:p-4 rounded-lg shadow-inner overflow-x-auto">
                 <CoverPagePreview ref={coverPageRef} data={formData} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-muted-foreground text-sm border-t space-y-1">
        <p>
          Developed with ❤️ by{' '}
          <a
            href="https://www.linkedin.com/in/faysalalmahmud/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#180c52] hover:underline transition-colors font-semibold"
          >
            Faysal Al Mahmud
          </a>
          , CSE09, SFMU.
        </p>
        <p>&copy; {new Date().getFullYear()} Coverfy. All rights reserved.</p>
        <p>All credit goes to Team Musketeer, Gemini and SFMU Computer Club.</p>
      </footer>
    </div>
  );
}
