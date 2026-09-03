import { MapPin, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function VenueCard({ venue, onSave }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow group relative">
      <div className="h-48 w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
        {/* Mock Image Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
          <span className="text-sm font-medium">Image Placeholder</span>
        </div>
        <div className="absolute top-3 right-3 z-10">
          <Button size="icon" variant="secondary" className="rounded-full w-8 h-8 opacity-90 hover:opacity-100 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 shadow-sm text-slate-600 hover:text-red-500 transition-colors" onClick={(e) => { e.preventDefault(); onSave?.(venue); }}>
            <Heart className="w-4 h-4" />
          </Button>
        </div>
        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <Badge className="bg-white/90 text-slate-900 hover:bg-white border-none shadow-sm dark:bg-slate-900/90 dark:text-slate-100">
            {venue.category || "Cafe"}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-amber-600 transition-colors">
            {venue.name}
          </h3>
          <div className="flex items-center gap-1 text-sm font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500 px-2 py-0.5 rounded-full shrink-0">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{venue.rating || "4.5"}</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-2">
          <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
          <span className="line-clamp-1">{venue.address}</span>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
            {venue.distance || "1.2 km"}
          </div>
          <Link to={`/venue/${venue.id}`} className="text-sm font-medium text-amber-600 dark:text-amber-500 hover:underline">
            View Details &rarr;
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
