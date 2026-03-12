/**
 * 공통 푸터: partials/footer.html 수정하면 됨.
 * - http 서버: fetch로 로드 (캐시 방지)
 * - file://: fetch 실패 시 아래 fallback 사용 (partials/footer.html과 동일하게 유지)
 */
(function() {
    var placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return;
    var isSubfolder = /[\/\\](business|about|recruitment|support)[\/\\]/.test(window.location.href);
    var path = (isSubfolder ? '../partials/footer.html' : 'partials/footer.html') + '?v=' + Date.now();

    var fallbackHtml = '<footer class="footer">' +
        '<div class="container">' +
        '<div class="footer-content footer-top">' +
        '<div class="footer-col">' +
        '<a href="index.html" class="footer-logo footer-logo-link"><img src="images/whitelogo.PNG?v=1" alt="LTREE" class="footer-logo-img"></a>' +
        '<p class="footer-description">대표이사 : 장정수    |    서울특별시 강남구 봉은사로 33길 5, 5층   </p>' +
        '<p class="footer-description">TEL 02-6956-6161    |    FAX 02-6919-2846        </p>' +
        '</div>' +
        '<div class="footer-links-wrap">' +
        '<ul class="footer-links footer-links--row">' +
        '<li><a href="about/about-ltree.html">회사소개</a></li>' +
        '<li><a href="recruitment/recruitment.html">인재채용</a></li>' +
        '<li><a href="index.html#contact">문의하기</a></li>' +
        '</ul></div>' +
        '</div>' +
        '<div class="footer-bottom"><p>&copy; Copyrights©LTREE, Inc. ALL RIGHTS RESERVED.</p></div>' +
        '</div></footer>';

    function fixSubfolderLinks() {
        if (!isSubfolder) return;
        var footer = document.querySelector('.footer');
        if (footer) {
            footer.querySelectorAll('a[href]').forEach(function(a) {
                var h = a.getAttribute('href');
                if (h && !h.match(/^#|^https?:\/\//)) a.setAttribute('href', '../' + h);
            });
            footer.querySelectorAll('img[src]').forEach(function(img) {
                var s = img.getAttribute('src');
                if (s && s.indexOf('images/') === 0) img.setAttribute('src', '../' + s);
            });
        }
    }

    function injectHtml(html) {
        placeholder.outerHTML = html;
        fixSubfolderLinks();
    }

    fetch(path)
        .then(function(r) {
            if (!r.ok) throw new Error('Footer not found');
            return r.text();
        })
        .then(injectHtml)
        .catch(function() {
            injectHtml(fallbackHtml);
        });
})();
