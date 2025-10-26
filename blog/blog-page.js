// ブログページ専用JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // フィルター機能
    const filterButtons = document.querySelectorAll('.filter-btn');
    const articles = document.querySelectorAll('.article-card');
    const searchInput = document.getElementById('blog-search');

    // カテゴリーフィルター
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // アクティブボタンの切り替え
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 記事のフィルタリング
            filterArticles(category, searchInput.value);
        });
    });

    // 検索機能
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
        
        filterArticles(activeCategory, searchTerm);
    });

    // フィルタリング関数
    function filterArticles(category, searchTerm) {
        articles.forEach(article => {
            const articleCategory = article.dataset.category;
            const articleTitle = article.querySelector('h2, h3').textContent.toLowerCase();
            const articleContent = article.querySelector('p').textContent.toLowerCase();
            
            const categoryMatch = category === 'all' || articleCategory === category;
            const searchMatch = searchTerm === '' || 
                               articleTitle.includes(searchTerm) || 
                               articleContent.includes(searchTerm);
            
            if (categoryMatch && searchMatch) {
                article.style.display = 'grid';
                article.style.animation = 'fadeInUp 0.6s ease forwards';
            } else {
                article.style.display = 'none';
            }
        });

        // 結果が0件の場合のメッセージ表示
        const visibleArticles = Array.from(articles).filter(article => 
            article.style.display !== 'none'
        );
        
        showNoResultsMessage(visibleArticles.length === 0);
    }

    // 検索結果なしのメッセージ表示
    function showNoResultsMessage(show) {
        let noResultsMsg = document.querySelector('.no-results-message');
        
        if (show && !noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-light);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3>記事が見つかりませんでした</h3>
                    <p>検索条件を変更してお試しください</p>
                </div>
            `;
            document.querySelector('.blog-articles').appendChild(noResultsMsg);
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    // いいねボタンの機能
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // リンクの遷移を防ぐ
            e.stopPropagation(); // イベントの伝播を停止
            
            const icon = this.querySelector('i');
            const countSpan = this.childNodes[1];
            let count = parseInt(countSpan.textContent.trim());
            
            if (icon.classList.contains('far')) {
                // いいねを追加
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.color = '#ef4444';
                countSpan.textContent = ` ${count + 1}`;
                
                // アニメーション効果
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            } else {
                // いいねを削除
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.color = '';
                countSpan.textContent = ` ${count - 1}`;
            }
        });
    });

    // シェアボタンの機能
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // リンクの遷移を防ぐ
            e.stopPropagation(); // イベントの伝播を停止
            
            const article = this.closest('.article-card');
            const title = article.querySelector('h2, h3').textContent;
            const url = window.location.href;
            
            if (navigator.share) {
                // Web Share API対応ブラウザ
                navigator.share({
                    title: title,
                    url: url
                });
            } else {
                // フォールバック：クリップボードにコピー
                navigator.clipboard.writeText(`${title} - ${url}`).then(() => {
                    showNotification('リンクをクリップボードにコピーしました', 'success');
                });
            }
        });
    });

    // ページネーション機能
    const pageNumbers = document.querySelectorAll('.page-number');
    const prevBtn = document.querySelector('.page-btn.prev');
    const nextBtn = document.querySelector('.page-btn.next');
    let currentPage = 1;
    const totalPages = 8;

    pageNumbers.forEach(button => {
        button.addEventListener('click', function() {
            const page = parseInt(this.textContent);
            goToPage(page);
        });
    });

    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    });

    nextBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    });

    function goToPage(page) {
        currentPage = page;
        
        // ページ番号の更新
        pageNumbers.forEach(btn => btn.classList.remove('active'));
        const targetBtn = Array.from(pageNumbers).find(btn => 
            parseInt(btn.textContent) === page
        );
        if (targetBtn) {
            targetBtn.classList.add('active');
        }
        
        // 前へ・次へボタンの状態更新
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
        
        // スクロール位置をトップに
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // 実際のページネーション処理はここで実装
        // （サーバーサイドでの実装が必要）
        console.log(`Page ${page} loaded`);
    }

    // タグクラウドの機能
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            const tagText = this.textContent.toLowerCase();
            searchInput.value = tagText;
            
            // 検索実行
            const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
            filterArticles(activeCategory, tagText);
            
            // 検索フィールドにフォーカス
            searchInput.focus();
        });
    });

    // ニュースレター登録
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // 簡単なバリデーション
            if (isValidEmail(email)) {
                showNotification('ニュースレターの登録が完了しました！', 'success');
                this.reset();
            } else {
                showNotification('正しいメールアドレスを入力してください', 'error');
            }
        });
    }

    // メールアドレスバリデーション
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 通知表示機能
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

    // スクロール時のアニメーション
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

    // サイドバーウィジェットのアニメーション
    const sidebarWidgets = document.querySelectorAll('.sidebar-widget');
    sidebarWidgets.forEach((widget, index) => {
        widget.style.opacity = '0';
        widget.style.transform = 'translateY(30px)';
        widget.style.transition = 'all 0.6s ease';
        widget.style.animationDelay = `${index * 0.1}s`;
        observer.observe(widget);
    });

    // 人気記事のホバーエフェクト
    const popularPosts = document.querySelectorAll('.popular-post');
    popularPosts.forEach(post => {
        post.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        post.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // 読み込み完了のログ
    console.log('Blog page initialized successfully! 📝');
});

// スクロール位置の保存・復元
window.addEventListener('beforeunload', function() {
    sessionStorage.setItem('blogScrollPosition', window.scrollY);
});

window.addEventListener('load', function() {
    const scrollPosition = sessionStorage.getItem('blogScrollPosition');
    if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition));
        sessionStorage.removeItem('blogScrollPosition');
    }
});
