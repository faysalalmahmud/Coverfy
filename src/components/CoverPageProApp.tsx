
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
    let newSrcApplied = false; // Tracks if we attempted to change the src

    try {
      if (logoImgElement && formData.universityLogoUrl && formData.universityLogoUrl.startsWith('images/')) {
        // For local images, we primarily rely on them being already loaded or loading quickly.
        // The main challenge html2canvas has is with *external* not-yet-loaded images.
        // If the local image isn't loaded, html2canvas might miss it.
        // We ensure the src is correctly set to the local path.
        // If the image isn't complete, we'll wrap PDF generation in its onload.
        if (!logoImgElement.complete || logoImgElement.naturalHeight === 0) {
          originalLogoSrc = logoImgElement.src;
          originalLogoOnload = logoImgElement.onload;
          originalLogoOnerror = logoImgElement.onerror;
          newSrcApplied = true; // Mark that we are managing this image's state

          await new Promise<void>((resolve, reject) => {
            const currentOnload = logoImgElement.onload;
            const currentOnerror = logoImgElement.onerror;

            logoImgElement.onload = () => {
              if (currentOnload) currentOnload.call(logoImgElement); // Call original if it exists
              logoImgElement.onload = originalLogoOnload; // Restore
              logoImgElement.onerror = originalLogoOnerror; // Restore
              resolve();
            };
            logoImgElement.onerror = (e) => {
              if (currentOnerror) currentOnerror.call(logoImgElement, e); // Call original if it exists
              logoImgElement.onload = originalLogoOnload; // Restore
              logoImgElement.onerror = originalLogoOnerror; // Restore
              console.error("Error loading local image onto image element for PDF:", e);
              reject(new Error("Error loading local image for PDF."));
            };
            // If src is already correct, just ensure it's loaded. If not, this might re-trigger load.
            // For local images, this often resolves quickly or is already done.
          });
        }
      }

      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: 10,
        filename: `${formData.courseCode || 'course'}_${formData.reportType || 'report'}_cover.pdf`,
        image: { type: 'png' }, // Use PNG for potentially better quality with logos
        html2canvas: {
          scale: 3, // Increased scale for better quality
          useCORS: true,
          logging: false, // Keep logging off unless debugging
          imageTimeout: 0, // Disable html2canvas internal timeout
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
       if (newSrcApplied && logoImgElement) { // Only restore if we explicitly managed it
        if (originalLogoSrc && logoImgElement.src !== originalLogoSrc) {
            // For local images, the src shouldn't have been changed to a data URI,
            // so this restoration might not be strictly necessary if it was local to begin with.
            // logoImgElement.src = originalLogoSrc; // Be cautious, could trigger re-load
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
            className="hover:text-[#180c52] hover:underline transition-colors font-semibold"
          >
            Faysal Al Mahmud, CSE09, SFMU
          </a>
          .
        </p>
        <p>&copy; {new Date().getFullYear()} Coverfy. All rights reserved.</p>
        <p>All credit goes to Team Musketeer, Gemini and SFMU Computer Club.</p>
      </footer>
    </div>
  );
}
