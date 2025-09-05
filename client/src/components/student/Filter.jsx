
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectLabel,
    SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"
import React, { useState } from 'react'
import { Label } from '@radix-ui/react-label';
import { Separator } from "../ui/separator";


const categories = [
    { id: "Next JS", label: "Next JS" },
    { id: "Data Science", label: "Data Science" },
    { id: "Frontend Development", label: "Frontend Development" },
    { id: "FullStack Development", label: "Fullstack Development" },
    { id: "MERN Stack Development", label: "MERN Stack Development" },
    { id: "Backend Development", label: "Backend Development" },
    { id: "Javascript", label: "Javascript" },
    { id: "Python", label: "Python" },
    { id: "Docker", label: "Docker" },
    { id: "MongoDB", label: "MongoDB" },
    { id: "HTML", label: "HTML" }
]

const Filter = ({ handleFilterChange }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortByPrice, setSortByPrice] = useState("");
    const handleCategoryChange = (categoryId) => {
        setSelectedCategories((prevCategories) => {
            const newCategories = prevCategories.includes(categoryId) ? prevCategories.filter((id) => id !== categoryId) : [...prevCategories, categoryId];
            handleFilterChange(newCategories,sortByPrice);
            return newCategories;
        });
      
    }

    const selectByPriceHandler = (selectedValue) =>{
        setSortByPrice(selectedValue);
        handleFilterChange(selectedCategories,selectedValue);
    }

    return (
        <div className='w-full md:w-[20%]'>
            <div className='items-center justify-between'>
                <h1 className='font-semibold text-lg md:text-xl'>Filter Options</h1>
                <Select onValueChange={selectByPriceHandler}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Sort by Price</SelectLabel>
                            <SelectItem value="low">Low to High</SelectItem>
                            <SelectItem value="high">High to Low</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Separator className="my-4" />
                <div>
                    <h1 className='font-semibold mb-2'>CATEGORY</h1>
                    {
                        categories.map((category) => (
                            <div className='flex items-center space-x-2 my-2'>
                                <Checkbox id={category.id} onCheckedChange={() => handleCategoryChange(category.id)} />
                                <Label className='text-sm font-medium leading-none peer-disabeld:cursor-not-allowed peer:disabled:opacity-700'>{category.label}</Label>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
export default Filter