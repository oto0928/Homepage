// ブログ記事ページ専用JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 読み進捗バーの作成と制御
    createReadingProgressBar();
    
    // 目次のスクロールスパイ機能
    initTableOfContents();
    
    // スクロールアニメーション
    initScrollAnimations();
    
    // シェア機能
    initShareButtons();
    
    // 評価機能
    initRatingButtons();
    
    // ニュースレター登録
    initNewsletterForm();
    
    // コードブロックのコピー機能
    initCodeCopyButtons();
    
    // 画像の遅延読み込み
    initLazyLoading();
    
    console.log('Blog article page initialized successfully! 📖');
});

// 読み進捗バーの作成
function createReadingProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', updateReadingProgress);
}

// 読み進捗の更新
function updateReadingProgress() {
    const article = document.querySelector('.article-body');
    if (!article) return;
    
    const articleTop = article.offsetTop;
    const articleHeight = article.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollTop = window.pageYOffset;
    
    const articleStart = articleTop - windowHeight / 2;
    const articleEnd = articleTop + articleHeight - windowHeight / 2;
    
    if (scrollTop < articleStart) {
        updateProgressBar(0);
    } else if (scrollTop > articleEnd) {
        updateProgressBar(100);
    } else {
        const progress = ((scrollTop - articleStart) / (articleEnd - articleStart)) * 100;
        updateProgressBar(progress);
    }
}

function updateProgressBar(progress) {
    const progressBar = document.querySelector('.reading-progress');
    if (progressBar) {
        progressBar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
    }
}

// 目次のスクロールスパイ機能
function initTableOfContents() {
    const tocLinks = document.querySelectorAll('.toc-nav a, .table-of-contents a');
    const sections = document.querySelectorAll('.article-body section[id]');
    
    if (sections.length === 0) return;
    
    // スムーススクロール
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // アクティブセクションのハイライト
    const observerOptions = {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const tocLink = document.querySelector(`.toc-nav a[href="#${id}"]`);
            
            if (entry.isIntersecting) {
                // 全てのアクティブクラスを削除
                document.querySelectorAll('.toc-nav a.active').forEach(link => {
                    link.classList.remove('active');
                });
                
                // 現在のセクションをアクティブに
                if (tocLink) {
                    tocLink.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

// スクロールアニメーション
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // アニメ要素のインライン初期値を確実に上書き
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // セクションのアニメーション
    const sections = document.querySelectorAll('.article-body section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // その他の要素のアニメーション
    const animatedElements = document.querySelectorAll('.app-item-detailed, .lesson-item, .plan-item');
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        element.style.animationDelay = `${index * 0.1}s`;
        observer.observe(element);
    });
}

// シェア機能
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    const articleTitle = document.querySelector('.article-title').textContent;
    const articleUrl = window.location.href;
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.classList[1]; // twitter, facebook, etc.
            
            switch(platform) {
                case 'twitter':
                    shareOnTwitter(articleTitle, articleUrl);
                    break;
                case 'facebook':
                    shareOnFacebook(articleUrl);
                    break;
                case 'linkedin':
                    shareOnLinkedIn(articleTitle, articleUrl);
                    break;
                case 'copy':
                    copyToClipboard(articleUrl);
                    break;
            }
        });
    });
}

function shareOnTwitter(title, url) {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
}

function shareOnFacebook(url) {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
}

function shareOnLinkedIn(title, url) {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('リンクをクリップボードにコピーしました', 'success');
    }).catch(() => {
        showNotification('コピーに失敗しました', 'error');
    });
}

// 評価機能
function initRatingButtons() {
    const ratingButtons = document.querySelectorAll('.rating-btn');
    
    ratingButtons.forEach(button => {
        button.addEventListener('click', function() {
            const isHelpful = this.classList.contains('helpful');
            
            // ボタンの状態を更新
            ratingButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            
            // フィードバックを送信（実際の実装では API に送信）
            const feedback = {
                helpful: isHelpful,
                articleUrl: window.location.href,
                timestamp: new Date().toISOString()
            };
            
            console.log('Feedback submitted:', feedback);
            
            showNotification(
                isHelpful ? 'フィードバックありがとうございます！' : 'ご意見をお聞かせいただき、ありがとうございます。',
                'success'
            );
        });
    });
}

// ニュースレター登録
function initNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (isValidEmail(email)) {
                // 実際の実装では API に送信
                console.log('Newsletter subscription:', email);
                showNotification('ニュースレターの登録が完了しました！', 'success');
                this.reset();
            } else {
                showNotification('正しいメールアドレスを入力してください', 'error');
            }
        });
    });
}

// コードブロックのコピー機能
function initCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach(block => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-btn';
        copyButton.innerHTML = '<i class="fas fa-copy"></i> コピー';
        copyButton.style.cssText = `
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 4px;
            padding: 0.5rem 1rem;
            cursor: pointer;
            font-size: 0.8rem;
            transition: background 0.3s ease;
        `;
        
        block.style.position = 'relative';
        block.appendChild(copyButton);
        
        copyButton.addEventListener('click', function() {
            const code = block.querySelector('code').textContent;
            copyToClipboard(code);
            
            this.innerHTML = '<i class="fas fa-check"></i> コピー済み';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-copy"></i> コピー';
            }, 2000);
        });
        
        copyButton.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        
        copyButton.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        });
    });
}

// 画像の遅延読み込み
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
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
    
    images.forEach(img => imageObserver.observe(img));
}

// ユーティリティ関数
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;

    switch(type) {
        case 'success':
            notification.style.background = '#10b981';
            break;
        case 'error':
            notification.style.background = '#ef4444';
            break;
        default:
            notification.style.background = '#6366f1';
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// キーボードショートカット
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K でシェアメニューを開く
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const shareSection = document.querySelector('.social-share');
        if (shareSection) {
            shareSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Ctrl/Cmd + U で目次に移動
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        const toc = document.querySelector('.table-of-contents');
        if (toc) {
            toc.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// ページ離脱時の読み進捗保存
window.addEventListener('beforeunload', function() {
    const progress = parseFloat(document.querySelector('.reading-progress').style.width) || 0;
    sessionStorage.setItem('readingProgress', progress);
    sessionStorage.setItem('articleUrl', window.location.href);
});

// ページ読み込み時の読み進捗復元
window.addEventListener('load', function() {
    const savedProgress = sessionStorage.getItem('readingProgress');
    const savedUrl = sessionStorage.getItem('articleUrl');
    
    if (savedProgress && savedUrl === window.location.href) {
        const progressPercent = parseFloat(savedProgress);
        if (progressPercent > 10) { // 10%以上読んでいた場合
            const continueReading = confirm(`前回の続きから読みますか？（${Math.round(progressPercent)}%まで読了済み）`);
            if (continueReading) {
                const article = document.querySelector('.article-body');
                const scrollPosition = (progressPercent / 100) * article.offsetHeight + article.offsetTop;
                window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
            }
        }
        
        // セッションストレージをクリア
        sessionStorage.removeItem('readingProgress');
        sessionStorage.removeItem('articleUrl');
    }
});

// 印刷スタイルの最適化
window.addEventListener('beforeprint', function() {
    // 印刷時に不要な要素を非表示
    const elementsToHide = document.querySelectorAll('.article-actions, .related-articles, .article-sidebar');
    elementsToHide.forEach(element => {
        element.style.display = 'none';
    });
});

window.addEventListener('afterprint', function() {
    // 印刷後に要素を復元
    const elementsToShow = document.querySelectorAll('.article-actions, .related-articles, .article-sidebar');
    elementsToShow.forEach(element => {
        element.style.display = '';
    });
});
