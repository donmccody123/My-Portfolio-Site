// Main application logic
import { initAuth, onAuthStateChange, signIn, getUser } from './auth.js';
import { initPortfolio } from './portfolio.js';
import { initAdmin } from './admin.js';

let activeSection = 'home';
let showAdmin = false;

// Navigate to section
function navigateTo(section) {
  activeSection = section;
  const element = document.getElementById(section);
  if (element) {
    // Smooth scroll to section with offset for fixed navbar
    const navbarHeight = document.getElementById('navbar')?.offsetHeight || 64;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - 10;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    updateActiveNav();
  }
}

// Toggle mobile menu
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  
  if (mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.remove('hidden');
    menuIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
  } else {
    mobileMenu.classList.add('hidden');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
  }
}

// Toggle portfolio expansion
function togglePortfolioExpand() {
  const container = document.getElementById('portfolio-container');
  const btn = document.getElementById('portfolio-expand-btn');
  const btnText = document.getElementById('expand-btn-text');
  
  if (!container) {
    console.error('portfolio-container not found');
    return;
  }
  
  const isExpanded = container.classList.contains('expanded');
  console.log('Current expanded state:', isExpanded);
  
  if (isExpanded) {
    container.classList.remove('expanded');
    btnText.textContent = 'Show More';
    console.log('Collapsed');
  } else {
    container.classList.add('expanded');
    btnText.textContent = 'Show Less';
    console.log('Expanded');
  }
}

// Expose to global scope for HTML onclick
window.togglePortfolioExpand = togglePortfolioExpand;

// Show admin page
function showAdminPage() {
  showAdmin = true;
  const mainContent = document.getElementById('main-content');
  const loginPage = document.getElementById('login-page');
  const adminDashboard = document.getElementById('admin-dashboard');
  
  mainContent.classList.add('hidden');
  loginPage.classList.remove('hidden');
  adminDashboard.classList.add('hidden');
}

// Show login page
function showLoginPage() {
  const mainContent = document.getElementById('main-content');
  const loginPage = document.getElementById('login-page');
  const adminDashboard = document.getElementById('admin-dashboard');
  
  mainContent.classList.add('hidden');
  loginPage.classList.remove('hidden');
  adminDashboard.classList.add('hidden');
}

// Show admin dashboard
function showAdminDashboard() {
  const mainContent = document.getElementById('main-content');
  const loginPage = document.getElementById('login-page');
  const adminDashboard = document.getElementById('admin-dashboard');
  
  mainContent.classList.add('hidden');
  loginPage.classList.add('hidden');
  adminDashboard.classList.remove('hidden');
}

// Handle login
async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('login-error');
  const errorText = document.getElementById('login-error-text');
  const submitBtn = document.getElementById('login-submit');
  
  errorDiv.classList.add('hidden');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Signing in...';
  
  try {
    await signIn(email, password);
    showAdmin = true;
    // Auth state change will trigger showing the dashboard
    // Small delay to ensure auth state is updated
    setTimeout(() => {
      const user = getUser();
      if (user) {
        showAdminDashboard();
        initAdmin();
      }
    }, 100);
  } catch (error) {
    errorText.textContent = 'Invalid email or password';
    errorDiv.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Sign In';
  }
}

// Make functions available globally IMMEDIATELY
window.navigateTo = navigateTo;
window.toggleMobileMenu = toggleMobileMenu;
window.showAdmin = showAdminPage;
window.handleLogin = handleLogin;

console.log('✓ Navigation functions loaded and available globally');

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
  // Set current year
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  // Check if we're on admin page
  if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
    showAdmin = true;
  }
  
  // Initialize auth
  await initAuth();
  
  // Initialize portfolio
  await initPortfolio();
  
  // Initialize admin
  initAdmin();
  
  // Handle auth state changes
  onAuthStateChange((user) => {
    if (showAdmin || window.location.hash === '#admin') {
      if (user) {
        showAdminDashboard();
        // Re-initialize admin to render dashboard
        initAdmin();
      } else {
        showLoginPage();
      }
    }
  });
  
  // Update active section on scroll
  window.addEventListener('scroll', updateActiveSection);
  
  // Initialize services
  renderServices();
});

// Update active navigation
function updateActiveNav() {
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  
  navLinks.forEach(link => {
    if (link.dataset.nav === activeSection) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  mobileNavLinks.forEach(link => {
    const linkText = link.textContent.trim();
    const sectionName = getSectionName(activeSection);
    if (linkText === sectionName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Get section name from ID
function getSectionName(id) {
  const names = {
    'home': 'Home',
    'portfolio': 'Portfolio',
    'about': 'About',
    'services': 'Services',
    'contact': 'Contact'
  };
  return names[id] || id;
}

// Update active section on scroll
function updateActiveSection() {
  const sections = ['home', 'portfolio', 'about', 'services', 'contact'];
  const scrollPosition = window.scrollY + 100;
  
  sections.forEach(section => {
    const element = document.getElementById(section);
    if (element) {
      const offsetTop = element.offsetTop;
      const offsetHeight = element.offsetHeight;
      
      if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
        activeSection = section;
        updateActiveNav();
      }
    }
  });
}

// Render services
function renderServices() {
  const services = [
    {
      icon: `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>`,
      title: 'Flyer Design',
      description: 'Eye-catching flyers that grab attention and deliver your message effectively.',
    },
    {
      icon: `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>`,
      title: 'Logo Design',
      description: 'Memorable logos that represent your brand identity and values.',
    },
    {
      icon: `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>`,
      title: 'Brochure Design',
      description: 'Professional brochures that showcase your business beautifully.',
    },
    {
      icon: `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
      </svg>`,
      title: 'Banner Design',
      description: 'Impactful banners for events, promotions, and advertising campaigns.',
    },
    {
      icon: `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>`,
      title: 'T-Shirt Design',
      description: 'Creative t-shirt designs that stand out and make a statement.',
    },
    {
      icon: `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>`,
      title: 'Branding',
      description: 'Complete branding solutions to establish your unique market presence.',
    },
    {
      icon: `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>`,
      title: 'Printing Services',
      description: 'High-quality printing and customization for all your needs.',
    },
    {
      icon: `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>`,
      title: 'Software & Hardware',
      description: 'Professional installation services for software and hardware systems.',
    },
  ];
  
  const servicesGrid = document.getElementById('services-grid');
  servicesGrid.innerHTML = services.map(service => `
    <div class="service-card">
      <div class="service-icon">
        ${service.icon}
      </div>
      <h3 class="service-title">
        ${service.title}
      </h3>
      <p class="service-description">
        ${service.description}
      </p>
    </div>
  `).join('');
}

