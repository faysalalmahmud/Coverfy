
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
    if (element) {
      try {
        const html2pdf = (await import('html2pdf.js')).default;
        const opt = {
          margin: 10, // 10mm margin on all sides of the PDF page
          filename: `${formData.courseCode || 'course'}_${formData.reportType || 'report'}_cover.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 3, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        await html2pdf().from(element).set(opt).save();
        toast({
          title: "Download Started",
          description: "Your PDF cover page is being downloaded.",
        });
      } catch (error) {
        console.error("Failed to download PDF:", error);
        toast({
          variant: "destructive",
          title: "Download Failed",
          description: "There was an error generating your PDF. Please try again.",
        });
      }
    } else {
       toast({
          variant: "destructive",
          title: "Preview Not Found",
          description: "Could not find the preview element to download.",
        });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 bg-primary/10 shadow-sm">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-primary">CoverPage Pro</h1>
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

      <footer className="py-6 text-center text-muted-foreground text-sm border-t">
        <p>&copy; {new Date().getFullYear()} CoverPage Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}
