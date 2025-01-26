import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Globe, Mail, Phone, User, Users } from "lucide-react";

export const Sidebar = () => {
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
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Globe className="h-4 w-4" />
                Web
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <User className="h-4 w-4" />
                In-person
              </Button>
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