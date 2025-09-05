import Filter from './Filter'
import React, { useState } from 'react'
import SearchResult from './SearchResult';
import { useGetSearchCourseQuery } from '@/features/api/courseApi';
import { Link, useSearchParams } from 'react-router-dom';
import { Skeleton } from '../ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

const SearchPage = () =>{
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const [selectedCategories,setSelectedCategories] = useState([]);
    const [sortByPrice,setSortByPrice] = useState("");


    const {data,isLoading} = useGetSearchCourseQuery({
        searchQuery:query,
        categories:selectedCategories,
        sortByPrice
    })

    const isEmpty = !isLoading && data?.courses.length === 0;

    const handleFilterChange = (categories,price) =>{
        setSelectedCategories(categories);
        setSortByPrice(price);
    }
    return (
        <div className='max-w-7xl mx-auto p-4 md:p-8 mt-5'>
            <div className='my-6'>
                <h1 className='font-bold text-xl md:text-2xl'>result for "{query}"</h1>
                <p>Showing results for {""}
                    <span className='text-blue-800 font-bold italic'>{query}</span>
                </p>
            </div>
            <div className='flex flex-col md:flex-row gap-10'>
                <Filter handleFilterChange={handleFilterChange}/>
                <div className='flex-1'>
                {
                    isLoading ? (
                        Array.from({length:3}).map((_,idx)=>(
                            <CourseSkeleton key={idx}/>
                        ))
                    ): isEmpty ? <CourseNotFound/>:(
                       data?.courses?.map((course)=>(
                            <SearchResult key={course?._id} course={course}/>
                       ))
                    )
                }
                </div>
            </div>
        </div>
    )
}
export default SearchPage

const CourseSkeleton = () => {
    return (
       <div className="flex-1 flex flex-col md:flex-row justify-between">
            <div className="h-32 w-full md:w-64">
                <Skeleton className="h-full w-full object-cover"/>
            </div>

            <div className="flex flex-col gap-2 flex-1 px-4">
                <Skeleton className="h-6 w-3/4"/>
                 <Skeleton className="h-4 w-1/2"/>
                 <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-1/3"/>
                 </div>
                <Skeleton className="h-6 w-20 mt-2"/>
            </div>

            <div className="flex flex-col items-end justify-between mt-4">
                <Skeleton className="h-6 w-12"/>
            </div>

       </div>
    )
}

const CourseNotFound = () => {
    return (
       <div className="flex flex-col items-center justify-center min-h-20">
            <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
            <h1 className="font-bold text-2xl md:text-4xl text-gray-800">
                Course Not Found 
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                Sorry, we couldn't find the course you're looking for.
            </p>
            <Link to="/" className="italic"/>
                <Button variant="link">Browse All Courses</Button>
            <Link/>
       </div>
    )
}