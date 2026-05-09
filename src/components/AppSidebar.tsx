import {
  LayoutDashboard, ClipboardList, Map, BookOpen,
  GraduationCap, FileText, TrendingUp, Users, MessageSquare,
  Calendar, Newspaper, LogOut, Sparkles, PlaySquare
} from "lucide-react";
import logoImg from "@/assets/logo.png";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Career Quiz", url: "/quiz", icon: ClipboardList },
  { title: "My Results", url: "/results", icon: Sparkles },
  { title: "Career Explorer", url: "/careers", icon: Map },
  { title: "Course Finder", url: "/courses", icon: BookOpen },
  { title: "Entrance Exams", url: "/exams", icon: GraduationCap },
  { title: "Skills & Roadmap", url: "/skills", icon: FileText },
  { title: "Salary Insights", url: "/insights", icon: TrendingUp },
  { title: "Recommendation Links", url: "/recommendations", icon: PlaySquare },
];

const mentorItems = [
  { title: "Find Mentors", url: "/mentors", icon: Users },
  { title: "Ask a Mentor", url: "/ask-mentor", icon: MessageSquare },
  { title: "Book Session", url: "/book-session", icon: Calendar },
  { title: "FAQs", url: "/resources", icon: Newspaper },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut, profile } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="ElevatePath" className="h-8 w-8 rounded-full object-cover" />
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-sidebar-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ElevatePath
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Mentorship</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mentorItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && profile && (
          <div className="mb-2 truncate text-xs text-sidebar-foreground/70">
            {profile.full_name || "Student"}
          </div>
        )}
        <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground" onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          {!collapsed && "Sign Out"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
