
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
    let originalLogoSrc: string | undefined = undefined;
    let originalLogoOnload: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    let originalLogoOnerror: OnErrorEventHandler = null;
    let newSrcApplied = false;

    try {
      if (logoImgElement && formData.universityLogoUrl && formData.universityLogoUrl.startsWith('images/')) {
        originalLogoSrc = logoImgElement.src; 
        originalLogoOnload = logoImgElement.onload;
        originalLogoOnerror = logoImgElement.onerror;
        newSrcApplied = true;

        // Ensure the local image is fully loaded before capturing
        // This might involve temporarily attaching new onload/onerror handlers
        // if the image isn't already loaded.
        if (!logoImgElement.complete || logoImgElement.naturalHeight === 0) {
          await new Promise<void>((resolve, reject) => {
            const currentOnload = logoImgElement.onload;
            const currentOnerror = logoImgElement.onerror;
            logoImgElement.onload = () => {
              logoImgElement.onload = currentOnload; // Restore
              logoImgElement.onerror = currentOnerror; // Restore
              resolve();
            };
            logoImgElement.onerror = (e) => {
              logoImgElement.onload = currentOnload; // Restore
              logoImgElement.onerror = currentOnerror; // Restore
              console.error("Error loading local image for PDF:", e);
              reject(new Error("Error loading local image onto image element for PDF."));
            };
            // If src hasn't changed, browser might not re-trigger load,
            // but for local images this setup should be okay.
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
        title: isLogoError ? "Logo Processing Error" : "Download Failed",
        description: error instanceof Error ? error.message : "There was an error generating your PDF. Please try again.",
      });
    } finally {
      if (logoImgElement && originalLogoSrc && newSrcApplied) {
        // Restore original properties if they were captured
        // For local images, src restoration is less critical than handlers
        if (logoImgElement.src !== originalLogoSrc) { // Only if it was actually changed to a data URI (not current logic)
             // logoImgElement.src = originalLogoSrc; 
        }
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
            className="hover:text-primary hover:underline transition-colors font-semibold"
          >
            Faysal Al Mahmud
          </a>
          .
        </p>
        <p>&copy; {new Date().getFullYear()} Coverfy. All rights reserved.</p>
        <p>All credit goes to Team Musketeer, Gemini and SFMU Computer Club.</p>
      </footer>
    </div>
  );
}
