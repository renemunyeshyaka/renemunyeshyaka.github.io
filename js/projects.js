// Enhanced projects data with more details
const projects = [

    {
        title: "Pay Gateway System",
        description: "Pay Gateway System enable users with multiple authentication and secure account for all users, employers and Admin, providing strong password, CAPTCHA, mail activation for registration and OTP at each login attempt. The system is linked to the owner bank account for smooth payment, product catalog for the users, refund/claim, support and more.",
        tags: ["Spring Boot", "Spring Security", "JWT", "PostgreSQL", "OTP", "Email Service", "CRUD API", "MFA", "User Registration", "Validation", "Verification",  "Authentication", "Transaction"],
        image: "assets/projects/paymentgateway.webp",
        github: "https://github.com/renemunyeshyaka/",
        liveDemo: "#",
        featured: true, // Changed to true to show all 6 projects
        category: "Backend"
    },

    {
        title: "Portfolio Website",
        description: "Responsive portfolio website designed to showcase personal projects, creative works, and skills with an engaging, user-friendly interface. It includes smooth animations and a clean, minimalist look that emphasizes clarity and elegance. Built with a focus on performance, fast loading, and accessibility for all users, ensuring an inclusive and enjoyable experience.",
        tags: ["HTML5", "CSS", "JavaScript", "Responsive Design", "Animation", "Performance", "Accessibility"],
        image: "assets/projects/portfolio.webp",
        github: "https://github.com/renemunyeshyaka/renemunyeshyaka.github.io",
        liveDemo: "https://renemunyeshyaka.github.io/",
        featured: true,
        category: "Frontend"
    },
    {
        title: "FinancialApp",
        description: "A user-friendly financial management application designed to help users track expenses, plan budgets, and gain valuable financial insights. It features easy-to-navigate dashboards and comprehensive reporting tools that assist users in analyzing their financial habits, identifying spending patterns, and making informed decisions to improve their financial stability and future planning.",
        tags: ["React", "Node.js", "Express", "MongoDB", "Chart.js", "JWT Auth", "REST API"],
        image: "assets/projects/FinancialApp.webp",
        github: "https://github.com/renemunyeshyaka/FinancialApp",
        liveDemo: "https://renemunyeshyaka.github.io/FinancialApp/",
        featured: true,
        category: "Full Stack"
    },
    {
        title: "Scan and Pay",
        description: "Scan and Pay system has secure account for all users, business owners and Admin. Any buyer can use it to process the payment via QR scan to reduce errors, keep track on transaction, proof of payment, reduce errors and build trust among the users.",
        tags: ["Java", "JS", "CRUD API", "PostgreSQL", "Unit Testing", "API Integration"],
        image: "assets/projects/scanandpay.webp",
        github: "https://github.com/renemunyeshyaka/scan_and_pay",
        liveDemo: "#",
        featured: true, // Changed to true to show all 6 projects
        category: "Frontend"
    },

    {
        title: "eLearnPro",
        description: "A comprehensive Learning Management System (LMS) platform for effective online training and seamless learning experiences. Features include course management, progress tracking, payment integration, and digital signatures for certifications.",
        tags: ["Java Spring Boot", "React", "Tailwind CSS", "Payment System", "Digital Signature", "RESTful API", "MongoDB", "AWS"],
        image: "assets/projects/eLeaningPro.webp",
        github: "https://github.com/renemunyeshyaka/eLearningPro",
        liveDemo: "#",
        featured: true,
        category: "Full Stack"
    },

    {
        title: "Swedish Open University",
        description: "A distance learning institution platform providing flexible and accessible higher education worldwide. Features course management, student portals, and administrative dashboards.",
        tags: ["Java Spring Boot", "Thymeleaf", "PostgreSQL", "Bootstrap", "LMS", "Education"],
        image: "assets/projects/Swedish Open University.webp",
        github: "https://github.com/renemunyeshyaka/SWEDISH-OPEN-UNIVERSITY",
        liveDemo: "https://swedishopenuniversity.se/",
        featured: true,
        category: "Full Stack"
    }
];

// Function to render ALL projects (not just featured)
function renderProjects() {
    const projectsContainer = document.getElementById('projects-container');
    
    // Clear existing content
    projectsContainer.innerHTML = '';
    
    // Render ALL projects
    projects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = `project-card scroll-trigger delay-${(index % 3) + 1}`;
        
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="project-overlay">
                    <div class="project-category">${project.category}</div>
                    ${project.featured ? '<div class="project-featured">Featured</div>' : ''}
                </div>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.github}" target="_blank" rel="noopener noreferrer">
                        <i class="fab fa-github"></i>
                        <span>View Code</span>
                    </a>
                    ${project.liveDemo && project.liveDemo !== '#' ? 
                        `<a href="${project.liveDemo}" target="_blank" rel="noopener noreferrer">
                            <i class="fas fa-external-link-alt"></i>
                            <span>Live Demo</span>
                        </a>` : 
                        '<a href="#" class="disabled" onclick="return false;"><i class="fas fa-external-link-alt"></i><span>Demo Soon</span></a>'
                    }
                </div>
            </div>
        `;
        
        projectsContainer.appendChild(projectCard);
    });
}

// Initialize projects when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    renderProjects();
    
    // Add CSS for project enhancements
    const style = document.createElement('style');
    style.textContent = `
        .project-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.8));
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 20px;
            opacity: 0;
            transition: var(--transition);
        }
        
        .project-card:hover .project-overlay {
            opacity: 1;
        }
        
        .project-category,
        .project-featured {
            padding: 6px 12px;
            border-radius: var(--border-radius-sm);
            font-size: 0.8rem;
            font-weight: 600;
        }
        
        .project-category {
            background: var(--primary-color);
            color: var(--white);
        }
        
        .project-featured {
            background: var(--accent-color);
            color: var(--white);
        }
        
        .project-links a.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
        }
        
        /* Ensure all projects are visible and properly laid out */
        .projects-grid {
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
        }
        
        .projects-grid .project-card {
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
        }
        
        @media (min-width: 1200px) {
            .projects-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }
        
        @media (min-width: 768px) and (max-width: 1199px) {
            .projects-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media (max-width: 767px) {
            .projects-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
});