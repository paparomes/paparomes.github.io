import { NavigationBar } from "@/components/journeyviz/NavigationBar";
import { Sidebar } from "@/components/journeyviz/Sidebar";
import { Canvas } from "@/components/journeyviz/Canvas";

const JourneyViz = () => {
  return (
    <div className="flex h-screen flex-col bg-navy-surface">
      <NavigationBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <Canvas />
      </div>
    </div>
  );
};

export default JourneyViz;