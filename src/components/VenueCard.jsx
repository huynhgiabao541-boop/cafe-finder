import { MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function VenueCard({ venue, onSave }) {
  return (
    <Card className="hover:shadow-md transition-shadow group relative">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 pr-2">
            <Badge className="mb-2 bg-slate-100 text-slate-600 hover:bg-slate-200 border-none shadow-sm dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              {venue.category || "Cafe"}
            </Badge>
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-amber-600 transition-colors">
              {venue.name}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <Button size="icon" variant="ghost" className="rounded-full w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors" onClick={(e) => { e.preventDefault(); onSave?.(venue); }}>
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col gap-1 mb-2">
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
            <span className="line-clamp-1">{venue.address}</span>
          </div>
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name)}+${venue.lat},${venue.lng}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:text-blue-600 hover:underline pl-4.5 ml-1"
          >
            Mở bằng Google Maps (Xem ảnh)
          </a>
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
