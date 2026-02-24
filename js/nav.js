/**
 * 공통 네비게이션: partials/nav.html 수정하면 됨.
 * - http: fetch로 로드 (캐시 방지)
 * - file://: fetch 실패 시 fallback 사용
 * - 서브폴더: 링크/이미지 경로에 ../ 추가, 현재 페이지에 active 부여
 */
(function() {
    var placeholder = document.getElementById('nav-placeholder');
    if (!placeholder) return;
    var isSubfolder = /[\/\\](business|about|recruitment|support)[\/\\]/.test(window.location.href);
    var path = (isSubfolder ? '../partials/nav.html' : 'partials/nav.html') + '?v=' + Date.now();

    var fallbackHtml = '<nav class="navbar" id="navbar">' +
        '<div class="nav-container">' +
        '<a href="index.html" class="nav-logo"><img src="images/logo-ltree.png" alt="LTREE" style="height: 40px; width: auto;"></a>' +
        '<div class="nav-menu" id="navMenu">' +
        '<div class="nav-item nav-item--dropdown">' +
        '<a href="business/smart-logistics.html" class="nav-link">비지니스 <i class="fas fa-chevron-down nav-arrow"></i></a>' +
        '<ul class="nav-dropdown"><li><a href="business/smart-logistics.html" class="nav-sublink">스마트 물류</a></li><li><a href="business/smart-ito.html" class="nav-sublink">스마트 ITO</a></li></ul>' +
        '</div>' +
        '<div class="nav-item nav-item--dropdown">' +
        '<a href="about/about-altri.html" class="nav-link">회사소개 <i class="fas fa-chevron-down nav-arrow"></i></a>' +
        '<ul class="nav-dropdown"><li><a href="about/about-altri.html#altri" class="nav-sublink">앨트리</a></li><li><a href="about/about-altri.html#service" class="nav-sublink">서비스</a></li><li><a href="about/about-altri.html#partner" class="nav-sublink">파트너</a></li><li><a href="about/about-altri.html#location" class="nav-sublink">오시는 길</a></li></ul>' +
        '</div>' +
        '<a href="recruitment/recruitment.html" class="nav-link">인재채용</a>' +
        '<div class="nav-item nav-item--dropdown">' +
        '<a href="support/support-notice.html" class="nav-link">고객지원 <i class="fas fa-chevron-down nav-arrow"></i></a>' +
        '<ul class="nav-dropdown"><li><a href="support/support-notice.html" class="nav-sublink">공지사항</a></li><li><a href="support/support-contact.html" class="nav-sublink">문의하기</a></li><li><a href="support/support-tech.html" class="nav-sublink">기술지원</a></li></ul>' +
        '</div></div>' +
        '<button class="nav-toggle" id="navToggle" aria-label="메뉴"><span></span><span></span><span></span></button>' +
        '</div></nav>';

    function fixSubfolderLinks(nav) {
        if (!nav || !isSubfolder) return;
        nav.querySelectorAll('a[href]').forEach(function(a) {
            var h = a.getAttribute('href');
            if (h && !h.match(/^#|^https?:\/\//)) a.setAttribute('href', '../' + h);
        });
        nav.querySelectorAll('img[src]').forEach(function(img) {
            var s = img.getAttribute('src');
            if (s && s.indexOf('images/') === 0) img.setAttribute('src', '../' + s);
        });
    }

    function setActive(nav) {
        if (!nav) return;
        var pathname = window.location.pathname || '';
        var current = pathname.replace(/^.*[\/\\]/, '').split('#')[0] || 'index.html';
        if (!current) current = 'index.html';
        var currentHash = (window.location.hash || '').replace(/^#/, '').toLowerCase();
        nav.querySelectorAll('a.nav-link').forEach(function(a) {
            if (a.classList.contains('nav-sublink')) return;
            var h = a.getAttribute('href') || '';
            var linkPage = h.replace(/^.*[\/\\]/, '').split('#')[0];
            if (linkPage && current === linkPage) {
                a.classList.add('active');
            }
        });
        nav.querySelectorAll('a.nav-sublink').forEach(function(a) {
            if (current.indexOf('about-') === 0) return;
            var h = (a.getAttribute('href') || '').replace(/^#/, '');
            var linkPage = h.replace(/^.*[\/\\]/, '').split('#')[0];
            var linkHash = (h.split('#')[1] || '').toLowerCase();
            var pageMatch = linkPage && current === linkPage;
            var hashMatch = !linkHash || linkHash === currentHash;
            if (pageMatch && hashMatch) {
                a.classList.add('active');
                var parent = a.closest('.nav-item--dropdown');
                if (parent) {
                    var parentLink = parent.querySelector('.nav-link');
                    if (parentLink) parentLink.classList.add('active');
                }
            }
        });
        if (current.indexOf('about-') === 0) {
            var aboutLink = nav.querySelector('a.nav-link[href*="about-altri"]');
            if (aboutLink) aboutLink.classList.add('active');
        }
    }

    function injectHtml(html) {
        placeholder.outerHTML = html;
        var nav = document.getElementById('navbar');
        fixSubfolderLinks(nav);
        setActive(nav);
        document.dispatchEvent(new CustomEvent('nav-loaded'));
    }

    fetch(path)
        .then(function(r) {
            if (!r.ok) throw new Error('Nav not found');
            return r.text();
        })
        .then(injectHtml)
        .catch(function() {
            injectHtml(fallbackHtml);
        });
})();
