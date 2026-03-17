// ===== Carousel Navigation =====
document.addEventListener('DOMContentLoaded', function () {

    // Carousel button handlers
    document.querySelectorAll('.carousel-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var carouselId = this.getAttribute('data-carousel');
            var carousel = document.getElementById(carouselId);
            if (!carousel) return;
            var scrollAmount = carousel.offsetWidth * 0.7;
            if (this.classList.contains('carousel-btn-left')) {
                carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        });
    });

    // ===== Fullscreen Video Modal =====
    var modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = '<div class="video-modal-backdrop"></div><div class="video-modal-content"><button class="video-modal-close" aria-label="Close">&times;</button><div class="video-modal-player"></div></div>';
    document.body.appendChild(modal);

    var modalPlayer = modal.querySelector('.video-modal-player');
    var modalClose = modal.querySelector('.video-modal-close');
    var modalBackdrop = modal.querySelector('.video-modal-backdrop');

    function openVideoModal(videoId, isShort) {
        var iframe = document.createElement('iframe');
        iframe.setAttribute('src', 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0&playsinline=1');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('frameborder', '0');
        if (isShort) {
            iframe.classList.add('short-iframe');
        }
        modalPlayer.innerHTML = '';
        modalPlayer.appendChild(iframe);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeVideoModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // Small delay to let animation finish before destroying iframe
        setTimeout(function() { modalPlayer.innerHTML = ''; }, 300);
    }

    modalClose.addEventListener('click', closeVideoModal);
    modalBackdrop.addEventListener('click', closeVideoModal);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeVideoModal();
        }
    });

    // ===== YouTube Video Thumbs → Open in Modal =====
    document.querySelectorAll('.video-thumb[data-video-id]').forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            var videoId = this.getAttribute('data-video-id');
            openVideoModal(videoId, false);
        });
    });

    // YouTube Shorts thumbs → Open in Modal
    document.querySelectorAll('.video-thumb[data-short-id]').forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            var videoId = this.getAttribute('data-short-id');
            openVideoModal(videoId, true);
        });
    });

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
