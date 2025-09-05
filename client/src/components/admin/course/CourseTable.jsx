import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "@/components/ui/table"
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";
import { Edit } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const CourseTable = () =>{
    const navigate = useNavigate();
    const {data,isLoading} = useGetCreatorCourseQuery();

    if(isLoading) return <h1>Loading...</h1>
    console.log("data",data);
    return (
        <>
            <div>
                <Button onClick={()=>navigate('create')} className={'cursor-pointer'}>Create a new Course</Button>
                 <Table>
                <TableCaption>A list of your recent courses.</TableCaption>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[100px]">Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.courses.map((course) => (
                    <TableRow key={course._id}>
                        <TableCell className="font-medium">{course?.coursePrice || "NA"}</TableCell>
                        <TableCell><Badge>{course?.isPublished ? "published":"Draft"}</Badge></TableCell>
                        <TableCell>{course.courseTitle}</TableCell>
                        <TableCell className="text-right">
                          <Button onClick={()=>navigate(`${course?._id}`)} size='sm' className={'cursor-pointer'} variant={'ghost'}><Edit/></Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
        </>
    )
}
export default CourseTable