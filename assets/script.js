// ===== Intersection Observer for Fade-in Animation =====
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05 });

        document.querySelectorAll('.section').forEach(function (section) {
            section.style.opacity = '0';
            section.style.animationPlayState = 'paused';
            observer.observe(section);
        });
    }

    // ===== Badge Pill Modals =====
    // Move badge modal overlays to <body> so they are never clipped by hero overflow on mobile Safari
    document.querySelectorAll('.badge-modal-overlay').forEach(function (overlay) {
        document.body.appendChild(overlay);
    });

    function closeAllBadgeModals() {
        document.querySelectorAll('.badge-modal-overlay.active').forEach(function (overlay) {
            overlay.classList.remove('active');
        });
        document.body.classList.remove('badge-modal-open');
    }

    document.querySelectorAll('.badge-pill[data-modal]').forEach(function (pill) {
        pill.addEventListener('click', function () {
            var modalId = this.getAttribute('data-modal');
            var overlay = document.getElementById(modalId);
            if (overlay) {
                closeAllBadgeModals();
                overlay.classList.add('active');
                document.body.classList.add('badge-modal-open');
            }
        });
    });

    // Close modal on X button
    document.querySelectorAll('.badge-modal-close').forEach(function (btn) {
        btn.addEventListener('click', function () {
            closeAllBadgeModals();
        });
    });

    // Close modal on overlay click
    document.querySelectorAll('.badge-modal-overlay').forEach(function (overlay) {
        overlay.addEventListener('click', function (e) {
            if (e.target === this) {
                closeAllBadgeModals();
            }
        });
    });

    // Close modal on Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeAllBadgeModals();
        }
    });

    // ===== Copy Buttons =====
    document.querySelectorAll('.copy-btn[data-copy]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var text = this.getAttribute('data-copy');
            var button = this;
            navigator.clipboard.writeText(text).then(function () {
                button.classList.add('copied');
                var icon = button.querySelector('.iconify-inline');
                if (icon) {
                    icon.setAttribute('data-icon', 'mdi:check');
                }
                setTimeout(function () {
                    button.classList.remove('copied');
                    if (icon) {
                        icon.setAttribute('data-icon', 'mdi:content-copy');
                    }
                }, 2000);
            });
        });
    });

    // ===== Hide scroll indicator on scroll =====
    var scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        var hidden = false;
        window.addEventListener('scroll', function () {
            if (!hidden && window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.transition = 'opacity 0.5s ease';
                hidden = true;
            }
        }, { passive: true });
    }
});
