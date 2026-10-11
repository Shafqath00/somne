import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center animate-pulse">
            <Moon className="w-12 h-12 text-primary" />
          </div>
        </div>

        <h1 className="text-6xl font-serif font-bold text-primary mb-2">404</h1>
        <h2 className="text-2xl font-medium text-slate-800 mb-4">Page Not Found</h2>

        <p className="text-muted-foreground mb-8 text-lg">
          Looks like you've drifted off to a place that doesn't exist. Let's get you back to bed... err, home.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="gap-2 bg-primary hover:bg-primary/90 text-white"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
