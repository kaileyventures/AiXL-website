// AiXL Web Logic & Interactions

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu Toggler
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    function openMenu() {
        hamburger.classList.add('active');
        navLinks.classList.add('active');
        navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        if (hamburger.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navOverlay.addEventListener('click', closeMenu);

    // Close menu when links are clicked (for mobile users)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2.5. Theme Switcher (Dark/Light Mode)
    const themeToggle = document.getElementById('themeToggle');
    const storedTheme = localStorage.getItem('aixl-theme');
    
    // Determine initial theme
    if (storedTheme === 'light') {
        document.body.classList.add('light-theme');
    } else if (storedTheme === 'dark') {
        document.body.classList.remove('light-theme');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.body.classList.add('light-theme');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('aixl-theme', theme);
    });

    // 3. Scroll Reveal Animations (Intersection Observer)
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animates once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(element => {
        revealObserver.observe(element);
    });

    // 4. Interactive Spreadsheet Simulation
    const demoData = {
        formula: {
            prompt: "Extract the domain name from the email addresses in column A",
            headers: ["Email (Col A)", "Domain (Col B)", ""],
            rows: [
                ["john@gmail.com", "", ""],
                ["sarah@kailey.com", "", ""],
                ["dev@ventures.org", "", ""]
            ],
            formula: '=MID(A1, FIND("@", A1)+1, LEN(A1))',
            highlights: ['cellB1', 'cellB2', 'cellB3'],
            results: [
                { id: 'cellB1', val: 'gmail.com' },
                { id: 'cellB2', val: 'kailey.com' },
                { id: 'cellB3', val: 'ventures.org' }
            ]
        },
        cleaning: {
            prompt: "Clean leading/trailing spaces and make raw names proper case in A",
            headers: ["Raw Name (Col A)", "Clean Name (Col B)", ""],
            rows: [
                ["   jOhn  SmITh ", "", ""],
                ["  sArAh kAiLeY ", "", ""],
                [" deV VenTuREs  ", "", ""]
            ],
            formula: '=PROPER(TRIM(A1))',
            highlights: ['cellB1', 'cellB2', 'cellB3'],
            results: [
                { id: 'cellB1', val: 'John Smith' },
                { id: 'cellB2', val: 'Sarah Kailey' },
                { id: 'cellB3', val: 'Dev Ventures' }
            ]
        },
        analysis: {
            prompt: "If sales in column B is greater than 500, label 'VIP', else label 'Normal'",
            headers: ["Product (Col A)", "Sales (Col B)", "Status (Col C)"],
            rows: [
                ["AiXL Addon License", "650", ""],
                ["Standard License", "340", ""],
                ["Enterprise Support", "1200", ""]
            ],
            formula: '=IF(B1>500, "VIP", "Normal")',
            highlights: ['cellC1', 'cellC2', 'cellC3'],
            results: [
                { id: 'cellC1', val: 'VIP' },
                { id: 'cellC2', val: 'Normal' },
                { id: 'cellC3', val: 'VIP' }
            ]
        }
    };

    const promptButtons = document.querySelectorAll('.demo-prompt-btn');
    const chatText = document.getElementById('chatText');
    const formulaBar = document.getElementById('formulaBar');
    
    // Grid element nodes
    const colA = document.getElementById('colA');
    const colB = document.getElementById('colB');
    const colC = document.getElementById('colC');
    
    const cells = {
        A1: document.getElementById('cellA1'),
        B1: document.getElementById('cellB1'),
        C1: document.getElementById('cellC1'),
        A2: document.getElementById('cellA2'),
        B2: document.getElementById('cellB2'),
        C2: document.getElementById('cellC2'),
        A3: document.getElementById('cellA3'),
        B3: document.getElementById('cellB3'),
        C3: document.getElementById('cellC3')
    };

    let typingTimeout = null;
    let animationSequence = [];

    function clearAllTimeouts() {
        if (typingTimeout) clearTimeout(typingTimeout);
        animationSequence.forEach(t => clearTimeout(t));
        animationSequence = [];
    }

    // Typewriter effect function
    function typeText(element, text, speed, callback) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                typingTimeout = setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        }
        type();
    }

    // Main animation orchestrator
    function runDemo(type) {
        clearAllTimeouts();

        const data = demoData[type];

        // Reset grid instantly
        colA.textContent = data.headers[0] || 'A';
        colB.textContent = data.headers[1] || 'B';
        colC.textContent = data.headers[2] || 'C';

        // Clear cells and set initial data
        Object.keys(cells).forEach(key => {
            cells[key].textContent = '';
            cells[key].classList.remove('highlighted', 'computed');
        });

        // Set row values
        cells.A1.textContent = data.rows[0][0];
        cells.B1.textContent = data.rows[0][1];
        cells.C1.textContent = data.rows[0][2];

        cells.A2.textContent = data.rows[1][0];
        cells.B2.textContent = data.rows[1][1];
        cells.C2.textContent = data.rows[1][2];

        cells.A3.textContent = data.rows[2][0];
        cells.B3.textContent = data.rows[2][1];
        cells.C3.textContent = data.rows[2][2];

        chatText.textContent = '';
        formulaBar.textContent = '';

        // Step 1: Type the prompt
        typeText(chatText, data.prompt, 25, () => {
            // Step 2: Show "Thinking" state in formula bar
            animationSequence.push(setTimeout(() => {
                formulaBar.textContent = 'AiXL generating function...';
                formulaBar.style.color = 'var(--primary-cyan)';
            }, 600));

            // Step 3: Type formula
            animationSequence.push(setTimeout(() => {
                formulaBar.style.color = 'var(--text-primary)';
                typeText(formulaBar, data.formula, 35, () => {
                    
                    // Step 4: Highlight targeted cells
                    animationSequence.push(setTimeout(() => {
                        data.highlights.forEach(cellId => {
                            const cell = document.getElementById(cellId);
                            if (cell) cell.classList.add('highlighted');
                        });
                    }, 800));

                    // Step 5: Fill calculated results row by row
                    data.results.forEach((res, index) => {
                        animationSequence.push(setTimeout(() => {
                            const cell = document.getElementById(res.id);
                            if (cell) {
                                cell.textContent = res.val;
                                cell.classList.remove('highlighted');
                                cell.classList.add('computed');
                            }
                        }, 1400 + index * 500));
                    });

                });
            }, 1800));
        });
    }

    // Add click listeners to demo buttons
    promptButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            promptButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            runDemo(btn.dataset.type);
        });
    });

    // Initialize first demo
    runDemo('formula');

    // 5. Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show status message with animation
        formStatus.style.display = 'block';
        
        // Clear fields
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('message').value = '';

        // Auto hide success banner after 5 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    });

    // Set dynamic copyright year
    const copyrightYearEl = document.getElementById('copyrightYear');
    if (copyrightYearEl) {
        copyrightYearEl.textContent = new Date().getFullYear();
    }

    // Adjust grid parallax background on mouse movement (Extra wow factor)
    const gridOverlay = document.getElementById('gridOverlay');
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        gridOverlay.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
    });

    // Back to Top scroll progress and outline fill functionality
    const backToTopBtn = document.getElementById('backToTop');
    const progressCircle = document.querySelector('.back-to-top-circle');
    const pathLength = 132; // Circumference of r=21 circle (2 * Math.PI * 21)

    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
            const drawLength = pathLength * scrollPercent;
            progressCircle.style.strokeDashoffset = pathLength - drawLength;
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        // Reset path to empty on click
        progressCircle.style.strokeDashoffset = pathLength;
    });

});
