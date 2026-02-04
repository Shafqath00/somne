import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center ">
        <img src="/404.png" alt="404" className="w-1/2 mx-auto" />
        {/* <p className="mb-4 text-2xl text-muted-foreground">Oops! Page not found</p> */}
        <Button onClick={() => navigate("/")} className=" rounded-lg">
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
