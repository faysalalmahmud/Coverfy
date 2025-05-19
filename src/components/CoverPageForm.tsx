
"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { CoverPageData } from '@/types/cover-page';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
} from 'lucide-react';

const formSchema = z.object({
  reportType: z.enum(['Assignment', 'Lab Report'], { required_error: 'Report type is required.' }),
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
    const subscription = form.watch((values) => {
      // Ensure that all fields are included as CoverPageData expects,
      // type assertion is used assuming `form.watch` without specific field names returns all values.
      onDataChange(values as CoverPageData);
    });
    return () => subscription.unsubscribe();
  }, [form, onDataChange]); // form.watch is stable if `form` is stable, `onDataChange` is stable.

  // No actual submit button needed as it updates live
  // const onSubmit = (data: CoverPageData) => {
  //   onDataChange(data);
  // };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><FileType className="mr-2 h-5 w-5 text-primary" /> Report Details</CardTitle>
            <CardDescription>Specify the type of your report.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="reportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || undefined} // Use undefined for empty string to show placeholder
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
                    <Input placeholder="e.g., Dr. Jane Doe" {...field} />
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
                    <Input placeholder="e.g., Professor" {...field} />
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
                    <Input placeholder="e.g., Computer Science" {...field} />
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
                    <Input placeholder="e.g., John Smith" {...field} />
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
                    <Input placeholder="e.g., S12345" {...field} />
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
                    <Input placeholder="e.g., Software Engineering" {...field} />
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
                    <Input placeholder="e.g., 2021" {...field} />
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
        {/* <Button type="submit" className="w-full">Update Preview (Auto)</Button> */}
      </form>
    </Form>
  );
};

export default CoverPageForm;
