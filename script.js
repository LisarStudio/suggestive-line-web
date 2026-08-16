/**
 * SUGGESTIVE LINE - WEB INTERACTIONS
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Menu Toggle
    const menuToggle = document.querySelector(".sl-menu-toggle");
    const navLinksContainer = document.querySelector(".sl-nav-links");
    
    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener("click", () => {
            navLinksContainer.classList.toggle("active");
            // Toggle hamburger icon if needed
            const icon = menuToggle.querySelector("i");
            if (icon) {
                icon.classList.toggle("fa-bars");
                icon.classList.toggle("fa-times");
            }
        });
    }

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll(".sl-nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navLinksContainer.classList.contains("active")) {
                navLinksContainer.classList.remove("active");
                const icon = menuToggle.querySelector("i");
                if (icon) {
                    icon.classList.add("fa-bars");
                    icon.classList.remove("fa-times");
                }
            }
        });
    });

    // 2. Navbar Scrolled State
    const navbar = document.querySelector(".sl-navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 3. Scrollspy Navigation Highlights
    const sections = document.querySelectorAll("section");
    window.addEventListener("scroll", () => {
        let currentSectionId = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    });

    // 4. Parallax Scrolling on Hero
    const heroSection = document.getElementById("home");
    const heroCharacter = document.querySelector(".hero-character-container");
    const lightBeam = document.querySelector(".light-beam");
    const heroLogoBox = document.getElementById("hero-logo-parallax-box");

    if (heroSection) {
        window.addEventListener("scroll", () => {
            const scrollPos = window.scrollY;
            
            // Character floats down slightly slower than scroll
            if (heroCharacter) {
                const speedChar = 0.08;
                heroCharacter.style.transform = `translate(-50%, calc(-50% + ${scrollPos * speedChar}px))`;
            }
            
            // Light beam drifts slightly in opposite direction
            if (lightBeam) {
                const speedBeam = -0.05;
                lightBeam.style.transform = `translateX(calc(-50% + ${scrollPos * speedBeam}px))`;
            }
            
            // Logo container floats down/up slightly
            if (heroLogoBox) {
                const speedLogo = 0.12;
                heroLogoBox.style.transform = `translate(-50%, calc(-50% + ${scrollPos * speedLogo}px))`;
            }
        });
    }

    // 5. Scroll Reveals for Lyrics
    const lyricLines = document.querySelectorAll(".lyric-line");
    const supportingCampaign = document.querySelector(".supporting-campaign");
    const dividerStar = document.querySelector(".lyrics-divider-star");

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;

        lyricLines.forEach(line => {
            const lineTop = line.getBoundingClientRect().top;
            if (lineTop < triggerBottom) {
                line.classList.add("visible");
            } else {
                line.classList.remove("visible"); // Optional: removes to re-animate on scroll up
            }
        });

        if (supportingCampaign) {
            const top = supportingCampaign.getBoundingClientRect().top;
            if (top < triggerBottom) {
                supportingCampaign.classList.add("visible");
            }
        }
        if (dividerStar) {
            const top = dividerStar.getBoundingClientRect().top;
            if (top < triggerBottom) {
                dividerStar.classList.add("visible");
            }
        }
    };

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Initial check

    // 6. Interactive Canvas Particle Engine (Rain & Debris)
    const canvas = document.getElementById("particles-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        let animationFrameId;

        // Resize Canvas
        const resizeCanvas = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Particle Class
        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -20;
                // Rain-like vertical drift + sideways debris float
                this.size = Math.random() * 1.5 + 0.5;
                this.speedY = Math.random() * 2.5 + 1.0;
                this.speedX = Math.random() * 0.8 - 0.4;
                this.opacity = Math.random() * 0.4 + 0.15;
                this.type = Math.random() > 0.8 ? "debris" : "rain"; // rain or tiny floating ash
                if (this.type === "debris") {
                    this.size = Math.random() * 2.5 + 1.0;
                    this.speedY = Math.random() * 0.5 + 0.2;
                    this.speedX = Math.random() * 0.6 - 0.3;
                }
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;

                // Add scroll-dependent lateral drift
                this.x += window.scrollY * 0.0003 * (this.type === "debris" ? 1.5 : 0.5);

                if (this.y > canvas.height || this.x < -20 || this.x > canvas.width + 20) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.fillStyle = `rgba(157, 199, 255, ${this.opacity})`;
                if (this.type === "rain") {
                    // Rain line
                    ctx.strokeStyle = `rgba(157, 199, 255, ${this.opacity * 0.7})`;
                    ctx.lineWidth = this.size / 2;
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(this.x + this.speedX * 2, this.y + this.speedY * 4);
                    ctx.stroke();
                } else {
                    // Ash/debris square or fuzzy dot
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // Initialize Particles
        const initParticles = () => {
            particles = [];
            const count = Math.min(100, Math.floor(canvas.width / 15));
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };
        initParticles();

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        // Respect user preference for reduced motion
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!prefersReducedMotion) {
            animate();
        } else {
            // Draw a few static particles
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            initParticles();
            particles.forEach(p => p.draw());
        }
    }

    // 7. Interactive Audio Player (SoundCloud-like Sync, 30s Limit, Lyrics Sync)
    const audio = document.getElementById("main-audio");
    const maxPreviewDuration = 30;

    const ctaPlayBtn = document.getElementById("hero-play-btn");
    const musicPlayBtn = document.getElementById("sc-music-play-btn");
    const musicWaveform = document.getElementById("sc-music-waveform");
    const musicProgress = document.getElementById("sc-music-progress");
    const musicTime = document.getElementById("sc-music-time");
    
    const lyricsSection = document.getElementById("lyrics");
    const lyricLinesAudio = document.querySelectorAll(".lyric-line");
    
    const heroLogoMouseMove = document.getElementById("hero-logo-mouse-move");
    const heroSectionEl = document.getElementById("home");

    // Log audio loading errors
    if (audio) {
        audio.addEventListener("error", (e) => {
            console.error("Audio load error:", e);
        });
        
        audio.addEventListener("canplaythrough", () => {
            console.log("Audio ready to play through.");
        });
    }

    // Interactive mousemove logo parallax
    if (heroSectionEl && heroLogoMouseMove) {
        heroSectionEl.addEventListener("mousemove", (e) => {
            const rect = heroSectionEl.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const moveX = (x / (rect.width / 2)) * 18;
            const moveY = (y / (rect.height / 2)) * 12;
            heroLogoMouseMove.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        heroSectionEl.addEventListener("mouseleave", () => {
            heroLogoMouseMove.style.transform = "translate(0px, 0px)";
        });
    }

    // Sync UI play/pause states
    const updatePlayerUI = () => {
        if (!audio) return;
        const isPlaying = !audio.paused;
        
        if (ctaPlayBtn) {
            ctaPlayBtn.innerHTML = isPlaying
                ? 'PAUSE <i class="fas fa-pause ml-2"></i>'
                : 'LISTEN NOW <i class="fas fa-play ml-2"></i>';
            ctaPlayBtn.classList.toggle("playing", isPlaying);
        }
        
        if (musicPlayBtn) {
            musicPlayBtn.innerHTML = isPlaying
                ? '<i class="fas fa-pause"></i>'
                : '<i class="fas fa-play"></i>';
            musicPlayBtn.classList.toggle("playing", isPlaying);
        }
        
        if (lyricsSection) {
            lyricsSection.classList.toggle("playing-mode", isPlaying);
        }
    };

    const togglePlayback = () => {
        if (!audio) {
            console.error("No audio element found");
            return;
        }
        
        if (audio.paused) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    updatePlayerUI();
                }).catch(err => {
                    console.error("Playback error:", err);
                });
            }
        } else {
            audio.pause();
            updatePlayerUI();
        }
    };

    // Bind LISTEN NOW button (now a <button> element)
    if (ctaPlayBtn) {
        ctaPlayBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            togglePlayback();
        });
    }

    // Bind SoundCloud play button
    if (musicPlayBtn) {
        musicPlayBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            togglePlayback();
        });
    }

    // Track audio timeupdate
    audio && audio.addEventListener("timeupdate", () => {
        let current = audio.currentTime;
        
        // Enforce 30s preview limit
        if (current >= maxPreviewDuration) {
            audio.pause();
            audio.currentTime = 0;
            current = 0;
            updatePlayerUI();
        }
        
        const pct = (current / maxPreviewDuration) * 100;
        
        if (musicProgress) {
            musicProgress.style.width = `${pct}%`;
        }
        
        const formatSecs = (val) => String(Math.floor(val)).padStart(2, '0');
        if (musicTime) {
            musicTime.textContent = `00:${formatSecs(current)} / 00:${formatSecs(maxPreviewDuration)}`;
        }
        
        // Sync lyric line highlighting
        if (!audio.paused) {
            let activeLine = null;
            lyricLinesAudio.forEach(line => {
                const lineTime = parseFloat(line.getAttribute("data-time"));
                if (current >= lineTime) {
                    activeLine = line;
                }
            });
            
            lyricLinesAudio.forEach(line => {
                line.classList.toggle("active-sync", line === activeLine);
            });
        } else {
            lyricLinesAudio.forEach(line => line.classList.remove("active-sync"));
        }
    });

    // Waveform scrubbing
    if (musicWaveform) {
        musicWaveform.addEventListener("click", (e) => {
            if (!audio) return;
            const rect = musicWaveform.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const pct = clickX / rect.width;
            audio.currentTime = pct * maxPreviewDuration;
            if (audio.paused) {
                audio.play().then(updatePlayerUI);
            }
        });
    }

    // 8. Video Modal Overlay for Visuals Section
    const videoCards = document.querySelectorAll(".video-card");
    const videoModal = document.querySelector(".sl-video-modal");
    const videoClose = document.querySelector(".sl-video-modal-close");
    const iframe = document.querySelector(".sl-video-modal-iframe");

    // YouTube atmospheric links
    const youtubeVideos = [
        "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1",
        "https://www.youtube.com/embed/6m6jWfP87Zc?autoplay=1&mute=1",
        "https://www.youtube.com/embed/PjQLG2bB5gM?autoplay=1&mute=1",
        "https://www.youtube.com/embed/v9D41tB3z8A?autoplay=1&mute=1",
    ];

    videoCards.forEach((card, idx) => {
        card.addEventListener("click", () => {
            if (videoModal && iframe) {
                const vidSrc = youtubeVideos[idx] || youtubeVideos[0];
                iframe.setAttribute("src", vidSrc);
                videoModal.classList.add("active");
                // Stop audio playing during video playback
                if (!audio.paused) {
                    audio.pause();
                    updatePlayerUI();
                }
            }
        });
    });

    if (videoClose && videoModal && iframe) {
        const closeModal = () => {
            videoModal.classList.remove("active");
            iframe.setAttribute("src", "");
        };

        videoClose.addEventListener("click", closeModal);
        videoModal.addEventListener("click", (e) => {
            if (e.target === videoModal) {
                closeModal();
            }
        });
    }
});
