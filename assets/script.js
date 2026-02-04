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

    // ===== Helper: scroll carousel to center a specific item =====
    function scrollToCenter(carousel, item) {
        var carouselRect = carousel.getBoundingClientRect();
        var itemRect = item.getBoundingClientRect();
        var offset = (itemRect.left - carouselRect.left) + carousel.scrollLeft - (carouselRect.width / 2) + (itemRect.width / 2);
        carousel.scrollTo({ left: offset, behavior: 'smooth' });
    }

    // ===== Lazy YouTube Video Embeds (Click to Play) =====
    document.querySelectorAll('.video-thumb[data-video-id]').forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            var videoId = this.getAttribute('data-video-id');
            var iframe = document.createElement('iframe');
            iframe.setAttribute('src', 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('loading', 'lazy');
            this.innerHTML = '';
            this.appendChild(iframe);
            this.style.cursor = 'default';
            // Center the playing video in the carousel
            var carouselItem = this.closest('.carousel-item');
            var carousel = this.closest('.carousel');
            if (carouselItem && carousel) {
                scrollToCenter(carousel, carouselItem);
            }
        });
    });

    // Lazy YouTube Shorts embeds (click to play)
    document.querySelectorAll('.video-thumb[data-short-id]').forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            var videoId = this.getAttribute('data-short-id');
            var iframe = document.createElement('iframe');
            iframe.setAttribute('src', 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('loading', 'lazy');
            this.innerHTML = '';
            this.appendChild(iframe);
            this.style.cursor = 'default';
            // Center the playing short in the carousel
            var carouselItem = this.closest('.carousel-item');
            var carousel = this.closest('.carousel');
            if (carouselItem && carousel) {
                scrollToCenter(carousel, carouselItem);
            }
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
