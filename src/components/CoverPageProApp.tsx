
"use client";

import React, { useState, useRef } from 'react';
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
    
    // Ensure the image is loaded before generating PDF
    if (logoImgElement && logoImgElement.src && !logoImgElement.complete) {
      try {
        await new Promise<void>((resolve, reject) => {
          if (!logoImgElement) { // Type guard
            reject(new Error("Logo element became null during async operation"));
            return;
          }
          originalLogoOnload = logoImgElement.onload;
          originalLogoOnerror = logoImgElement.onerror;

          logoImgElement.onload = (event) => {
            if (originalLogoOnload && typeof originalLogoOnload === 'function') {
              originalLogoOnload.call(logoImgElement, event);
            }
            resolve();
          };
          logoImgElement.onerror = (e, source, lineno, colno, error) => {
            if (originalLogoOnerror && typeof originalLogoOnerror === 'function') {
                originalLogoOnerror.call(logoImgElement, e, source, lineno, colno, error);
            }
            reject(new Error("Error explicitly loading local image for PDF."));
          };
          // If it's not complete, the browser is still loading it. The handlers will catch completion/error.
          // If the src is already set, just waiting for it to complete.
        });
      } catch (error) {
        console.error("Error ensuring local logo is loaded:", error);
        toast({
          variant: "destructive",
          title: "Logo Loading Error",
          description: error instanceof Error ? error.message : "Could not ensure logo was loaded for PDF.",
        });
        // Optionally, you might want to return here if logo loading is critical
        // return; 
      }
    }


    try {
      const html2pdf = (await import('html2pdf.js')).default;

      // Force A4 dimensions on the element before PDF generation (removes any responsive scaling)
      const originalStyle = element.getAttribute('style') || '';
      element.style.width = '190mm';
      element.style.minHeight = '277mm';
      element.style.height = '277mm';
      element.style.padding = '10mm';
      element.style.border = '4px solid black';
      element.style.fontSize = '12pt';
      element.style.boxSizing = 'border-box';
      element.style.overflow = 'visible';
      element.style.transform = 'none';
      element.style.transformOrigin = 'top left';

      const opt = {
        margin: 10,
        filename: `${formData.courseCode || 'course'}_${formData.reportType || 'report'}_cover.pdf`,
        image: { type: 'png' },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          imageTimeout: 0,
          windowWidth: 900,
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().from(element).set(opt).save();

      // Restore original styles after PDF generation
      element.setAttribute('style', originalStyle);
      toast({
        title: "Download Started",
        description: "Your PDF cover page is being downloaded.",
      });

    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: error instanceof Error ? error.message : "There was an error generating your PDF. Please try again.",
      });
    } finally {
        if (logoImgElement && originalLogoOnload !== undefined && originalLogoOnerror !== undefined) {
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
            A  Team Musketeer&apos;s Academic cover generator
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-2 sm:p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-8">
          <div className="lg:col-span-2 order-1">
            <CoverPageForm onDataChange={setFormData} initialData={formData} />
            <div className="mt-6 flex justify-center">
              <Button onClick={handleDownloadPdf} variant="outline" size="lg" className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
            </div>
          </div>
          <div className="lg:col-span-3 order-2">
            <div className="lg:sticky lg:top-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Preview</h2>
              </div>
              <div className="bg-muted p-2 md:p-4 rounded-lg shadow-inner overflow-hidden">
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
          , CSE09, BRIU.
        </p>
        <p>&copy; {new Date().getFullYear()} Coverfy. All rights reserved.</p>
        <p>All credit goes to Team Musketeer, Gemini and BRIU Computer Club.</p>
      </footer>
    </div>
  );
}
