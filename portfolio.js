document.addEventListener('DOMContentLoaded', () => {
    // Scroll navigation active link highlight
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('nav ul li a');
    window.addEventListener('scroll', () => {
        let current = '';
        let scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 80;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // GSAP Animations
    // Animate skill bars on entering viewport
    const skills = document.querySelectorAll('.skill');

    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top <= window.innerHeight && rect.bottom >= 0;
    }

    function animateSkills() {
        skills.forEach(skill => {
            if (isInViewport(skill)) {
                const bar = skill.querySelector('.skill-bar span');
                const level = skill.getAttribute('data-level');
                gsap.to(bar, { width: level + '%', duration: 1.5, ease: 'power2.out' });
            }
        });
    }
    window.addEventListener('scroll', animateSkills);
    window.addEventListener('load', animateSkills);

    // Animate project cards with fade & slide up on scroll using GSAP and ScrollTrigger
    if (gsap && gsap.utils) {
        // Wrap in try-catch to avoid errors if ScrollTrigger unavailable
        try {
            gsap.registerPlugin(window.ScrollTrigger);
        } catch {}

        const cards = document.querySelectorAll('.project-card');
        gsap.utils.toArray(cards).forEach(card => {
            gsap.fromTo(card, { autoAlpha: 0, y: 20 }, {
                duration: 1,
                y: 0,
                autoAlpha: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    once: true
                }
            });
        });
    }

    // Contact form handling with backend submission
    const form = document.getElementById('contact-form');
    const formMessage = form.querySelector('.form-message');
    form.addEventListener('submit', async(e) => {
        e.preventDefault();
        formMessage.style.color = '#64ffda';
        formMessage.textContent = 'Sending message...';

        if (!form.checkValidity()) {
            formMessage.style.color = '#ff5555';
            formMessage.textContent = 'Please fill out the form correctly before submitting.';
            return;
        }

        const formData = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            message: form.message.value.trim()
        };

        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();

            if (response.ok && result.success) {
                formMessage.style.color = '#64ffda';
                formMessage.textContent = 'Thank you for your message! I will get back to you soon.';
                form.reset();
            } else {
                formMessage.style.color = '#ff5555';
                formMessage.textContent = result.error || 'Something went wrong, please try again later.';
            }
        } catch (error) {
            formMessage.style.color = '#ff5555';
            formMessage.textContent = 'Error sending message, please try again later.';
        }
    });
});