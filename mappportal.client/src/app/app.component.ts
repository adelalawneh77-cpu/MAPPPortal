import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';

interface TaskStats {
  currentYear: number;
  year2004: number;
}

interface ProjectStats {
  inProgress: number;
  completed: number;
}

interface Report {
  title: string;
}

interface Meeting {
  title: string;
  time: string;
  location: string;
  link: string;
}

interface News {
  title: string;
  date: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  // User Info
  userName = 'عبدالله الغامدي';
  userRole = 'مدير النظام';
  notificationsCount = 3;
  tasksNotificationCount = 0; // Will be updated dynamically
  projectsNotificationCount = 2;

  // Tasks Data
  taskStats: TaskStats = {
    currentYear: 0,
    year2004: 0
  };

  // Reports Data
  cybersecurityReports: Report[] = [
    { title: 'تقرير سنة 2025' },
    { title: 'تقرير الموازنة العامة لسنة 2024' }
  ];

  projectReports: Report[] = [
    { title: 'تقرير سنة 2025' },
    { title: 'تقرير الادارة العامة 2025' },
    { title: 'التقرير العام للوزارة 2025' }
  ];

  // Project Stats
  projectStats: ProjectStats = {
    inProgress: 0,
    completed: 0
  };

  projects: any[] = [];
  userMilestones: any[] = [];
  currentUser: any = null;
  isLoadingMilestones = false;
  showProfileMenu = false;

  // Meetings Data
  meetings: Meeting[] = [
    {
      title: 'اجتماع مع وزير التعليم العالي',
      time: '08:00 ص - 09:00 ص',
      location: 'المملكة العربية السعودية, الرياض, وزارة السياحة',
      link: 'رابط الاجتماع الافتراضي'
    },
    {
      title: 'اجتماع مع مدير مديرية الأمانة العامة',
      time: '10:00 ص - 12:30 م',
      location: 'المملكة العربية السعودية, جدة, المديرية العامة',
      link: 'رابط الاجتماع الافتراضي'
    }
  ];

  // News Data
  news: News[] = [
    {
      title: 'وزارة السياحة السعودية تستهدف توفير 260 ألف فرصة عمل',
      date: '25 تشرين الأول 2025'
    },
    {
      title: 'إكسبو 2030 السعودية تتسلم "راية المعرض" رسمياً من اليابان',
      date: '14 تشرين الأول 2025'
    },
    {
      title: 'المؤشر الوطني للذكاء الاصطناعي يقيس جاهزية الجهود الحكومية للتحول الذكي',
      date: '13 تشرين الأول 2025'
    },
    {
      title: 'المؤشر الوطني للذكاء الاصطناعي يقيس جاهزية الجهود الحكومية للتحول الذكي',
      date: '12 تشرين الأول 2025'
    }
  ];

  showDashboard = false; // Will be determined by route
  showLayout: boolean | undefined = undefined; // Show header and sidebar for all pages except login - undefined initially to show login page

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Initialize layout state - undefined initially to show login page
    // Will be set to true/false based on authentication and route
    this.showLayout = undefined;
    
    // Get initial user state
    const initialUser = this.authService.getCurrentUser();
    this.currentUser = initialUser;
    
    // Check current route and show dashboard only on dashboard route
    // Use router events to handle initial navigation and route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const currentUrl = event.urlAfterRedirects || event.url;
      this.handleRouteChange(currentUrl);
      // Reload projects and user milestones when navigating to dashboard
      if ((currentUrl === '/dashboard' || currentUrl === '') && this.currentUser) {
        this.loadProjectsForDashboard();
        this.loadUserMilestones();
      }
    });
    
    // Handle initial route - wait a bit for router to initialize
    setTimeout(() => {
      const currentUrl = this.router.url;
      this.handleRouteChange(currentUrl);
    }, 0);
    
    // Check authentication for future changes
    this.checkAuthentication();
    
    // Test backend connection on startup
    this.testBackendConnection();
    
    // Load projects data for dashboard only if authenticated
    if (initialUser) {
      this.loadProjectsForDashboard();
      this.loadUserMilestones();
    }
  }

  handleRouteChange(url: string) {
    const isLoginPage = url === '/login' || url.includes('/login') || url === '/' || url === '';
    const isLoggedIn = this.currentUser !== null;
    
    // If no user or on login/root page, ensure layout is hidden
    if (!isLoggedIn || isLoginPage) {
      this.showLayout = false;
      // Redirect to login if not authenticated and not already on login
      if (!isLoggedIn && !isLoginPage) {
        this.router.navigate(['/login']);
      } else if (isLoggedIn && isLoginPage) {
        // User is logged in but on login/root - redirect to dashboard
        this.router.navigate(['/dashboard']);
      }
    } else {
      // User is logged in and not on login page - show layout
      this.showLayout = true;
    }
    
    // Update route state
    this.updateRouteState(url);
    
    // Reload projects and user milestones when navigating to dashboard
    const isDashboard = url === '/dashboard' || url === '';
    if (isDashboard && isLoggedIn) {
      this.loadProjectsForDashboard();
      this.loadUserMilestones();
    }
  }

  updateRouteState(url: string) {
    const wasDashboard = this.showDashboard;
    this.showDashboard = url === '/dashboard' || url === '';
    // Show layout only if user is logged in and not on login page or root
    const isLoggedIn = this.currentUser !== null;
    const isLoginPage = url === '/login' || url.includes('/login') || url === '/' || url === '';
    // Don't show layout if on login page or root path (which redirects to login)
    // Only update if we're not already on a login/root page to prevent showing layout
    if (!isLoginPage) {
      this.showLayout = isLoggedIn;
    } else {
      this.showLayout = false;
    }
    
    // Reload projects and user milestones when navigating to dashboard (if user is logged in)
    if (this.showDashboard && isLoggedIn && !wasDashboard) {
      this.loadProjectsForDashboard();
      this.loadUserMilestones();
    }
  }

  logout() {
    this.authService.logout();
  }

  checkAuthentication() {
    // Subscribe to user changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      
      // Handle route change based on new user state
      const currentUrl = this.router.url;
      this.handleRouteChange(currentUrl);
      
      // Reload user milestones when user changes
      if (user) {
        this.loadUserMilestones();
      } else {
        this.userMilestones = [];
        this.tasksNotificationCount = 0;
        this.updateTaskStats();
      }
      
      // Close profile menu on user change
      this.showProfileMenu = false;
    });
  }

  loadUserMilestones() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.isLoadingMilestones = true;
      const url = `${environment.apiUrl}/api/milestones/user/${user.id}`;
      this.http.get<any[]>(url).subscribe({
        next: (milestones) => {
          this.userMilestones = milestones;
          this.tasksNotificationCount = milestones.length; // Update notification count
          this.updateTaskStats();
          this.updateChartData(); // Update chart with milestone data
          this.isLoadingMilestones = false;
        },
        error: (error) => {
          console.error('Error loading user milestones:', error);
          this.isLoadingMilestones = false;
        }
      });
    } else {
      // If no user, reset to defaults
      this.userMilestones = [];
      this.tasksNotificationCount = 0;
      this.updateTaskStats();
    }
  }

  updateTaskStats() {
    this.taskStats.currentYear = this.getCurrentYearMilestonesCount();
    this.taskStats.year2004 = this.getYear2004MilestonesCount();
  }

  getCurrentYearMilestonesCount(): number {
    const currentYear = new Date().getFullYear();
    return this.userMilestones.filter(m => {
      if (!m.startDate) return false;
      const milestoneYear = new Date(m.startDate).getFullYear();
      return milestoneYear === currentYear;
    }).length;
  }

  getYear2004MilestonesCount(): number {
    return this.userMilestones.filter(m => {
      if (!m.startDate) return false;
      const milestoneYear = new Date(m.startDate).getFullYear();
      return milestoneYear === 2004;
    }).length;
  }

  // Chart data for milestones visualization
  chartPoints: string = '';

  updateChartData() {
    if (this.userMilestones.length === 0) {
      // Default empty chart
      this.chartPoints = '0,80 30,80 60,80 90,80 120,80 150,80 180,80 210,80 240,80 270,80 300,80';
      return;
    }

    // Group milestones by month (last 12 months)
    const now = new Date();
    const monthlyCounts: { [key: string]: number } = {};
    
    // Initialize last 12 months with 0
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthlyCounts[key] = 0;
    }

    // Count milestones by month
    this.userMilestones.forEach(milestone => {
      if (milestone.startDate) {
        const date = new Date(milestone.startDate);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (monthlyCounts[key] !== undefined) {
          monthlyCounts[key]++;
        }
      }
    });

    // Find max count for scaling
    const maxCount = Math.max(...Object.values(monthlyCounts), 1);
    
    // Generate chart points (normalize to 0-80 range, where 80 is bottom and 0 is top)
    const points: string[] = [];
    const monthKeys = Object.keys(monthlyCounts).sort();
    monthKeys.forEach((key, index) => {
      const count = monthlyCounts[key];
      const y = 80 - (count / maxCount) * 60; // Scale from 80 (bottom) to 20 (top)
      const x = (index / (monthKeys.length - 1)) * 300; // Scale to 0-300 width
      points.push(`${x},${y}`);
    });

    // If we have less than 12 points, add intermediate points for smooth line
    if (points.length < 12) {
      const smoothedPoints: string[] = [];
      for (let i = 0; i < 12; i++) {
        const x = (i / 11) * 300;
        const index = Math.floor((i / 11) * (points.length - 1));
        const nextIndex = Math.min(index + 1, points.length - 1);
        const [x1, y1] = points[index].split(',').map(Number);
        const [x2, y2] = points[nextIndex].split(',').map(Number);
        const y = y1 + ((y2 - y1) * (i / 11 - index / (points.length - 1)) * (points.length - 1));
        smoothedPoints.push(`${x},${y}`);
      }
      this.chartPoints = smoothedPoints.join(' ');
    } else {
      this.chartPoints = points.join(' ');
    }
  }

  navigateToMilestoneDetails() {
    this.router.navigate(['/my-milestones']);
  }

  loadProjectsForDashboard() {
    const url = `${environment.apiUrl}/api/projects`;
    this.http.get<any[]>(url).subscribe({
      next: (projects) => {
        this.projects = projects;
        // Calculate completed projects (percentage >= 100)
        this.projectStats.completed = projects.filter((p: any) => p.percentage >= 100).length;
        // Calculate in-progress projects (percentage < 100)
        this.projectStats.inProgress = projects.filter((p: any) => p.percentage < 100).length;
      },
      error: (error) => {
        console.error('Error loading projects for dashboard:', error);
      }
    });
  }

  navigateToProjectsProgress() {
    this.router.navigate(['/projects-progress']);
  }

  testBackendConnection() {
    const testUrl = 'http://localhost:5204/api/health';
    console.log('Testing backend connection to:', testUrl);
    
    this.http.get(testUrl).subscribe({
      next: (data) => {
        console.log('✅ Backend is accessible!', data);
      },
      error: (error) => {
        console.error('❌ Backend connection test failed:', error);
        console.error('Please check:');
        console.error('1. Is the backend running?');
        console.error('2. Is it running on http://localhost:5204?');
        console.error('3. Check Visual Studio Output window for backend logs');
      }
    });
  }
}
