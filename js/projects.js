// Sample projects data
const projects = [
    {
        title: "RESTful-APIs-in-React",
        description: "RESTful APIs in React | making HTTP requests (such as GET, POST, PUT, DELETE)",
        tags: ["React", "Node.js", "CRUD API"],
        image: "assets/projects/RESTful-APIs-in-React.jpg",
        github: "https://github.com/renemunyeshyaka/RESTful-APIs-in-React",
        liveDemo: "https://RESTful-APIs-in-React-demo.renemunyeshyaka.com"
    },
    {
        title: "spring-security-user-registration-with-email-validation",
        description: "Spring Security User Registration with Email Validation involves creating a secure user registration process where users sign up with their email addresses.",
        tags: ["Spring Boot", "Spring Tool Suite (STS)", "Mail", "Login", "Registration", "Personolized user profiles"],
        image: "assets/projects/user_profile.jpg",
        github: "https://github.com/renemunyeshyaka/spring-security-user-registration-with-email-validation",
        liveDemo: "https://spring.renemunyeshyaka.com"
    },
    {
        title: "CurrencyConverterProjects",
        description: "CurrencyConverter Projects with Java involve developing applications that convert amounts between different currencies based on current exchange rates.",
        tags: ["Java", "JAVA CurrencyConverter", "Currency", "Converter" , "features", "Classes", "methods"],
        image: "assets/projects/CurrencyConverter.jpg",
        github: "https://github.com/renemunyeshyaka/CurrencyConverterProjects",
        liveDemo: "https://CurrencyConverter.renemunyeshyaka.com"
    },
    {
        title: "user_authentication",
        description: "A User Authentication Module with Node.js provides essential functionalities such as user registration, login, password reset, and password change.",
        tags: ["Vue.js", "Spoonacular API", "Vuex", "CSS Grid"],
        image: "assets/projects/user_authentication.jpg",
        github: "https://github.com/renemunyeshyaka/user_authentication",
        liveDemo: "https://user_authentication.renemunyeshyaka.com"
    },

    {
        title: "Django-API",
        description: "Create, Read, Update, and Delete (CRUD) API + Consumer API, with Django",
        tags: ["Django", "python", "CRUD API", "Json", "+", "Consumer API"],
        image: "assets/projects/Django-API.jpg",
        github: "https://github.com/renemunyeshyaka/Django-API/",
        liveDemo: "https://Django-API.renemunyeshyaka.com"
    },
    
    {
        title: "Portfolio Website",
        description: "A responsive portfolio website built with HTML, CSS, and JavaScript to showcase projects and skills with smooth animations and clean design.",
        tags: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
        image: "assets/projects/portfolio.jpg",
        github: "renemunyeshyaka.github.io",
        liveDemo: "https://renemunyeshyaka.dev"
    }
];

// Function to render projects
function renderProjects() {
    const projectsContainer = document.getElementById('projects-container');
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card fade-in';
        
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.github}" target="_blank"><i class="fab fa-github"></i> Code</a>
                    ${project.liveDemo ? `<a href="${project.liveDemo}" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                </div>
            </div>
        `;
        
        projectsContainer.appendChild(projectCard);
    });
}

// Initialize projects when DOM is loaded
document.addEventListener('DOMContentLoaded', renderProjects);