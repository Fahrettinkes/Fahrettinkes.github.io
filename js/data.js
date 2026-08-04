// js/data.js dosyasının tamamını bu kodla değiştir:

const portfolioData = {
    about: "İskenderun Teknik Üniversitesi Bilgisayar Mühendisliği 4. sınıf öğrencisi olarak; yapay zekâ, gömülü sistemler ve otonom robotik kesişiminde çalışıyorum. Temel vizyonum, analitik problem çözme yeteneğimi düşük seviyeli donanım mimarileriyle harmanlayarak, uç cihazlarda (edge computing) çalışan 'Gömülü Sistemler Üzerinde Yapay Zekâ' (Embedded AI) sistemleri inşa etmektir. Projelerime ek olarak, T3 Vakfı bünyesinde eğitmen-mentor olarak görev yapıyorum. Mühendislik disiplinini, gerçek dünya problemlerine ölçeklenebilir çözümler üretmek için kullanıyorum.",

    skills: [
        // 1. Satır: Temel Programlama Dilleri
        "Python", "C/C++",

        // 2. Satır: Otonom ve Donanım Mimarisi
        "ROS 2 (Jazzy)", "Raspberry Pi 5",

        // 3. Satır: Gömülü Sistemler ve Düşük Seviye
        "ESP32 / Arduino", "Assembly",

        // 4. Satır: Bilgisayarlı Görü ve Yapay Zekâ
        "OpenCV", "TensorFlow / YOLO",

        // 5. Satır: Web Teknolojileri
        "Django", "Next.js",

        // 6. Satır: Oyun Geliştirme
        "C#", "Unity 2D",

        // 7. Satır: Sistem ve Yönetim
        "FPV & Sinematik Drone Operatörlüğü", "Takım Liderliği & Proje Yönetimi"
    ],

    experiences: [
        {
            role: "Gömülü Sistemler Stajyeri",
            company: "Füzyon Akademi",
            date: "Ağustos 2026 - Eylül 2026",
            desc: "Gömülü sistemler alanında profesyonel deneyim."
        },
        {
            role: "Türkiye Teknoloji Takımı Vakfı Bursiyeri",
            company: "T3 Vakfı / DENEYAP",
            date: "2022 - Devam",
            desc: "T3 Vakfında ve DENEYAP teknoloji atölyelerinde proje danışmanlığı ve eğitmenlik."
        },
        {
            role: "Gönüllü Staj - Teknoloji Eğitmeni",
            company: "Müzeyyen Erkul Bilim Merkezi",
            date: "Nisan 2024 - Eylül 2024",
            desc: "Bilim merkezinde teknoloji farkındalığı yaratmaya yönelik atölye çalışmaları ve eğitimler."
        },
        {
            role: "Kurucu Başkan Yardımcısı",
            company: "İSTE TEKNOFEST Topluluğu",
            date: "Nisan 2025 - Ağustos 2026",
            desc: "Üniversite bünyesinde teknoloji takımlarının koordinasyonu, ekip yönetimi ve Ar-Ge proje süreçlerinin yönetilmesi."
        },
        {
            role: "Etkinlik Koordinatörü Lideri",
            company: "Huawei Student Developers (HSD) İSTE",
            date: "2024 - 2025",
            desc: "Üniversite geliştirici ekosisteminde teknik organizasyonların ve teknoloji etkinliklerinin planlanıp yönetilmesi."
        },

    ],

    projects: [
        {
            title: "UZALTAY Tuna İKA ",
            category: "Otonom Sistemler & Robotik",
            description: "NVIDIA Jetson mimarisinden Raspberry Pi 5 ve AI HAT+2 altyapısına geçiş yapılarak donanım optimizasyonu sağlanan, ROS 2 Jazzy tabanlı otonom kara aracı. 2KW motor gücüyle yüksek dayanımlı şasiye sahip araç, TEKNOFEST'26 İnsansız Kara Araçları yarışmasında Kritik Tasarım raporunda 86.25 puan elde ederek, TEKNOFEST desteğiyle final yarışmasına katılmaya hak kazanmıştır.",
            tech: ["ROS 2 Jazzy", "Python", "Raspberry Pi 5", "AI HAT+2"],
            image: "./assets/images/projects/ika.jpg",
            link: "https://youtu.be/0PQexCYkF5k",
            linkText: "[ /> DETAYLAR ]"
        },
        {
            title: "UZALTAY Savaşan İHA ",
            category: "Otonom Sistemler & Havacılık",
            description: "Havacılık ve yapay zekâ dinamiklerinin birleştirildiği otonom uçuş sistemi. 1.2m kanat açıklığına sahip insansız hava aracı platformu. Havada anlık hedef tespiti, otonom takip ve kilitlenme (lock-on) algoritmalarının entegrasyonuyla görev otonomisine odaklanılmıştır.",
            tech: ["Yapay Zeka", "Görüntü İşleme", "Otonom Uçuş"],
            image: "./assets/images/projects/savasan.png"
        },
        {
            title: "Uzaltay VTOL İHA",
            category: "Otonom Sistemler & Havacılık",
            description: "Dikey iniş-kalkış (VTOL) kabiliyetine sahip, döner kanat esnekliği ile sabit kanat aerodinamiğini tek platformda birleştiren hibrit İnsansız Hava Aracı projesi. Çoklu rotordan ileri uçuşa geçişteki karmaşık 'transition' fazı algoritmaları, otonom seyir dinamikleri ve aviyonik sistem entegrasyonları üzerine geliştirilmiştir.",
            tech: ["Otonom Uçuş", "Aviyonik Entegrasyon", "ArduPilot / PX4", "Aerodinamik Tasarım"],
            image: "./assets/images/projects/vtol.png"
        },
        {
            title: "KEMANKEŞ Hava Savunma",
            category: "Bilgisayarlı Görü",
            description: "Lazer hedefleme mekanizmalarıyla senkronize çalışan YOLOv8 tabanlı bilgisayarlı görü modülü. Hızlı hareket eden hava veya sabit kara hedeflerini 10 metre mesafeden yüksek doğrulukla tespit edip otonom nişan alma sistemini besler.",
            tech: ["YOLOv8", "OpenCV", "Raspberry Pi"],
            image: "./assets/images/projects/hss.jpg"
        },
        {
            title: "VisionGuard AI Detection System",
            category: "Bilgisayarlı Görü & Yapay Zekâ",
            description: "Gerçek zamanlı video akışları üzerinden otonom nesne tespiti ve anomali analizi yapabilen yapay zekâ tabanlı izleme sistemi. Yüksek doğruluk oranına sahip bilgisayarlı görü algoritmaları kullanılarak, alan savunması ve güvenlik metrikleri için düşük gecikmeli bir tespit mimarisi kurgulanmıştır.",
            tech: ["Python", "OpenCV", "YOLO", "Computer Vision"],
            image: "./assets/images/projects/vision.png",
            link: "https://github.com/Fahrettinkes/VisionGuard-AI_Detection_System",
            linkText: "[ /> GITHUB_REPO ]"
        },
        {
            title: "DENEYAP Yönetim Sistemi",
            category: "Web & Backend Mimarisi",
            description: "T3 Vakfı operasyonel süreçlerini dijitalleştiren, çok katmanlı yetkilendirme ve rol tabanlı hiyerarşi mimarisine sahip, güvenlik odaklı kurumsal yönetim paneli.",
            tech: ["Django", "TypeScript", "PostgreSQL"],
            image: "./assets/images/projects/dys.png"
        },
        {
            title: "Microcontroller IO Config",
            category: "Gömülü Sistemler",
            description: "Donanım seviyesinde düşük gecikmeli tepkime mimarisi: PIC16F628A mikrodenetleyicisinde, Port B pinlerinin doğrudan LED dizilimine tahsis edildiği ve Port A üzerinden bireysel/paralel sensör butonlarının Assembly ve C dilleriyle eşzamanlı kontrol edildiği özel mikrodenetleyici tasarımı.",
            tech: ["C", "Assembly", "Hardware Design"],
            image: "./assets/images/projects/pic.png"
        },
        {
            title: "Deneyap Kart Web Kontrol",
            category: "IoT & Ağ Programlama",
            description: "ESP32-S2 mimarisinde SPIFFS dosya sistemi ile lokal Access Point (AP) ayağa kaldırılarak, fiziksel donanımı yerel ağ üzerinden asenkron şekilde kontrol eden web tabanlı IoT arayüzü.",
            tech: ["C++", "ESPAsyncWebServer", "HTML/JS"],
            image: "./assets/images/projects/web kontrol.png",
            link: "https://github.com/Fahrettinkes/DeneyapKart-AP-WebControl",
            linkText: "[ /> GITHUB_REPO ]"
        },
        {
            title: "THE SOUPCEAN",
            category: "Oyun Geliştirme (Game Jam)",
            description: "HKÜ Game Jam 2022'de 1.'lik getiren başyapıt. 'Çorba' temasını yaratıcı bir okyanus metaforu ve duygusal bir anne-çocuk masalı hikayesiyle harmanlayan 2D platform deneyimi.",
            tech: ["Unity", "C#", "Level Design"],
            image: "./assets/images/projects/soupcean.png",
            link: "https://github.com/Fahrettinkes/THE-SOUPCEAN",
            linkText: "[ /> OYUNU_INCELE ]"
        },
        {
            title: "THE FIREMAN",
            category: "Oyun Geliştirme (Game Jam)",
            description: "Nesilden nesile aktarılan bir kahramanlık mirasını konu alan, fedakarlık ve zorlu hayatta kalma mekanikleriyle HKÜ Game Jam 2023'te 3.'lük elde eden 2D aksiyon/macera oyunu.",
            tech: ["Unity", "C#", "Game Mechanics"],
            image: "./assets/images/projects/fireman1.png",
            link: "https://github.com/Fahrettinkes/THE-FIREMAN",
            linkText: "[ /> OYUNU_INCELE ]"
        }
    ]
};