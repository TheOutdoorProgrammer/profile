// Carousel navigation
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

    // Lazy YouTube video embeds (click to play)
    document.querySelectorAll('.video-thumb[data-video-id]').forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            var videoId = this.getAttribute('data-video-id');
            var iframe = document.createElement('iframe');
            iframe.setAttribute('src', 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0');
            iframe.setAttribute('allow', 'autoplay; encrypted-media');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('loading', 'lazy');
            this.innerHTML = '';
            this.appendChild(iframe);
            this.style.cursor = 'default';
        });
    });

    // Lazy YouTube shorts embeds (click to play)
    document.querySelectorAll('.video-thumb[data-short-id]').forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            var videoId = this.getAttribute('data-short-id');
            var iframe = document.createElement('iframe');
            iframe.setAttribute('src', 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0');
            iframe.setAttribute('allow', 'autoplay; encrypted-media');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('loading', 'lazy');
            this.innerHTML = '';
            this.appendChild(iframe);
            this.style.cursor = 'default';
        });
    });

    // Intersection Observer for fade-in animation
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.section').forEach(function (section) {
            section.style.opacity = '0';
            section.style.animationPlayState = 'paused';
            observer.observe(section);
        });
    }
});
