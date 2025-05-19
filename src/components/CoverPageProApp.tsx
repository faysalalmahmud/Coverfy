
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

    const logoImgElement = element.querySelector<HTMLImageElement>('#universityLogoImage');
    let originalSrc = '';
    let originalOnload: ((this: GlobalEventHandlers, ev: Event) => any) | null = null;
    let originalOnerror: OnErrorEventHandler = null;

    if (logoImgElement) {
      originalSrc = logoImgElement.src;
      originalOnload = logoImgElement.onload;
      originalOnerror = logoImgElement.onerror;

      try {
        let newSrcToLoad: string | null = null;

        if (formData.universityLogoUrl && formData.universityLogoUrl.startsWith('http')) {
          const response = await fetch(formData.universityLogoUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch logo: ${response.statusText} (status: ${response.status})`);
          }
          const blob = await response.blob();
          newSrcToLoad = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } else if (formData.universityLogoUrl && formData.universityLogoUrl.startsWith('data:')) {
          newSrcToLoad = formData.universityLogoUrl;
        }

        if (newSrcToLoad && logoImgElement.src !== newSrcToLoad) {
          await new Promise<void>((resolve, reject) => {
            logoImgElement.onload = () => {
              resolve();
            };
            logoImgElement.onerror = (e) => {
              console.error('Error event on img after setting Data URI src:', e);
              reject(new Error('Failed to load processed image onto image element.'));
            };
            logoImgElement.src = newSrcToLoad;
            // Check if src was set correctly, for some browsers if it's too long it might silently fail
            if (logoImgElement.src !== newSrcToLoad) {
                console.error('Failed to set img src to Data URI, browser might have rejected it.');
                reject(new Error('Browser failed to accept the Data URI as image source.'));
                return;
            }
          });
        }
        // Removed the explicit setTimeout delay from here. 
        // The promise for logoImgElement.onload should be sufficient.

      } catch (imgError: any) {
        console.error("Error processing university logo for PDF:", imgError);
        toast({
          variant: "destructive",
          title: "Logo Processing Error",
          description: imgError.message || "Could not process the university logo. It may be missing from the download.",
        });
        // Allow PDF generation to proceed without the logo if processing failed
      }
    }

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: 10,
        filename: `${formData.courseCode || 'course'}_${formData.reportType || 'report'}_cover.pdf`,
        image: { type: 'png' },
        html2canvas: {
          scale: 3,
          useCORS: true,
          logging: false,
          imageTimeout: 0, // Disable html2canvas internal image timeout
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };
      await html2pdf().from(element).set(opt).save();
      toast({
        title: "Download Started",
        description: "Your PDF cover page is being downloaded.",
      });
    } catch (pdfError) {
      console.error("Failed to download PDF:", pdfError);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "There was an error generating your PDF. Please try again.",
      });
    } finally {
      // Restore original image properties
      if (logoImgElement) {
        if (logoImgElement.src !== originalSrc) {
          logoImgElement.src = originalSrc;
        }
        logoImgElement.onload = originalOnload;
        logoImgElement.onerror = originalOnerror;
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 bg-primary/10 shadow-sm">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-primary">SohojCover</h1>
          <p className="text-muted-foreground mt-1">
            Generate professional academic cover pages with ease.
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <CoverPageForm onDataChange={setFormData} initialData={formData} />
          </div>
          <div className="lg:col-span-3">
            <div className="sticky top-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Preview</h2>
                <Button onClick={handleDownloadPdf} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
              </div>
              <div className="bg-muted p-2 md:p-4 rounded-lg shadow-inner overflow-x-auto">
                 <CoverPagePreview ref={coverPageRef} data={formData} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-muted-foreground text-sm border-t space-y-1">
        <p>Developed with ❤️ by Faysal Al Mahmud, CSE09, SFMU.</p>
        <p>&copy; {new Date().getFullYear()} SohojCover. All rights reserved.</p>
        <p>All credit goes to Team Musketeer and Gemini.</p>
      </footer>
    </div>
  );
}
