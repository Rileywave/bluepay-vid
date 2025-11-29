
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header similar to dashboard */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-800">Page Not Found</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-5">
        <div className="text-center bg-white rounded-2xl p-8 shadow-sm border max-w-sm w-full">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold text-gray-400">404</span>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Oops! Page not found
          </h2>
          
          <p className="text-gray-600 mb-6 text-sm">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate("/")}
              className="w-full bg-bluepay-blue hover:bg-bluepay-darkBlue text-white"
            >
              <Home className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
