"use client";

import { Input } from "@/components/ui/input";
import { CalendarClock, MapPin, Search, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    function debounce(func, wait) {
        let timeout;
        function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        }
        executedFunction.cancel = () => clearTimeout(timeout);
        return executedFunction;
    }
    const handleSearch = async (e) => {
        e?.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Optional: Add debounce for search-as-you-type
    const debouncedSearch = useCallback(
        debounce((searchQuery) => {
            if (searchQuery.trim()) {
                handleSearch();
            }
        }, 300),
        []
    );

    useEffect(() => {
        if (query.trim()) {
            debouncedSearch(query);
        } else {
            setSearchResults([]);
        }
        return () => debouncedSearch.cancel();
    }, [query, debouncedSearch]);

    return (
        <div className="relative">
            <form
                onSubmit={handleSearch}
                className="flex items-center bg-white px-2 py-1 border rounded-full"
            >
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    placeholder="Search properties..."
                    className="px-4 py-1 rounded-full w-full text-black"
                />
                <button
                    type="submit"
                    className="text-black hover:bg-gray-200  p-2 rounded transition-colors"
                >
                    <Search className="h-5 w-5" />
                </button>
            </form>

            {/* Search Results Dropdown */}
            {(isFocused || query) && searchResults.length > 0 && (
                <div className="absolute z-999 mt-1 w-full bg-white border rounded-md shadow-lg max-h-96 overflow-y-auto">
                    {searchResults.map((result) => (
                        <div
                            key={result.id}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                            onClick={() => {
                                router.push(`/property/${result.id}`);
                                setQuery('');
                                setIsFocused(false);
                            }}
                        >
                            <div className="font-medium">{result.title}</div>
                            <div className="text-sm text-gray-600">{result.address}</div>
                        </div>
                    ))}
                </div>
            )}

            {isLoading && (
                <div className="absolute z-999 mt-1 w-full bg-white border rounded-md shadow-lg p-3">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
                        <span>Searching...</span>
                    </div>
                </div>
            )}
        </div>
    );
};
