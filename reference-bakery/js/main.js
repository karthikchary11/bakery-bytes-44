// Main JavaScript functionality
$(document).ready(function() {
    
    // Initialize banner slider
    if ($('#bannerSlides').length > 0) {
        $('#bannerSlides').owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            autoplayTimeout: 5000,
            nav: true,
            dots: true,
            responsive: {
                0: { items: 1 },
                768: { items: 1 },
                1024: { items: 1 }
            }
        });
    }

    // Initialize new arrivals slider
    if ($('#newarrivalsSlides').length > 0) {
        $('#newarrivalsSlides').owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            autoplayTimeout: 4000,
            nav: true,
            dots: false,
            responsive: {
                0: { items: 1 },
                768: { items: 1 },
                1024: { items: 1 }
            }
        });
    }

    // Mobile menu toggle
    $('.toggle-panel').on('click', function(e) {
        e.preventDefault();
        $('.mobToggle').slideToggle();
    });

    // Dropdown hover functionality
    $('.dropdown').hover(function() {
        $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
    }, function() {
        $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
    });

    // Initialize FancyBox for lightbox functionality
    if ($.fn.fancybox) {
        $('[data-fancybox]').fancybox({
            buttons: ['zoom', 'close'],
            animationEffect: 'zoom-in-out',
            transitionEffect: 'slide'
        });
    }

    // Smooth scroll for internal links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = $(this.hash);
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800);
        }
    });

    // Add loading animation for images
    $('img').on('load', function() {
        $(this).addClass('loaded');
    });

    // Handle form submissions (if any)
    $('form').on('submit', function(e) {
        var form = $(this);
        var submitBtn = form.find('button[type="submit"]');
        
        // Add loading state
        submitBtn.prop('disabled', true).text('Processing...');
        
        // You can add AJAX form submission logic here
        // For now, just restore button after 2 seconds
        setTimeout(function() {
            submitBtn.prop('disabled', false).text('Submit');
        }, 2000);
    });

    // Lazy loading for images (if needed)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

});