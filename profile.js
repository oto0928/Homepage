// プロフィールページ専用JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // スキルバーのアニメーション
    initSkillBars();
    
    // スクロールアニメーション
    initScrollAnimations();
    
    // タイムラインアニメーション
    initTimelineAnimations();
});

// スキルバーのアニメーション
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !bar.classList.contains('animated')) {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
                bar.classList.add('animated');
            }
        });
    };
    
    // 初回チェック
    animateSkillBars();
    
    // スクロール時にチェック
    window.addEventListener('scroll', throttle(animateSkillBars, 100));
}

// スクロールアニメーション
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.highlight-item, .skill-category, .vision-item, .timeline-content');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// タイムラインアニメーション
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 200);
            }
        });
    }, observerOptions);
    
    timelineItems.forEach((item, index) => {
        // 初期状態を設定
        item.style.opacity = '0';
        if (index % 2 === 0) {
            item.style.transform = 'translateX(-50px)';
        } else {
            item.style.transform = 'translateX(50px)';
        }
        item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        observer.observe(item);
    });
}

// パフォーマンス最適化用のthrottle関数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// スムーススクロール（CTA ボタン用）
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ヒーロー統計のカウントアップアニメーション
function initCountUpAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCountUp = (element, target) => {
        const duration = 2000; // 2秒
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // 数値に応じて表示形式を調整
            if (target >= 100) {
                element.textContent = Math.floor(current) + '+';
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const text = entry.target.textContent;
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                
                entry.target.classList.add('animated');
                animateCountUp(entry.target, number);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// ページロード完了後にカウントアップアニメーションを初期化
window.addEventListener('load', initCountUpAnimation);

// パララックス効果（ヒーロー背景）
function initParallaxEffect() {
    const heroSection = document.querySelector('.profile-hero');
    
    if (heroSection) {
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            heroSection.style.transform = `translateY(${rate}px)`;
        }, 10));
    }
}

// パララックス効果を初期化
initParallaxEffect();

// スキルカテゴリのホバー効果強化
document.querySelectorAll('.skill-category').forEach(category => {
    category.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    category.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ビジョンアイテムの連続アニメーション
function initVisionAnimation() {
    const visionItems = document.querySelectorAll('.vision-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 300);
            }
        });
    }, { threshold: 0.3 });
    
    visionItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px) scale(0.9)';
        item.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        observer.observe(item);
    });
}

// ビジョンアニメーションを初期化
initVisionAnimation();

// 写真の装飾要素のアニメーション
function initPhotoDecoration() {
    const decoration = document.querySelector('.photo-decoration');
    
    if (decoration) {
        // マウス移動に応じて装飾を動かす
        document.addEventListener('mousemove', throttle((e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            decoration.style.transform = `translate(${x}px, ${y}px)`;
        }, 50));
    }
}

// 写真装飾アニメーションを初期化
initPhotoDecoration();
