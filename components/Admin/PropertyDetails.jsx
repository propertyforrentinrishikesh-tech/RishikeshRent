"use client";

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format } from 'date-fns';
const PropertyDetails = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    propertyType: '',
    location: '',
  });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  console.log(propertyTypes, locations)
  console.log(searchResults)

  const handleSearch = async () => {
    if (!filters.propertyType && !filters.location) {
      toast.error('Please select at least one filter');
      return;
    }

    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.propertyType) queryParams.append('propertyType', filters.propertyType);
      if (filters.location) queryParams.append('location', filters.location);

      const response = await fetch(`/api/searchPropertyDetails?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      setSearchResults(data.data || []);
      if (data.data.length === 0) {
        toast('No properties found matching your search criteria', {
            icon: 'ℹ️',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
    }
    } catch (error) {
      console.error('Search error:', error);
      toast.error(error.message || 'Failed to search properties');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (propertyId) => {
    // Find the property in the already loaded search results
    const property = searchResults.find(p => p._id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setIsDialogOpen(true);
    } else {
      toast.error('Property details not found');
    }
  };
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };


  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6 mb-6 border border-black">
        <h1 className="text-2xl font-bold mb-6">Search Properties</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Property Type</label>
            <Select
              value={filters.propertyType}
              onValueChange={(value) => setFilters(prev => ({ ...prev, propertyType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type._id} value={type.propertyType}>
                    {type.propertyType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <Select
              value={filters.location}
              onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location._id} value={location.locationType}>
                    {location.locationType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="w-full"
            >
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="border rounded-md">
            <Table className="border border-black">
              <TableHeader>
                <TableRow>
                  <TableHead className="border border-black text-black">No</TableHead>
                  <TableHead className="border border-black text-black">Property Name</TableHead>
                  <TableHead className="border border-black text-black">Contact Number</TableHead>
                  <TableHead className="border border-black text-black">View</TableHead>
                  <TableHead className="border border-black text-black">Actions</TableHead>
                </TableRow>
              </TableHeader>
              {searchResults.length > 0 && (
                <TableBody>
                  {searchResults.map((property, index) => (
                    <TableRow key={property._id}>
                      <TableCell>
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {property.propertyName}
                      </TableCell>
                      <TableCell>{property.contactPerson}</TableCell>
                      <TableCell>{property.contactNumbers}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleViewDetails(property._id)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Property Details</DialogTitle>
            </DialogHeader>
            {selectedProperty && (
              <div className="space-y-6">
                {/* Basic Information Box */}
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p><span className="font-medium">Property Name:</span> {selectedProperty.propertyName}</p>
                      <p><span className="font-medium">Type:</span> {selectedProperty.propertyType}</p>
                      <p><span className="font-medium">Location:</span> {selectedProperty.locationType}</p>
                      <p><span className="font-medium">Rent Price:</span> ₹{selectedProperty.rentPrice?.toLocaleString()}</p>
                      <p><span className="font-medium">Broker:</span> {selectedProperty.brokerName || 'N/A'}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Contact Information</h4>
                      <p><span className="font-medium">Address:</span> {selectedProperty.contactAddress || 'N/A'}</p>
                      <p><span className="font-medium">Contact Numbers:</span> {selectedProperty.contactNumbers?.join(', ') || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Main Image Box */}
                {selectedProperty.mainImage?.url && (
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Main Image</h3>
                    <div className="flex justify-center">
                      <img
                        src={selectedProperty.mainImage.url}
                        alt="Main property"
                        className="max-w-full h-auto max-h-48 rounded-lg object-contain border"
                      />
                    </div>
                  </div>
                )}

                {/* Gallery Images Box */}
                {selectedProperty.galleryImages?.length > 0 && (
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Gallery Images</h3>
                    <div className="flex space-x-4 overflow-x-auto pb-4" style={{ height: '100px' }}>
                      {selectedProperty.galleryImages.map((img, idx) => (
                        <div key={idx} className="flex-shrink-0 w-42 h-full">
                          <img
                            src={img.url}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover rounded-lg border"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Box */}
                {selectedProperty.video?.type === 'upload' && selectedProperty.video?.file?.url && (
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Property Video</h3>
                    <div className="aspect-video w-full">
                      <video
                        src={selectedProperty.video.file.url}
                        controls
                        className="w-full h-full rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {selectedProperty.video?.type === 'youtube' && selectedProperty.video?.youtubeLink && (
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="text-lg font-semibold mb-3 pb-2 border-b">YouTube Video</h3>
                    <div className="aspect-video w-full">
                      <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeId(selectedProperty.video.youtubeLink)}`}
                        className="w-full h-full rounded-lg"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Highlights Box */}
                {selectedProperty.highlights?.length > 0 && (
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Highlights</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedProperty.highlights.map((highlight, idx) => (
                        <li key={idx} className="text-gray-700">{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PropertyDetails;