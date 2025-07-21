// Sample projects data
const projects = [
    {
        title: "RESTful-APIs-in-React",
        description: "RESTful APIs in React | making HTTP requests (such as GET, POST, PUT, DELETE). This approach enables React applications to dynamically interact with backend services and create interactive, data-driven user interfaces.",
        tags: ["React", "Node.js", "CRUD API", "Cypress"],
        image: "assets/projects/RESTful-APIs-in-React.webp",
        github: "https://github.com/renemunyeshyaka/RESTful-APIs-in-React",
        liveDemo: "#"
    },
    {
        title: "spring-security-user-registration-with-email-validation",
        description: "Spring Security User Registration with Email Validation involves creating a secure user registration process where users sign up with their email addresses.",
        tags: ["Spring Boot", "Spring Tool Suite (STS)", "Mail", "Login", "Registration", "Personolized user profiles"],
        image: "assets/projects/spring_mailV.webp",
        github: "https://github.com/renemunyeshyaka/spring-security-user-registration-with-email-validation",
        liveDemo: "#"
    },
    {
        title: "The Swedish Open University, or Öppett Sverge Universitetet",
        description: "The Öppett Sverge Universitetet in Swedish, is a distance learning institution that provides flexible and accessible higher education to students in Sweden and all over the world. It is registered in Sweden with organizational number 559401-8557.",
        tags: ["Short Courses", "undergraduate", "Postgraduate", "PhD Programmes"],
        image: "assets/projects/Swedish Open University.webp",
        github: "https://github.com/renemunyeshyaka/SWEDISH-OPEN-UNIVERSITY",
        liveDemo: "https://swedishopenuniversity.se/"
    },
    {
        title: "user_authentication",
        description: "A User Authentication Module with Node.js provides essential functionalities such as user registration, login, password reset, and password change.",
        tags: ["Vue.js", "Spoonacular API", "Vuex", "CSS Grid"],
        image: "assets/projects/user_authentication.webp",
        github: "https://github.com/renemunyeshyaka/user_authentication",
        liveDemo: "#"
    },

    {
        title: "BUHORO-TRADING-RWANDA-BTR-",
        description: "Buhoro Trading Rwanda (BTR) LTD is a company which is specialised in imports and exports of high-quality edible, non-alcoholic beverage and hygienic products.",
        tags: ["Products", "Management", "Products", "Logistics", "Sales"],
        image: "assets/projects/BUHORO-TRADING-RWANDA-BTR.webp",
        github: "https://github.com/renemunyeshyaka/BUHORO-TRADING-RWANDA-BTR-",
        liveDemo: "https://buhorotr.rw/"
    },
    
    {
        title: "Portfolio Website",
        description: "A responsive portfolio website built with HTML, CSS, and JavaScript to showcase projects and skills with smooth animations and clean design.",
        tags: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
        image: "assets/projects/portfolio.webp",
        github: "https://github.com/renemunyeshyaka/renemunyeshyaka.github.io",
        liveDemo: "https://renemunyeshyaka.github.io/"
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