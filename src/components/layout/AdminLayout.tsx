
import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    LogOut,
    Menu,
    X,
    Tag,
    MessageSquare,
    FileText,
    Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AdminLayoutProps {
    children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    // Check for mobile screen
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMobile(true);
                setIsSidebarOpen(false);
            } else {
                setIsMobile(false);
                setIsSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Listen for auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to log out");
        }
    };

    const navItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
        { name: "Orders", icon: ShoppingCart, path: "/admin/orders" },
        { name: "Products", icon: Package, path: "/admin/products" },
        // { name: "Add Product", icon: PlusCircle, path: "/admin/products/add" },
        { name: "Discounts", icon: Tag, path: "/admin/discount" },
        { name: "Inquiries", icon: MessageSquare, path: "/admin/contact-forms" },
        { name: "Blog", icon: FileText, path: "/admin/blogs" },
        // { name: "Settings", icon: Settings, path: "/admin/settings" },
    ];

    return (
        <div className="flex h-screen bg-slate-100 text-slate-950">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 shrink-0 border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out md:static md:w-64 md:translate-x-0",
                    !isSidebarOpen && "-translate-x-full md:hidden"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo Area */}
                    <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
                        <Link to="/admin" className="flex min-w-0 items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white">
                                <Store className="h-5 w-5" />
                            </span>
                            <span className="min-w-0">
                                <span className="block truncate text-base font-semibold tracking-normal text-slate-950">SOMNE</span>
                                <span className="block text-xs font-medium uppercase tracking-wide text-slate-500">Admin workspace</span>
                            </span>
                        </Link>
                        {isMobile && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="ml-auto h-9 w-9 md:hidden"
                                onClick={() => setIsSidebarOpen(false)}
                                aria-label="Close admin menu"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path ||
                                (item.path !== "/admin" && location.pathname.startsWith(item.path));
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-slate-950 text-white shadow-sm"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                                    )}
                                    onClick={() => isMobile && setIsSidebarOpen(false)}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User & Logout */}
                    <div className="border-t border-slate-200 p-4">
                        <div className="mb-4 flex min-w-0 items-center gap-3 rounded-lg bg-slate-50 p-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                                AD
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-950">Administrator</p>
                                <p className="truncate text-xs text-slate-500" title={user?.email || ""}>
                                    {user?.email || "admin@somne.com"}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="h-10 w-full justify-start border-red-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex min-w-0 flex-1 flex-col">
                {/* Mobile Header */}
                <header className="sticky top-0 z-40 flex h-16 items-center border-b border-slate-200 bg-white px-4 md:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(true)}
                        className="-ml-2"
                        aria-label="Open admin menu"
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                    <span className="ml-2 text-sm font-semibold text-slate-950">Somne Admin</span>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-auto bg-slate-100">
                    {children}
                </main>
            </div>

            {/* Overlay for mobile */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
