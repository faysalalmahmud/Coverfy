
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
      // Only attempt to process the logo if it's an external URL
      if (logoImgElement && formData.universityLogoUrl && !formData.universityLogoUrl.startsWith('data:') && !formData.universityLogoUrl.startsWith('images/')) {
        originalLogoSrc = logoImgElement.src; // Capture current src
        originalLogoOnload = logoImgElement.onload; // Capture current onload
        originalLogoOnerror = logoImgElement.onerror; // Capture current onerror
        
        const response = await fetch(formData.universityLogoUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch logo: ${response.statusText}`);
        }
        const blob = await response.blob();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        // Wait for the Data URI to be loaded onto the image element
        await new Promise<void>((resolve, reject) => {
          if (logoImgElement) {
            logoImgElement.onload = () => resolve();
            logoImgElement.onerror = (e) => {
              console.error("Error loading Data URI on image:", e);
              reject(new Error("Error loading Data URI onto image element."));
            };
            logoImgElement.src = dataUrl;
            newSrcApplied = true; // Mark that we've applied a new src
          } else {
            // Should not happen if logoImgElement was found earlier
            resolve(); 
          }
        });
      } else if (logoImgElement && formData.universityLogoUrl && formData.universityLogoUrl.startsWith('images/')) {
        // For local images, ensure they are loaded before proceeding
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
      }


      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: 10,
        filename: `${formData.courseCode || 'course'}_${formData.reportType || 'report'}_cover.pdf`,
        image: { type: 'png' }, // Use PNG to better preserve logo quality
        html2canvas: {
          scale: 3, // Increased scale for better quality
          useCORS: true,
          logging: false, // Explicitly disable html2canvas logging
          imageTimeout: 0, // Disable html2canvas internal timeout for images
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
      // Check if the error message indicates a logo fetching issue
      const isLogoError = error instanceof Error && (
        error.message.startsWith("Failed to fetch logo") ||
        error.message.includes("Data URI") ||
        error.message.includes("local image")
      );

      toast({
        variant: "destructive",
        title: isLogoError ? "Logo Processing Error" : "Download Failed",
        description: error instanceof Error ? error.message : "There was an error generating your PDF. Please try again.",
      });
    } finally {
      // Restore original image src and handlers only if they were changed
      if (logoImgElement && originalLogoSrc && newSrcApplied) {
        logoImgElement.src = originalLogoSrc;
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
            A Team Musketeer's Academic cover generator
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
        <p>All credit goes to Team Musketeer and Gemini.</p>
      </footer>
    </div>
  );
}

