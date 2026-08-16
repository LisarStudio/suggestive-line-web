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

    // 7. Multi-Track Audio Player (4 tracks, 1:30 limit, streaming glow)
    const TRACK_COUNT = 4;
    const MAX_PREVIEW = 90; // 1:30 in seconds
    const trackAudios = [];
    const trackPlayBtns = [];
    const trackPlayers = [];
    const trackProgresses = [];
    const trackTimes = [];
    const trackWaveforms = [];
    
    for (let i = 0; i < TRACK_COUNT; i++) {
        trackAudios[i] = document.getElementById(`track-audio-${i}`);
        trackPlayBtns[i] = document.querySelector(`.track-play-btn[data-track-index="${i}"]`);
        trackPlayers[i] = document.querySelector(`.track-player[data-track-index="${i}"]`);
        trackProgresses[i] = document.querySelector(`.track-progress[data-track-index="${i}"]`);
        trackTimes[i] = document.querySelector(`.track-time[data-track-index="${i}"]`);
        trackWaveforms[i] = document.querySelector(`.track-waveform[data-track-index="${i}"]`);
    }
    
    const streamingGrid = document.getElementById("streaming-buttons");
    const lyricsSection = document.getElementById("lyrics");
    const lyricLinesAudio = document.querySelectorAll(".lyric-line");
    const ctaPlayBtn = document.getElementById("hero-play-btn");
    const heroLogoMouseMove = document.getElementById("hero-logo-mouse-move");
    const heroSectionEl = document.getElementById("home");
    
    let currentTrack = -1; // no track playing

    // Mouse parallax on hero logo
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

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    // Stop all tracks and reset UI
    const stopAllTracks = () => {
        for (let i = 0; i < TRACK_COUNT; i++) {
            if (trackAudios[i] && !trackAudios[i].paused) {
                trackAudios[i].pause();
            }
            if (trackPlayBtns[i]) {
                trackPlayBtns[i].innerHTML = '<i class="fas fa-play"></i>';
                trackPlayBtns[i].classList.remove("playing");
            }
            if (trackPlayers[i]) {
                trackPlayers[i].classList.remove("track-active");
            }
        }
        // Update hero button
        if (ctaPlayBtn) {
            ctaPlayBtn.innerHTML = 'LISTEN NOW <i class="fas fa-play ml-2"></i>';
            ctaPlayBtn.classList.remove("playing");
        }
        // Reset lyrics
        if (lyricsSection) lyricsSection.classList.remove("playing-mode");
        lyricLinesAudio.forEach(l => l.classList.remove("active-sync"));
        currentTrack = -1;
    };

    // Activate streaming glow
    const activateStreamingGlow = () => {
        if (streamingGrid) {
            streamingGrid.classList.add("glow-active");
            // Auto-remove glow after 15 seconds
            setTimeout(() => {
                streamingGrid.classList.remove("glow-active");
            }, 15000);
        }
    };

    // Play a specific track
    const playTrack = (index) => {
        if (!trackAudios[index]) return;
        
        // If clicking the same track that's playing, pause it
        if (currentTrack === index && !trackAudios[index].paused) {
            trackAudios[index].pause();
            trackPlayBtns[index].innerHTML = '<i class="fas fa-play"></i>';
            trackPlayBtns[index].classList.remove("playing");
            trackPlayers[index].classList.remove("track-active");
            if (ctaPlayBtn && index === 2) {
                ctaPlayBtn.innerHTML = 'LISTEN NOW <i class="fas fa-play ml-2"></i>';
                ctaPlayBtn.classList.remove("playing");
            }
            if (lyricsSection && index === 2) lyricsSection.classList.remove("playing-mode");
            currentTrack = -1;
            return;
        }
        
        // Stop any other track
        stopAllTracks();
        
        // Play the new track
        currentTrack = index;
        const playPromise = trackAudios[index].play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                trackPlayBtns[index].innerHTML = '<i class="fas fa-pause"></i>';
                trackPlayBtns[index].classList.add("playing");
                trackPlayers[index].classList.add("track-active");
                // If it's track 3 (Hold Me Close), sync with hero button & lyrics
                if (index === 2) {
                    if (ctaPlayBtn) {
                        ctaPlayBtn.innerHTML = 'PAUSE <i class="fas fa-pause ml-2"></i>';
                        ctaPlayBtn.classList.add("playing");
                    }
                    if (lyricsSection) lyricsSection.classList.add("playing-mode");
                }
            }).catch(err => {
                console.error("Playback error:", err);
            });
        }
    };

    // Bind play buttons for each track
    for (let i = 0; i < TRACK_COUNT; i++) {
        if (trackPlayBtns[i]) {
            trackPlayBtns[i].addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                playTrack(i);
            });
        }
        
        // Waveform scrubbing
        if (trackWaveforms[i]) {
            trackWaveforms[i].addEventListener("click", (e) => {
                if (!trackAudios[i]) return;
                const rect = trackWaveforms[i].getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                trackAudios[i].currentTime = pct * MAX_PREVIEW;
                if (trackAudios[i].paused) {
                    playTrack(i);
                }
            });
        }
        
        // Timeupdate for each track
        if (trackAudios[i]) {
            trackAudios[i].addEventListener("timeupdate", () => {
                let current = trackAudios[i].currentTime;
                
                // Enforce 1:30 preview limit
                if (current >= MAX_PREVIEW) {
                    trackAudios[i].pause();
                    trackAudios[i].currentTime = 0;
                    stopAllTracks();
                    // Trigger streaming glow!
                    activateStreamingGlow();
                    return;
                }
                
                const pct = (current / MAX_PREVIEW) * 100;
                if (trackProgresses[i]) trackProgresses[i].style.width = `${pct}%`;
                if (trackTimes[i]) trackTimes[i].textContent = `${formatTime(current)} / ${formatTime(MAX_PREVIEW)}`;
                
                // Lyrics sync only for track 3 (index 2)
                if (i === 2 && !trackAudios[i].paused) {
                    let activeLine = null;
                    lyricLinesAudio.forEach(line => {
                        const t = parseFloat(line.getAttribute("data-time"));
                        if (current >= t) activeLine = line;
                    });
                    lyricLinesAudio.forEach(line => {
                        line.classList.toggle("active-sync", line === activeLine);
                    });
                }
            });
        }
    }

    // Hero LISTEN NOW button plays/pauses track 3 (Hold Me Close)
    if (ctaPlayBtn) {
        ctaPlayBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            playTrack(2); // Track 3 = index 2
        });
    }

    // 8. Video Modal Overlay for Visuals Section
    const videoCards = document.querySelectorAll(".video-card");
    const videoModal = document.querySelector(".sl-video-modal");
    const videoClose = document.querySelector(".sl-video-modal-close");
    const iframe = document.querySelector(".sl-video-modal-iframe");

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
                stopAllTracks();
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
