
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
    let newSrcApplied = false; // Track if we actually changed the src

    try {
      // Only attempt to process the logo if it's a local image (in public/images) and not a Data URI
      if (logoImgElement && formData.universityLogoUrl && formData.universityLogoUrl.startsWith('images/')) {
        originalLogoSrc = logoImgElement.src;
        originalLogoOnload = logoImgElement.onload;
        originalLogoOnerror = logoImgElement.onerror;
        
        // Ensure the local image is fully loaded before capturing
        await new Promise<void>((resolve, reject) => {
          if (logoImgElement.complete && logoImgElement.naturalHeight !== 0) {
            resolve(); // Image already loaded
          } else {
            logoImgElement.onload = () => resolve();
            logoImgElement.onerror = (e) => {
              console.error("Error loading local image:", e);
              reject(new Error("Error loading local image onto image element."));
            };
          }
        });
        newSrcApplied = true; // Mark that we've effectively waited for it if it wasn't preloaded.
      }


      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: 10, // 10mm margin on all sides of the PDF page
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
      const isLogoError = error instanceof Error && (
        error.message.startsWith("Failed to fetch logo") || // Kept for broader catching, though less likely now
        error.message.includes("Data URI") || // Kept for broader catching
        error.message.includes("local image") 
      );

      toast({
        variant: "destructive",
        title: isLogoError ? "Logo Processing Error" : "Download Failed",
        description: error instanceof Error ? error.message : "There was an error generating your PDF. Please try again.",
      });
    } finally {
      // Restore original image src and handlers only if they were potentially changed/interacted with
      if (logoImgElement && originalLogoSrc && newSrcApplied) {
        // If it's a local image, it doesn't need its src 'restored' in the same way
        // a Data URI-converted one would. We mainly ensure handlers are reset.
        logoImgElement.src = originalLogoSrc; // Re-assign to be safe, though browser might cache
        logoImgElement.onload = originalLogoOnload;
        logoImgElement.onerror = originalLogoOnerror;
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 bg-primary shadow-sm">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold" style={{ color: '#180c52' }}>Coverfy</h1>
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
          , CSE09, SFMU.
        </p>
        <p>&copy; {new Date().getFullYear()} Coverfy. All rights reserved.</p>
        <p>All credit goes to Team Musketeer, Gemini and SFMU Computer Club.</p>
      </footer>
    </div>
  );
}
