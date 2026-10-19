// ============================================
// BILTECH – Startseite
// ============================================

const WHATSAPP_NUMBER = '4961579523994';

// WhatsApp links: prefilled message, optionally per service
document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    const topic = link.dataset.topic;
    const text = topic
        ? `Hallo Biltech, ich interessiere mich für ${topic}. Fotos schicke ich gleich mit.`
        : 'Hallo Biltech, ich habe eine Anfrage. Fotos schicke ich gleich mit.';
    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
});

// Header: solid background once the hero is scrolled past the top
(function header() {
    const header = document.getElementById('siteHeader');
    const toggle = document.getElementById('menuToggle');
    if (!header) return;

    const update = () => header.classList.toggle('is-solid', window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });

    function setOpen(open) {
        header.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    }

    // Current section in the navigation
    const navLinks = [...header.querySelectorAll('.primary-nav ul a')];
    const sections = navLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const spy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((a) => {
                const on = a.getAttribute('href') === '#' + entry.target.id;
                a.classList.toggle('is-current', on);
                if (on) a.setAttribute('aria-current', 'true');
                else a.removeAttribute('aria-current');
            });
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));

    toggle.addEventListener('click', () => setOpen(!header.classList.contains('is-open')));
    header.querySelectorAll('.primary-nav a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && header.classList.contains('is-open')) setOpen(false);
    });
})();

// Service register: one active row, its photo in the sticky frame (desktop)
// or inline inside the row (mobile)
(function register() {
    const rows = document.querySelectorAll('.register-row');
    const image = document.getElementById('registerImage');
    if (!rows.length || !image) return;

    rows.forEach((row) => {
        const detail = row.querySelector('.register-detail');
        const inner = document.createElement('div');
        inner.className = 'register-detail-inner';
        const figure = document.createElement('figure');
        figure.className = 'photo photo-portrait';
        figure.innerHTML = `<img src="${row.dataset.image}" alt="${row.dataset.alt}" loading="lazy" style="object-position: ${row.dataset.position}"><figcaption class="ai-note">KI-Motiv</figcaption>`;
        inner.appendChild(figure);
        while (detail.firstChild) inner.appendChild(detail.firstChild);
        detail.appendChild(inner);
    });

    function activate(row) {
        rows.forEach((r) => {
            const on = r === row;
            r.classList.toggle('is-active', on);
            r.querySelector('.register-trigger').setAttribute('aria-expanded', String(on));
        });
        if (image.getAttribute('src') === row.dataset.image) return;
        image.classList.add('is-swapping');
        image.src = row.dataset.image;
        image.alt = row.dataset.alt;
        image.style.objectPosition = row.dataset.position;
        const reveal = () => requestAnimationFrame(() => image.classList.remove('is-swapping'));
        if (image.complete) reveal();
        else image.addEventListener('load', reveal, { once: true });
    }

    rows.forEach((row) => {
        const trigger = row.querySelector('.register-trigger');
        trigger.addEventListener('click', () => activate(row));
        // Desktop: hovering previews the row, like flipping through a spec sheet
        trigger.addEventListener('mouseenter', () => {
            if (window.matchMedia('(hover: hover) and (min-width: 901px)').matches) activate(row);
        });
    });
})();

// Contact form: compose a mailto with a readable body
(function contactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const error = document.getElementById('formError');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fields = [...form.querySelectorAll('[required]')];
        let valid = true;
        fields.forEach((f) => {
            const ok = f.value.trim() !== '';
            f.setAttribute('aria-invalid', String(!ok));
            if (!ok) valid = false;
        });
        error.hidden = valid;
        if (!valid) {
            fields.find((f) => f.getAttribute('aria-invalid') === 'true').focus();
            return;
        }
        const data = new FormData(form);
        const subject = `Anfrage: ${data.get('Leistung')}`;
        const body = [
            `Leistung: ${data.get('Leistung')}`,
            `Name: ${data.get('Name')}`,
            `Telefon: ${data.get('Telefon')}`,
            '',
            data.get('Nachricht'),
        ].join('\n');
        window.location.href = `mailto:info@biltech-service.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });

    form.querySelectorAll('[required]').forEach((f) => {
        f.addEventListener('input', () => {
            if (f.value.trim() !== '') f.setAttribute('aria-invalid', 'false');
        });
    });
})();

// Hero background videos: random rotation with crossfade
(function heroVideoRotation() {
    const media = document.getElementById('heroMedia');
    if (!media) return;

    const base = 'assets/video/hero/';
    const clips = {
        desktop: ['luisenplatz-16x9', 'mathildenhoehe-16x9', 'kunde-16x9', 'umzug-16x9'],
        mobile: ['luisenplatz-9x16', 'mathildenhoehe-9x16', 'kunde-9x16', 'umzug-9x16']
    };
    const FADE = 1.2; // seconds, matches CSS transition
    const portrait = window.matchMedia('(orientation: portrait) and (max-width: 1024px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const videos = media.querySelectorAll('.hero-video');
    let active = 0;
    let bag = [];
    let recent = [];
    let switching = false;

    const list = () => (portrait.matches ? clips.mobile : clips.desktop);

    // Shuffle bag: every clip once per round; the clips shown last
    // are moved to the end of the new round so nothing repeats too soon
    function nextClip() {
        if (!bag.length) {
            const pool = list().slice();
            for (let i = pool.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pool[i], pool[j]] = [pool[j], pool[i]];
            }
            const avoid = recent.slice(-Math.min(2, pool.length - 1));
            // pop() takes from the end, so avoided clips go to the front
            bag = pool.filter((c) => avoid.includes(c)).concat(pool.filter((c) => !avoid.includes(c)));
        }
        const clip = bag.pop();
        recent.push(clip);
        recent = recent.slice(-2);
        return clip;
    }

    function load(video, name) {
        video.poster = base + name + '.jpg';
        video.src = base + name + '.mp4';
        video.load();
    }

    // The inactive video always holds the next clip, already buffering
    function preload() {
        load(videos[1 - active], nextClip());
    }

    function playNext() {
        const current = videos[active];
        const next = videos[1 - active];
        switching = true;
        next.currentTime = 0;
        next.play().then(() => {
            next.classList.add('is-active');
            current.classList.remove('is-active');
            active = 1 - active;
            setTimeout(() => {
                current.pause();
                switching = false;
                preload();
            }, FADE * 1000);
        }).catch(() => {
            switching = false;
            preload();
        });
    }

    // Reduced motion: still poster only, no playback
    if (reducedMotion.matches) {
        const first = videos[0];
        first.poster = base + nextClip() + '.jpg';
        first.classList.add('is-active');
        return;
    }

    videos.forEach((video) => {
        video.addEventListener('timeupdate', () => {
            if (video !== videos[active] || switching || !video.duration) return;
            if (video.duration - video.currentTime <= FADE) playNext();
        });
        video.addEventListener('ended', () => {
            if (video === videos[active] && !switching) playNext();
        });
        video.addEventListener('error', () => {
            if (video === videos[active] && !switching) playNext();
        });
    });

    // Orientation change: start a new round from the matching list
    portrait.addEventListener('change', () => {
        bag = [];
        preload();
        playNext();
    });

    // Save CPU when the hero is off-screen
    new IntersectionObserver(([entry]) => {
        const video = videos[active];
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
    }).observe(media);

    const first = videos[0];
    load(first, nextClip());
    first.classList.add('is-active');
    first.play().catch(() => {});
    preload();
})();
