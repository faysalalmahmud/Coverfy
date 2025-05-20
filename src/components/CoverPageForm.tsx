
"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { CoverPageData } from '@/types/cover-page';
import { initialCoverPageData } from '@/types/cover-page'; // Import for safety in useEffect
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  FileType,
  Book,
  Hash,
  User,
  Briefcase,
  Building2,
  UserCircle2,
  Badge,
  GraduationCap,
  Users2,
  CalendarDays,
  Building,
  Fingerprint,
  AlignVerticalSpaceAround,
  Image as ImageIcon
} from 'lucide-react';

const formSchema = z.object({
  universityName: z.string().min(3, 'University name is required.'),
  universityAcronym: z.string().min(2, 'University acronym is required.'),
  mainDepartmentName: z.string().min(3, 'Main department name is required.'),
  universityLogoUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  reportType: z.enum(['Assignment', 'Lab Report']).optional(), // reportType can be undefined initially
  courseTitle: z.string().min(3, 'Course title must be at least 3 characters.'),
  courseCode: z.string().min(3, 'Course code must be at least 3 characters.'),
  teacherName: z.string().min(3, "Teacher's name must be at least 3 characters."),
  teacherDesignation: z.string().min(3, "Teacher's designation is required."),
  teacherDepartment: z.string().min(3, "Teacher's department is required."),
  studentName: z.string().min(3, 'Student name must be at least 3 characters.'),
  studentId: z.string().min(3, 'Student ID is required.'),
  studentDepartment: z.string().min(3, 'Student department is required.'),
  studentBatch: z.string().min(1, 'Batch is required.'),
  studentSemester: z.string().min(1, 'Semester is required.'),
  submissionDate: z.string().min(1, "Submission date is required."),
}).refine(data => data.reportType !== undefined, { // Enforce selection for submission
  message: "Report type is required.",
  path: ["reportType"],
});

interface CoverPageFormProps {
  onDataChange: (data: CoverPageData) => void;
  initialData: CoverPageData;
}

const CoverPageForm: React.FC<CoverPageFormProps> = ({ onDataChange, initialData }) => {
  const form = useForm<CoverPageData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    const subscription = form.watch((watchedValues) => {
      const dataForParent: CoverPageData = {
        ...initialCoverPageData, // Base with all fields from default structure
        ...initialData,         // Overlay with props (fixed university details)
        ...watchedValues,       // Overlay with current form values
        reportType: watchedValues.reportType || undefined, // Ensure type consistency
        submissionDate: watchedValues.submissionDate || '', // Ensure type consistency
        mainDepartmentName: watchedValues.mainDepartmentName || initialData.mainDepartmentName,
      };
      onDataChange(dataForParent);
    });
    return () => subscription.unsubscribe();
  }, [form, onDataChange, initialData]);


  return (
    <Form {...form}>
      <form className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Building className="mr-2 h-5 w-5 text-primary" /> University Details</CardTitle>
            <CardDescription>Enter university information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="universityName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Building className="mr-2 h-4 w-4 text-muted-foreground" />University Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Global State University" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="universityAcronym"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Fingerprint className="mr-2 h-4 w-4 text-muted-foreground" />University Acronym</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., GSU" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mainDepartmentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><AlignVerticalSpaceAround className="mr-2 h-4 w-4 text-muted-foreground" />Main Department Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dept. Of Science & Technology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="universityLogoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><ImageIcon className="mr-2 h-4 w-4 text-muted-foreground" />University Logo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/logo.png" {...field} value={field.value || ''} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><FileType className="mr-2 h-5 w-5 text-primary" /> Report Details</CardTitle>
            <CardDescription>Specify the type and date of your report.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="reportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined} // Important: allow undefined for placeholder
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Assignment">Assignment</SelectItem>
                      <SelectItem value="Lab Report">Lab Report</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="submissionDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />Submission Date</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., May 20, 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Book className="mr-2 h-5 w-5 text-primary" /> Course Details</CardTitle>
             <CardDescription>Enter the details of your course.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="courseTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Book className="mr-2 h-4 w-4 text-muted-foreground" />Course Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Introduction to Programming" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courseCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Hash className="mr-2 h-4 w-4 text-muted-foreground" />Course Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CSE101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><User className="mr-2 h-5 w-5 text-primary" /> Instructor Details</CardTitle>
            <CardDescription>Provide information about your course instructor.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="teacherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground" />Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Fazle Rabby" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teacherDesignation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />Designation</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Asst. Professor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teacherDepartment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Building2 className="mr-2 h-4 w-4 text-muted-foreground" />Department</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Computer Science & Engineering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><UserCircle2 className="mr-2 h-5 w-5 text-primary" /> Student Details</CardTitle>
            <CardDescription>Fill in your personal academic information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="studentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><UserCircle2 className="mr-2 h-4 w-4 text-muted-foreground" />Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Faysal Al Mahmud" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Badge className="mr-2 h-4 w-4 text-muted-foreground" />ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 07422100012345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studentDepartment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" />Department</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Computer Science & Engineering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studentBatch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Users2 className="mr-2 h-4 w-4 text-muted-foreground" />Batch</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 9th" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studentSemester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />Semester</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 5th" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default CoverPageForm;
