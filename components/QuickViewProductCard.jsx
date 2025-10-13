"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useCart } from "@/context/CartContext";
import Autoplay from "embla-carousel-autoplay";
import { Heart, X } from "lucide-react";
import Image from "next/image";

export default function QuickViewProductCard({ product, onClose }) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [carouselApi, setCarouselApi] = useState(null);
  const [images, setImages] = useState([]);

  // Initialize images when product changes
  useEffect(() => {
    if (product) {
      const allImages = [];

      // Add main image first
      if (product.mainImage?.url) {
        allImages.push(product.mainImage.url);
      }

      // Add gallery images
      if (Array.isArray(product.galleryImages)) {
        product.galleryImages.forEach(img => {
          if (img?.url) {
            allImages.push(img.url);
          }
        });
      }

      setImages(allImages.length > 0 ? allImages : ['/placeholder.jpeg']);
    }
  }, [product]);

  // Handle carousel navigation
  const onSelect = useCallback(() => {
    if (!carouselApi) return;
    setActiveImageIdx(carouselApi.selectedScrollSnap());
  }, [carouselApi]);

  // Set up carousel API and event listeners
  useEffect(() => {
    if (!carouselApi) return;

    carouselApi.on('select', onSelect);
    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi, onSelect]);

  if (!product) return null;

  return (

    <div className="relative bg-white rounded-lg md:max-w-5xl w-full max-h-[90vh] overflow-y-auto p-4">
      {/* Header */}
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <div className="relative">
            <Carousel
              setApi={setCarouselApi}
              className="w-full"
              opts={{
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 3000,
                }),
              ]}
            >
              <CarouselContent>
                {images.map((img, idx) => (
                  <CarouselItem key={idx} className="relative h-[100px] md:h-[450px]">
                    <Image
                      src={img}
                      alt={`Property image ${idx + 1}`}
                      fill
                      className="object-contain rounded-lg w-full h-full"
                      priority={idx === 0}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {images.length > 1 && (
                <>
                  <CarouselPrevious className="absolute left-1 p-2 rounded z-50" />
                  <CarouselNext className="absolute right-1 p-2 rounded z-50" />
                </>
              )}
            </Carousel>

            {/* Thumbnail navigation */}
            {images.length > 1 && (
              <div className="absolute bottom-0 w-full h-20 flex items-center justify-center bg-white/90">
                <Carousel
                  opts={{
                    align: 'start',
                    slidesToScroll: 1,
                  }}
                  className="w-full h-full px-2"
                >
                  <CarouselContent className="h-full">
                    {images.map((img, idx) => (
                      <CarouselItem key={idx} className="basis-[15%] max-w-[15%] h-full p-1">
                        <button
                          onClick={() => {
                            carouselApi?.scrollTo(idx);
                            setActiveImageIdx(idx);
                          }}
                          className={`w-full h-full border-2 rounded-md overflow-hidden transition-all ${
                            activeImageIdx === idx 
                              ? 'border-blue-500 scale-105' 
                              : 'border-transparent hover:border-gray-300'
                          }`}
                        >
                          <Image
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            width={64}
                            height={64}
                            className="w-full h-full object-contain rounded-md"
                          />
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 h-full rounded-none bg-white/80 hover:bg-white" />
                  <CarouselNext className="right-0 h-full rounded-none bg-white/80 hover:bg-white" />
                </Carousel>
              </div>
            )}
          </div>

          {/* Property Details */}
          <div>
            <h1 className="text-2xl font-bold mb-2 text-wrap pr-7">{product.propertyName}</h1>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <span>{product.locationType}</span>
              {product.propertyType && (
                <>
                  <span>•</span>
                  <span>{product.propertyType}</span>
                </>
              )}
            </div>

            {/* Price */}
            {product.rentPrice && (
              <div className="text-2xl font-bold text-blue-600 mb-4">
                ₹{product.rentPrice.toLocaleString()}/month
              </div>
            )}

            {/* Highlights */}
            {product.highlights?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-3">Property Highlights</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact Information */}
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Contact Information</h3>

              {product.brokerName && (
                <div className="mb-2">
                  <p className="font-medium">{product.brokerName}</p>
                </div>
              )}

              {product.contactAddress && (
                <div className="flex items-start gap-2 mb-3 text-gray-700">
                  <span>📍</span>
                  <p>{product.contactAddress}</p>
                </div>
              )}

              {product.contactNumbers?.map((number, idx) => (
                <a
                  key={idx}
                  href={`tel:${number}`}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-2"
                >
                  <span className="text-lg">📞</span>
                  <span>{number}</span>
                </a>
              ))}

              <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Contact Owner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}