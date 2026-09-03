import { useState } from "react";
import { Search, Map as MapIcon, SlidersHorizontal, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VenueCard from "@/components/VenueCard";

// Mock Data
const CATEGORIES = ["Tất cả", "Nhà hàng", "Quán Cafe", "Ăn vặt", "Đồ chay", "Pizza", "Trà sữa"];
const MOCK_VENUES = [
  { id: 1, name: "The Vintage Cafe", category: "Quán Cafe", rating: "4.8", distance: "0.5 km", address: "123 Pasteur, Quận 1" },
  { id: 2, name: "Phở Pasteur", category: "Nhà hàng", rating: "4.5", distance: "0.8 km", address: "456 Pasteur, Quận 1" },
  { id: 3, name: "Highlands Coffee", category: "Quán Cafe", rating: "4.2", distance: "1.2 km", address: "Vincom Center" },
  { id: 4, name: "Gogi House", category: "Nhà hàng", rating: "4.6", distance: "2.5 km", address: "Saigon Centre" },
  { id: 5, name: "Bánh Mì Huỳnh Hoa", category: "Ăn vặt", rating: "4.7", distance: "1.0 km", address: "Lê Thị Riêng, Q1" },
  { id: 6, name: "Pizza 4P's", category: "Pizza", rating: "4.9", distance: "1.5 km", address: "Lê Thánh Tôn" },
];

export default function Explore() {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [viewMode, setViewMode] = useState("split"); // 'split' | 'list' | 'map' (for mobile)

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 shrink-0 z-10 shadow-sm">
        <div className="flex gap-2 max-w-7xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Tìm quán ăn, nhà hàng..." className="pl-9 bg-slate-100/50 dark:bg-slate-800/50 border-none focus-visible:ring-1 focus-visible:ring-amber-500 rounded-xl" />
          </div>
          <Button variant="outline" size="icon" className="shrink-0 rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto mt-4 pb-1 no-scrollbar max-w-7xl mx-auto">
          {CATEGORIES.map(cat => (
            <Badge 
              key={cat} 
              variant={activeCategory === cat ? "default" : "secondary"}
              className={`cursor-pointer shrink-0 rounded-full px-4 py-1.5 font-medium transition-colors border-none ${
                activeCategory === cat 
                  ? "bg-amber-600 hover:bg-amber-700 text-white" 
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Main Content Area - Split View */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile View Toggle */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex lg:hidden bg-slate-900 dark:bg-slate-800 p-1 rounded-full shadow-lg border border-slate-800/50">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-full px-6 h-9 ${viewMode !== 'map' ? 'bg-white/10 text-white hover:bg-white/20' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4 mr-2" /> List
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-full px-6 h-9 ${viewMode === 'map' ? 'bg-white/10 text-white hover:bg-white/20' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setViewMode('map')}
          >
            <MapIcon className="w-4 h-4 mr-2" /> Map
          </Button>
        </div>

        {/* List View */}
        <div className={`w-full lg:w-5/12 xl:w-1/3 bg-slate-50 dark:bg-slate-950 overflow-y-auto ${viewMode === 'map' ? 'hidden lg:block' : 'block'}`}>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 pb-20">
            {MOCK_VENUES.map(venue => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </div>

        {/* Map View */}
        <div className={`flex-1 bg-slate-200 dark:bg-slate-800 relative ${viewMode !== 'map' ? 'hidden lg:block' : 'block'}`}>
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 flex-col gap-2">
            <MapIcon className="w-12 h-12 opacity-20" />
            <p className="font-medium">Map Component Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}
