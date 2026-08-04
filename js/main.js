// GSAP Plugin'lerini kaydet
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// =============================================
// 1) FRAME PRELOAD SİSTEMİ
// =============================================

const FRAME_COUNT = 240;
const FRAME_PATH = "assets/frames/frame_set_1/";
const frames = [];        // Yüklenen Image nesneleri
let loadedCount = 0;      // Kaç tanesi yüklendi
const seq = { frame: 0 }; // GSAP tarafından güncellenen aktif kare indeksi

// DOM Referansları
const loadingScreen = document.getElementById("loading-screen");
const loadingPercent = document.getElementById("loading-percent");
const loadingBarFill = document.getElementById("loading-bar-fill");
const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");

/**
 * Tüm frame'leri önceden yükler (preload).
 * Her onload'da ilerleme güncellenir; tümü bittiğinde onAllLoaded çağrılır.
 */
function preloadFrames() {
    for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();

        // Dosya adını dinamik oluştur: 001, 002 ... 240
        const num = String(i).padStart(3, "0");
        img.src = `${FRAME_PATH}ezgif-frame-${num}.jpg`;

        img.onload = () => {
            loadedCount++;
            updateLoadingUI();

            if (loadedCount === FRAME_COUNT) {
                onAllLoaded();
            }
        };

        img.onerror = () => {
            // Hatalı kare yüklemelerini de say ki loading asla %100'de takılmasın
            console.warn(`Frame yüklenemedi: ${img.src}`);
            loadedCount++;
            updateLoadingUI();

            if (loadedCount === FRAME_COUNT) {
                onAllLoaded();
            }
        };

        frames.push(img);
    }
}

/**
 * Loading ekranındaki yüzdeyi ve progress bar'ı güncelle.
 */
function updateLoadingUI() {
    const pct = Math.round((loadedCount / FRAME_COUNT) * 100);
    loadingPercent.textContent = `${pct}%`;
    loadingBarFill.style.width = `${pct}%`;
}

/**
 * Tüm kareler yüklendiğinde çalışır.
 */
function onAllLoaded() {
    // Canvas boyutunu ayarla ve ilk kareyi çiz
    resizeCanvas();
    drawCoverFrame(frames[0]);

    // Loading ekranını fade-out ile gizle
    loadingScreen.classList.add("hidden");

    // Fade-out bittikten sonra DOM'dan tamamen kaldır
    loadingScreen.addEventListener("transitionend", () => {
        loadingScreen.style.display = "none";
    }, { once: true });

    // ---- BÖLÜM 0: Navbar ----
    initNavbar();

    // ---- BÖLÜM 1: Giriş Metinleri Animasyonu (Timeline) ----
    const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    introTl
        .from(".intro-text .hud-text", {
            y: 30,
            opacity: 0,
            duration: 1,
        })
        .from(".intro-text .main-title", {
            y: 100,
            opacity: 0,
            duration: 1.5,
        }, "-=0.7")   // Önceki animasyonla 0.7s örtüşür
        .from(".intro-text .sub-title", {
            y: 50,
            opacity: 0,
            duration: 1.2,
        }, "-=0.9")   // Önceki animasyonla 0.9s örtüşür
        .from(".hero-socials .social-btn", {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1
        }, "-=0.8");  // Alt başlık belirmeye başladıktan hemen sonra ikonlar gelsin

    // ---- BÖLÜM 2: Canvas Frame Sequence (ScrollTrigger) ----
    initScrollSequence();

    // ---- BÖLÜM 3: Hakkımda & Yetenek Ağacı ----
    populateAboutSection();
    initAboutAnimations();

    // ---- BÖLÜM 4: Deneyim ----
    populateExperienceSection();
    initExperienceAnimations();

    // ---- BÖLÜM 5: Projeler ----
    populateProjects();
    initProjectsAnimations();

    // ---- BÖLÜM 6: İletişim ----
    if (typeof emailjs !== 'undefined') {
        emailjs.init("hqYpIApKsCeCElcir"); // public key 
    }
    initContactForm();
    initContactAnimations();
}


// =============================================
// 2) CANVAS COVER ÇİZİM SİSTEMİ
// =============================================

/**
 * Canvas'ın piksel boyutlarını tarayıcı boyutuna eşitler.
 */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

/**
 * Verilen görseli Canvas'a "object-fit: cover" mantığıyla çizer.
 * Math.max formülü ile hem genişlik hem yükseklik dolacak şekilde ölçekler,
 * taşan kısımları ortalar.
 *
 * @param {HTMLImageElement} img - Çizilecek görsel
 */
function drawCoverFrame(img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Cover scale: Canvas'ı tamamen kaplaması için en büyük ölçek
    const scale = Math.max(cw / iw, ch / ih);

    const drawW = iw * scale;
    const drawH = ih * scale;

    // Ortalama: taşan kısmı ortala
    const offsetX = (cw - drawW) / 2;
    const offsetY = (ch - drawH) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
}

/**
 * Aktif kareyi (seq.frame) Canvas'a çizer.
 */
function renderFrame() {
    drawCoverFrame(frames[seq.frame]);
}


// =============================================
// 3) SCROLLTRIGGER FRAME SEQUENCE (GSAP Native)
// =============================================

/**
 * GSAP native scrub ile Canvas frame sequence animasyonu.
 *
 * - end: "+=10000" → Kaydırma alanı uzun olduğu için tekerleğin her hareketi
 *   daha az kare ilerletir. Bu doğal bir hız sınırıdır.
 * - ease: "power1.inOut" → Başlangıç ve bitişte eksponansiyel yumuşatma.
 * - scrub: 1.2 → Tekerlek dursa bile 1.2 saniye daha süzülerek yavaşlar (momentum).
 * - anticipatePin: 1 → Pin geçişlerinde sayfa sıçramalarını önler.
 */
function initScrollSequence() {
    gsap.to(seq, {
        frame: FRAME_COUNT - 1,      // 0 → 239
        snap: "frame",               // Tam sayı karelere yuvarla
        ease: "power1.inOut",        // İvmelenme + yavaşlama eğrisi
        onUpdate: renderFrame,       // Her kare değişiminde Canvas'a çiz
        scrollTrigger: {
            trigger: "#canvas-section",
            start: "top top",        // Bölüm üstü = Viewport üstü
            end: "+=2000",          // 10000px scroll mesafesi (doğal hız sınırı)
            scrub: 0.8,              // Süzülme: 1.2s momentum gecikmesi
            pin: true,               // Sekans oynarken bölümü sabitle
            anticipatePin: 1,        // Pin sıçramalarını önle
        }
    });
}


// =============================================
// 4) HAKKIMDA BÖLÜMÜ (DOM + Animasyon)
// =============================================

/**
 * portfolioData objesindeki verileri HTML'e basar.
 * - Biyografi metnini '.about-bio' içine yazar.
 * - Yetenek dizisini forEach ile döner, her biri için skill-card oluşturup '.tech-stack'e ekler.
 */
function populateAboutSection() {
    // Biyografi metnini bas
    const bioEl = document.querySelector(".about-bio");
    if (bioEl && portfolioData.about) {
        bioEl.textContent = portfolioData.about;
    }

    // Yetenek kartlarını oluştur
    const techStackEl = document.querySelector(".tech-stack");
    if (techStackEl && portfolioData.skills) {
        portfolioData.skills.forEach((skill) => {
            const card = document.createElement("div");
            card.className = "skill-card";
            card.textContent = skill;
            techStackEl.appendChild(card);
        });
    }
}

/**
 * Hakkımda bölümü için GSAP ScrollTrigger animasyonları.
 * - .about-text: Aşağıdan yukarıya fade-in
 * - .skill-card: Stagger ile sırayla görünür olur
 */
function initAboutAnimations() {
    // Biyografi metni animasyonu
    gsap.from(".about-text", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: "#about-section",
            start: "top 80%",
            toggleActions: "restart none none reset"
        }
    });

    // Yetenek kartları stagger animasyonu
    gsap.from(".skill-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
            trigger: ".tech-stack",
            start: "top 85%",
            toggleActions: "restart none none reset"
        }
    });
}

// =============================================
// 5) DENEYİM BÖLÜMÜ (DOM + Animasyon)
// =============================================

function populateExperienceSection() {
    const expListEl = document.getElementById("experiences-list");
    console.log("Experience List Element:", expListEl);
    console.log("Experiences Data:", portfolioData.experiences);

    if (expListEl && portfolioData.experiences && portfolioData.experiences.length > 0) {
        let contentHTML = "";
        portfolioData.experiences.forEach((exp) => {
            contentHTML += `
                <div class="exp-item">
                    <div class="exp-date">${exp.date}</div>
                    <div class="exp-role">${exp.role}</div>
                    <div class="exp-company">${exp.company}</div>
                    <p class="exp-desc">${exp.desc}</p>
                </div>
            `;
        });
        expListEl.innerHTML = contentHTML;
    } else {
        if (expListEl) expListEl.innerHTML = "<p style='color:red;'>Deneyim verisi bulunamadı! (Lütfen tarayıcı önbelleğini temizleyin, CTRL+F5 yapın)</p>";
    }
}

function initExperienceAnimations() {
    gsap.fromTo(".exp-item",
        { x: -50, opacity: 0 },
        {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.2,
            scrollTrigger: {
                trigger: "#experience-section",
                start: "top 85%",
                toggleActions: "restart none none reset"
            }
        }
    );
}


// =============================================
// 6) PROJELER BÖLÜMÜ (DOM + Animasyon)
// =============================================

/**
 * portfolioData.projects dizisini döner, her proje için
 * template literal ile kart HTML'i oluşturup '#projects-grid' içine ekler.
 */
function populateProjects() {
    const gridEl = document.getElementById("projects-grid");
    if (!gridEl || !portfolioData.projects) return;

    portfolioData.projects.forEach((project) => {
        // Kart HTML'i
        const imageSrc = project.image || `https://placehold.co/600x400/0a0a0a/06b6d4?text=${encodeURIComponent(project.title)}`;
        
        const cardHTML = `
            <div class="project-card">
                <span class="card-category">${project.category}</span>
                <h3 class="card-title">${project.title}</h3>
                <div class="card-image-wrapper">
                    <img src="${imageSrc}" alt="${project.title}" class="project-image" loading="lazy">
                </div>
                <p class="card-desc">${project.description}</p>
                <div class="project-footer">
                    <div class="tech-list">
                        ${project.tech.map(techName => `<span class="tech-badge">${techName}</span>`).join('')}
                    </div>
                    ${project.link ? `<a href="${project.link}" target="_blank" class="project-action-btn" title="Projeye Git">${project.linkText || '[ /> ]'}</a>` : ''}
                </div>
            </div>
        `;

        gridEl.insertAdjacentHTML("beforeend", cardHTML);
    });
}

/**
 * Projeler bölümü için GSAP ScrollTrigger animasyonu.
 * Kartlar aşağıdan yukarıya stagger ile sırayla görünür olur.
 */
function initProjectsAnimations() {
    gsap.from(".project-card", {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
            trigger: "#projects-section",
            start: "top 80%",
            toggleActions: "restart none none reset"
        }
    });
}

// =============================================
// 7) İLETİŞİM BÖLÜMÜ (DOM + Animasyon + EmailJS)
// =============================================

function initContactForm() {
    const contactForm = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-btn");
    const statusDiv = document.getElementById("form-status");

    if (!contactForm) return;

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Loading durumu
        submitBtn.textContent = "GÖNDERİLİYOR...";
        submitBtn.disabled = true;
        statusDiv.style.display = "none";

        if (typeof emailjs === 'undefined') {
            statusDiv.style.display = "block";
            statusDiv.style.color = "#ef4444";
            statusDiv.textContent = "EmailJS yüklenemedi. Lütfen sayfayı yenileyin.";
            submitBtn.textContent = "GÖNDER";
            submitBtn.disabled = false;
            return;
        }

        // EmailJS gönderimi
        emailjs.sendForm("service_xuci75p", "template_2vug2hi", "#contact-form")
            .then(function () {
                statusDiv.style.display = "block";
                statusDiv.style.color = "#06b6d4";
                statusDiv.textContent = "Mesaj başarıyla iletildi.";
                contactForm.reset();
                submitBtn.textContent = "GÖNDER";
                submitBtn.disabled = false;
            })
            .catch(function (error) {
                statusDiv.style.display = "block";
                statusDiv.style.color = "#ef4444"; // Kırmızı
                statusDiv.textContent = "Bir hata oluştu. Lütfen tekrar deneyin.";
                submitBtn.textContent = "GÖNDER";
                submitBtn.disabled = false;
                console.error("EmailJS Error:", error);
            });
    });
}

function initContactAnimations() {
    gsap.from("#contact-form, #contact-section .section-title", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
            trigger: "#contact-section",
            start: "top 80%",
            toggleActions: "restart none none reset"
        }
    });
}

// =============================================
// 8) OLAYLAR (EVENTS)
// =============================================

// Tarayıcı boyut değiştiğinde Canvas'ı yeniden boyutla + aktif kareyi yeniden çiz
window.addEventListener("resize", () => {
    resizeCanvas();
    if (frames.length > 0 && frames[seq.frame] && frames[seq.frame].complete) {
        renderFrame();
    }
});


// =============================================
// BAŞLAT
// =============================================
// 9) NAVBAR (KAYDIRMA ETKİLEŞİMİ)
// =============================================
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    // Y ekseni kaydırma durumuna göre blur sınıfı ekle
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Navigasyon linklerine tıklandığında GSAP ile kaydır
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href'); // Örn: "#about-section"
            const targetElement = document.querySelector(targetId);

            if (!targetElement) return;

            // Mevcut scroll pozisyonu ile hedefin pozisyonunu karşılaştır
            const currentY = window.scrollY;
            // GSAP, ScrollTrigger pinlerini hesaba katarak hedefin gerçek Y pozisyonunu bulur
            const targetY = targetElement.getBoundingClientRect().top + window.scrollY;

            // Hedef aşağıdaysa (İleri sarma)
            if (targetY > currentY) {
                // Mesafeye orantılı bir süre hesapla (Lineer hız)
                // Her 1500 piksel (mesafe) için 1 saniye sürsün. Uzak bölümlere giderken süre uzar.
                const distance = targetY - currentY;
                const dynamicDuration = Math.max(distance / 1500, 2);

                gsap.to(window, {
                    scrollTo: targetId,
                    duration: dynamicDuration,
                    ease: "none" // IVMELENME İPTAL: Ortada bir anda hızlanma patlamasını engeller
                });
            }
            // Hedef yukarıdaysa (Anında atlama)
            else {
                gsap.to(window, {
                    scrollTo: targetId,
                    duration: 0 // Süre 0 olduğu için frameleri okumadan anında hedef bölüme sıçrar
                });
            }
        });
    });
}
preloadFrames();

// =============================================
// 10) LIGHTBOX (MODAL) SİSTEMİ
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const closeBtn = document.querySelector('.close-modal');

    // Dinamik oluşturulan proje kartlarındaki IMG tıklamalarını yakala
    document.body.addEventListener('click', function(e) {
        if (e.target.tagName === 'IMG' && e.target.closest('.project-card')) {
            modal.classList.add('active');
            modalImg.src = e.target.src;
            
            // GSAP ile Modal arkaplanı ve resim açılış animasyonu
            gsap.to(modal, { opacity: 1, duration: 0.3 });
            gsap.fromTo(modalImg, 
                { scale: 0.8, opacity: 0 }, 
                { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }
            );
        }
    });

    // Kapatma Fonksiyonu
    const closeModal = () => {
        gsap.to(modal, { 
            opacity: 0, 
            duration: 0.3, 
            onComplete: () => {
                modal.classList.remove('active');
                modalImg.src = ""; // Sonraki açılışta eski resmi görmemek için temizle
            } 
        });
    };

    // Kapat tuşuna veya resim dışındaki karanlık alana tıklayınca kapat
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
});

// =============================================
// 11) SARKAN GÖREVLİ KARTI MEKANİĞİ
// =============================================
const area = document.querySelector('.badge-interaction-area');
const card = document.getElementById('id-card');
const path = document.getElementById('lanyard-path');

if(area && card && path) {
    let rect = area.getBoundingClientRect();
    let isDragging = false;

    // Kartın fiziksel pozisyon ve hız değişkenleri
    let cardX = rect.width / 2;
    let cardY = 150; // Kordonun varsayılan uzunluğu
    let vx = 0, vy = 0;

    // Fare ile kartın tutulduğu nokta arasındaki fark
    let offsetX = 0, offsetY = 0;
    const cardWidth = 260; // CSS'teki ile aynı

    // 1. KARTA TIKLAMA / TUTMA
    card.addEventListener('pointerdown', (e) => {
        isDragging = true;
        let cardRect = card.getBoundingClientRect();
        offsetX = e.clientX - cardRect.left;
        offsetY = e.clientY - cardRect.top;
    });

    // 2. KARTI SÜRÜKLEME
    window.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        rect = area.getBoundingClientRect();
        
        // Farenin container içindeki konumuna göre kartın YENİ X ve Y'sini belirle
        cardX = (e.clientX - rect.left) - offsetX + (cardWidth / 2);
        cardY = (e.clientY - rect.top) - offsetY;
    });

    // 3. KARTI BIRAKMA
    window.addEventListener('pointerup', () => {
        isDragging = false;
    });
    
    window.addEventListener('resize', () => { rect = area.getBoundingClientRect(); });

    // FİZİK MOTORU VE ÇİZİM DÖNGÜSÜ
    function renderPhysics() {
        if (!isDragging) {
            // ZAMAN VE SİNÜS DALGASI: Doğal bir rüzgar/sallanma efekti üretir
            let time = Date.now() / 1500; // 1500 değeri sallanma hızını belirler (Yükseldikçe yavaşlar)
            let sway = Math.sin(time) * 20; // 20px sağa/sola genlik

            // Bırakıldığında geri dönmek istediği hedef (Rest Position) + Rüzgar
            let targetX = (rect.width / 2) + sway;
            let targetY = 150; // Önceden ayarladığımız yükseklik

            // Yaylanma matematiği (Mesafe x Sertlik)
            let dx = targetX - cardX;
            let dy = targetY - cardY;

            vx += dx * 0.03; // Yay sertliği
            vy += dy * 0.03;
            vy += 0.9;       // Yerçekimi ivmesi

            vx *= 0.88; // Hava/Sürtünme sönümlemesi
            vy *= 0.88;

            cardX += vx;
            cardY += vy;
        } else {
            // Sürüklenirken hızı sıfırla ki bırakıldığında fırlamasın
            vx = 0; vy = 0;
        }

        // Kartı DOM'da konumlandır ve hıza bağlı olarak hafifçe döndür
        let rotation = isDragging ? 0 : (vx * 1.2);
        card.style.transform = `translate(${cardX - (cardWidth / 2)}px, ${cardY}px) rotate(${rotation}deg)`;

        // SVG KORDONUNU (BEZIER) ÇİZİMİ
        // İpin üst bağlantı noktası
        let anchorX = rect.width / 2;
        let anchorY = -250;
        
        // Bükülme noktası (Control Point)
        let cpX = (anchorX + cardX) / 2;
        let cpY = (anchorY + cardY) / 2;

        if (!isDragging) {
            // Serbest sallanırken kordon hareket yönünün tersine esner/bükülür
            cpX -= vx * 3;
            cpY -= vy * 3;
        } else {
            // Sürüklerken gerginlik hissi için bükülmeyi azalt
            cpX -= (cardX - anchorX) * 0.2;
        }

        // SVG Path komutunu güncelle
        path.setAttribute('d', `M ${anchorX} ${anchorY} Q ${cpX} ${cpY} ${cardX} ${cardY}`);

        requestAnimationFrame(renderPhysics);
    }

    renderPhysics(); // Motoru ateşle
}
