import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Globe, Mail, Phone, User, Users } from "lucide-react";

const touchpointTypes = [
  { icon: Globe, label: "Web" },
  { icon: Mail, label: "Email" },
  { icon: Phone, label: "Phone" },
  { icon: User, label: "In-person" },
];

export const Sidebar = () => {
  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('text/plain', type);
  };

  return (
    <div className="flex w-64 flex-col border-r border-navy-light/10 bg-white">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <div>
            <h2 className="mb-2 text-sm font-semibold text-navy">Journey Stages</h2>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                Awareness
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Consideration
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Decision
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h2 className="mb-2 text-sm font-semibold text-navy">Touchpoint Types</h2>
            <div className="space-y-2">
              {touchpointTypes.map(({ icon: Icon, label }) => (
                <Button
                  key={label}
                  variant="ghost"
                  className="w-full justify-start gap-2 cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={(e) => handleDragStart(e, label)}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h2 className="mb-2 text-sm font-semibold text-navy">Personas</h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                Add Persona
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};