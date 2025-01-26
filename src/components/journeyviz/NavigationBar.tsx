import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Download, FilePlus } from "lucide-react";

export const NavigationBar = () => {
  return (
    <nav className="flex h-16 items-center justify-between border-b border-navy-light/10 bg-white px-4 shadow-sm">
      <div className="text-xl font-bold text-navy">JourneyViz</div>
      <div className="flex items-center gap-4">
        <Button variant="outline" className="gap-2">
          <FilePlus className="h-4 w-4" />
          New Journey
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Templates
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>E-commerce Journey</DropdownMenuItem>
            <DropdownMenuItem>SaaS Onboarding</DropdownMenuItem>
            <DropdownMenuItem>Service Blueprint</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
    </nav>
  );
};