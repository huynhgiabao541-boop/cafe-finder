import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Clock, Phone, Globe, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function VenueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header Image */}
      <div className="h-64 sm:h-80 w-full bg-slate-300 dark:bg-slate-800 relative">
        <div className="absolute inset-0 flex items-center justify-center text-slate-500">
          Hình ảnh nhà hàng
        </div>
        <div className="absolute top-4 left-4 z-10 flex w-full justify-between pr-8">
          <Button variant="secondary" size="icon" className="rounded-full shadow-md bg-white/80 hover:bg-white" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button variant="secondary" size="icon" className="rounded-full shadow-md bg-white/80 hover:bg-white text-slate-600 hover:text-red-500">
            <Heart className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 -mt-6 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex gap-2 mb-2">
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none dark:bg-amber-900/50 dark:text-amber-300">Quán Cafe</Badge>
                <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800/50">Đang mở cửa</Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">The Vintage Cafe {id}</h1>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 px-3 py-1 rounded-lg font-bold text-lg">
                <Star className="w-5 h-5 fill-current" /> 4.8
              </div>
              <span className="text-xs text-slate-500 mt-1">120 đánh giá</span>
            </div>
          </div>

          <div className="space-y-4 text-slate-600 dark:text-slate-300 mt-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 shrink-0 text-slate-400 mt-0.5" />
              <div>
                <p>123 Pasteur, Phường Bến Nghé, Quận 1, TP. HCM</p>
                <p className="text-sm text-amber-600 cursor-pointer hover:underline mt-1">Xem trên bản đồ</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 shrink-0 text-slate-400" />
              <p>07:00 - 22:30 (Thứ 2 - Chủ nhật)</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 shrink-0 text-slate-400" />
              <p>028 3822 1234</p>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 shrink-0 text-slate-400" />
              <p className="text-amber-600 hover:underline cursor-pointer">vintagecafe.vn</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-lg mb-3">Mô tả</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Quán cafe mang phong cách hoài cổ nằm giữa trung tâm Sài Gòn. Không gian yên tĩnh,
              nhạc nhẹ nhàng, rất thích hợp để làm việc hoặc trò chuyện cùng bạn bè.
              Đặc sản của quán là Cà phê trứng và Trà sen vàng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
