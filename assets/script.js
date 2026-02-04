// ================================================================
// TheOutdoorProgrammer — Portfolio Scripts
// ================================================================

document.addEventListener('DOMContentLoaded', function () {

    // ---- Carousel button navigation ----
    document.querySelectorAll('.carousel-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var carouselId = this.getAttribute('data-carousel');
            var carousel = document.getElementById(carouselId);
            if (!carousel) return;
            var scrollAmount = carousel.offsetWidth * 0.75;
            if (this.classList.contains('carousel-btn-left')) {
                carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        });
    });

    // ---- Lazy YouTube embeds (click thumbnail → iframe) ----
    document.querySelectorAll('.video-thumb[data-video-id]').forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            var videoId = this.getAttribute('data-video-id');
            var iframe = document.createElement('iframe');
            iframe.setAttribute('src', 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0');
            iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');
            this.innerHTML = '';
            this.appendChild(iframe);
            this.style.cursor = 'default';
        });
    });

    // ---- Lazy YouTube Shorts embeds ----
    document.querySelectorAll('.video-thumb[data-short-id]').forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            var videoId = this.getAttribute('data-short-id');
            var iframe = document.createElement('iframe');
            iframe.setAttribute('src', 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0');
            iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');
            this.innerHTML = '';
            this.appendChild(iframe);
            this.style.cursor = 'default';
        });
    });

    // ---- Scroll-triggered fade-in for sections ----
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.section').forEach(function (section) {
            section.style.opacity = '0';
            section.style.animationPlayState = 'paused';
            observer.observe(section);
        });
    }

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
