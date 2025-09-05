import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () =>{
    const [searchQuery,setSearchQuery] = useState()
    const navigate = useNavigate()

    const searchHandler = (e) =>{
        e.preventDefault();
        if(searchQuery.trim() !== ""){
            navigate(`/course/search?query=${searchQuery}`);
        }
        setSearchQuery("");
    }
    return (
        <div className="relative bg-gradient-to-r from-blue-500 to bg-indigo-600 dark:from-gray-800 dark:to-gray-900 py-24 px-4 text-center ">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-white text-4xl font-bold mb-4">Find the Best Courses for You</h1>
                <p className="text-gray-200 dark:text-gray-400 mb-8">Discover, Learn, and Upskill with our wide range of courses</p>
                <form onSubmit={searchHandler} className="flex  items-center  dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6">
                    <Input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Search Courses" className='flex-grow  bg-white border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500'/>
                    <Button type="submit" className="bg-blue-600 cursor-pointer  dark:bg-gray-700 text-white px-6  py-3 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-700">Search</Button>
                </form>
                <Button onClick={()=>navigate(`/course/search?query`)} className="bg-white dark:bg-gray-800 text-blue-600 rounded-full hover:bg-gray-200 cursor-pointer">Explore Courses</Button>
            </div>
        </div>
    )
}
export default HeroSection;