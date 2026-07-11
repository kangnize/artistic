document.addEventListener("DOMContentLoaded", () => {
    if (window.AOS) {
        AOS.init({
            duration: 700,
            easing: "ease-out-cubic",
            once: true,
            offset: 80
        });
    }

    const navbar = document.getElementById("mainNav");
    const navLinks = document.querySelectorAll("#navbarNav .nav-link");
    const sections = document.querySelectorAll("main section[id]");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const portfolioItems = document.querySelectorAll(".portfolio-item");
    const contactForm = document.getElementById("contactForm");

    const updateNavbar = () => {
        navbar.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    const updateActiveLink = () => {
        const navHeight = navbar.offsetHeight;
        let currentId = "";

        sections.forEach((section) => {
            const top = section.offsetTop - navHeight - 120;
            const bottom = top + section.offsetHeight;
            if (window.scrollY >= top && window.scrollY < bottom) {
                currentId = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
        });
    };

    window.addEventListener("scroll", () => {
        updateNavbar();
        updateActiveLink();
    });

    updateNavbar();
    updateActiveLink();

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const href = anchor.getAttribute("href");
            if (!href || href === "#") return;

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
            window.scrollTo({ top, behavior: "smooth" });

            const collapse = document.getElementById("navbarNav");
            if (collapse && collapse.classList.contains("show") && window.bootstrap) {
                bootstrap.Collapse.getOrCreateInstance(collapse).hide();
            }
        });
    });

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;

            filterButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");

            portfolioItems.forEach((item) => {
                const shouldShow = filter === "all" || item.classList.contains(filter);
                item.style.display = shouldShow ? "" : "none";
            });
        });
    });

    const animateCounter = (element, target, duration = 1600) => {
        const startTime = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = `${Math.floor(eased * target)}+`;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                element.textContent = `${target}+`;
            }
        };

        requestAnimationFrame(tick);
    };

    const aboutSection = document.getElementById("about");
    if (aboutSection) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                animateCounter(document.getElementById("yearsExperience"), 8);
                animateCounter(document.getElementById("clientsServed"), 150);
                animateCounter(document.getElementById("projectsDelivered"), 300);
                observer.disconnect();
            });
        }, { threshold: 0.35 });

        counterObserver.observe(aboutSection);
    }

    if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const service = document.getElementById("service").value;
        const eventDate = document.getElementById("eventDate").value;
        const message = document.getElementById("message").value.trim();

        if (!fullName || !phone || !service || !message) {
            showFormMessage(
                "Please complete the required fields before sending.",
                "error"
            );
            return;
        }


        const templateParams = {
            name: fullName,
            phone: phone,
            email: email || "Not provided",
            service: service,
            event_date: eventDate || "Not specified",
            message: message
        };


        // SEND EMAIL USING EMAILJS
        emailjs.send(
            "service_tphwhme",
            "template_205ssxd",
            templateParams
        )
        .then(() => {

            showFormMessage(
                "Inquiry sent successfully. Opening WhatsApp...",
                "success"
            );


            const whatsappMessage = [
                "Hello Artistic Photography Media, I would like to make a booking inquiry.",
                "",
                `Name: ${fullName}`,
                `Phone: ${phone}`,
                `Email: ${email || "Not provided"}`,
                `Service: ${service}`,
                `Event date: ${eventDate || "Not specified"}`,
                "",
                `Message: ${message}`
            ];


            const whatsappNumber = "254711130757";

            const whatsappUrl =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                whatsappMessage.join("\n")
            )}`;


            window.open(
                whatsappUrl,
                "_blank",
                "noopener,noreferrer"
            );


            contactForm.reset();

        })
        .catch((error) => {

            console.log("EmailJS Error:", error);

            showFormMessage(
                "Failed to send inquiry. Please try WhatsApp directly.",
                "error"
            );

        });

    });
}
});

function showFormMessage(text, type) {
    const formMessage = document.getElementById("formMessage");
    if (!formMessage) return;

    formMessage.innerHTML = `<p class="form-alert ${type}">${text}</p>`;
}
