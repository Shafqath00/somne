import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SomneLoader } from "@/components/ui/SomneLoader";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <SomneLoader fullscreen label="Signing you in" />
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
}
