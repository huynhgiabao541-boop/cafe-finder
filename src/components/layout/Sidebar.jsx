import { NavLink } from "react-router-dom";
import { Coffee, Map } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "/explore", icon: Map, label: "Explore" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden md:flex flex-col h-full z-10 shadow-sm relative">
      <div className="p-6">
        <div className="flex items-center gap-2 text-amber-600">
          <Coffee className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">CafeFinder</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
