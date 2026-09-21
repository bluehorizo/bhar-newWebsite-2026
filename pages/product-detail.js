(function () {
  const key = document.body.dataset.productKey;
  const item = window.BHAR_PRODUCTS?.find(product => product.key === key);
  if (!item) return;

  const categoryLabel = item.category === 'applications' ? 'Applications' : 'Automations';
  const categoryHref = item.category === 'applications' ? 'applications.html' : 'automations.html';

  document.body.insertAdjacentHTML('afterbegin', `
    <header>
      <nav id="navbar" role="navigation" aria-label="Main Navigation">
        <div class="nav-inner">
          <a href="../index.html" class="nav-logo" aria-label="BHAR India Home"><img src="../images/logo.png" alt="BHAR India Logo" class="nav-logo-img" /><div class="nav-logo-text"><span class="brand-name">Blue Horizon</span><span class="brand-sub">Automation Research</span></div></a>
          <ul class="nav-links">
            <li><a href="../index.html">Home</a></li>
            <li class="has-dropdown"><a href="services.html">Services <svg class="chevron-icon" viewBox="0 0 16 16" aria-hidden="true"><polyline points="4 6 8 10 12 6"/></svg></a><div class="dropdown-menu"><div class="dropdown-inner"><a href="services.html#rpa"><span class="icon">🤖</span> Automation Solutions</a><a href="services.html#webapp"><span class="icon">🌐</span> Web Applications</a><a href="services.html#erp-implementation"><span class="icon">📊</span> ERP Implementation</a><a href="services.html#consulting"><span class="icon">📈</span> Website Development</a></div></div></li>
            <li class="has-dropdown"><a href="products.html" class="active">Products <svg class="chevron-icon" viewBox="0 0 16 16" aria-hidden="true"><polyline points="4 6 8 10 12 6"/></svg></a><div class="dropdown-menu"><div class="dropdown-inner"><a href="applications.html"><span class="icon">APP</span> Applications</a><a href="automations.html"><span class="icon">AUTO</span> Automations</a></div></div></li>
            <li><a href="about.html">About Us</a></li><li><a href="blog.html">Blog</a></li>
          </ul>
          <div class="nav-right"><button class="theme-toggle" aria-label="Toggle dark mode">&#x1F319;</button><a href="contact.html" class="btn btn-primary btn-sm nav-cta-desktop">Contact Us</a><button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button></div>
        </div>
      </nav>
      <div class="mobile-nav" id="mobileNav"><a href="../index.html">Home</a><div class="mobile-section-label">Services</div><a href="services.html#rpa">🤖 Automation Solutions</a><a href="services.html#webapp">🌐 Web Applications</a><a href="services.html#erp-implementation">📊 ERP Implementation</a><a href="services.html#consulting">📈 Website Development</a><div class="mobile-divider"></div><div class="mobile-section-label">Products</div><a href="applications.html">Applications</a><a href="automations.html">Automations</a><div class="mobile-divider"></div><a href="about.html">About Us</a><a href="blog.html">Blog</a><a href="contact.html" class="btn-primary-mobile">Contact Us</a></div>
    </header>
  `);

  document.title = `${item.title} | ${categoryLabel} | BHAR India`;
  document.querySelector('[data-detail-breadcrumb-category]').textContent = categoryLabel;
  document.querySelector('[data-detail-breadcrumb-category]').href = categoryHref;
  document.querySelector('[data-detail-breadcrumb-current]').textContent = item.title;
  document.querySelector('[data-detail-tag]').textContent = item.tag;
  document.querySelector('[data-detail-title]').textContent = item.title;
  document.querySelector('[data-detail-summary]').textContent = item.summary;
  document.querySelector('[data-detail-image]').src = item.image;
  document.querySelector('[data-detail-image]').alt = item.title;
  document.querySelector('[data-detail-features]').innerHTML = item.features.map(feature => `
    <div class="product-feature-card"><h4>${feature}</h4><p>Designed to reduce manual work, improve visibility, and make daily operations easier to control.</p></div>
  `).join('');
  document.querySelector('[data-detail-use-cases]').innerHTML = item.useCases.map(useCase => `<span class="use-case-chip">${useCase}</span>`).join('');

  if (item.blogUrl) {
    document.querySelector('.product-use-cases').insertAdjacentHTML('afterend', `
      <div class="product-blog-cta">
        <div>
          <span class="section-tag">Project Blog</span>
          <h3>Want to understand this project in detail?</h3>
          <p>Read a practical blog covering the workflow, benefits, controls, and business use cases for ${item.title.toLowerCase()}.</p>
        </div>
        <a href="${item.blogUrl}" class="btn btn-primary">Read a blog on this project -&gt;</a>
      </div>
    `);
  }

  if (item.faqs?.length) {
    const visibleFaqCount = 10;
    const faqAnchor = document.querySelector('.product-blog-cta') || document.querySelector('.product-use-cases');
    faqAnchor.insertAdjacentHTML('afterend', `
      <div class="product-faq" aria-labelledby="product-faq-heading" itemscope itemtype="https://schema.org/FAQPage">
        <div class="product-faq-header">
          <span class="section-tag">Frequently Asked Questions</span>
          <h2 id="product-faq-heading">${item.title} FAQs: Features, Workflows &amp; Implementation</h2>
          <p>Key technical, operational, and business questions about deploying the ${item.title.toLowerCase()} in an organization.</p>
        </div>
        <div class="product-faq-list">
          ${item.faqs.map((faq, index) => `
            <details class="product-faq-item${index >= visibleFaqCount ? ' product-faq-hidden' : ''}" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
              <summary itemprop="name">${faq.question}</summary>
              <div class="product-faq-answer" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                <p itemprop="text">${faq.answer}</p>
                ${faq.points?.length ? `<ul>${faq.points.map(point => `<li>${point}</li>`).join('')}</ul>` : ''}
              </div>
            </details>
          `).join('')}
        </div>
        ${item.faqs.length > visibleFaqCount ? `<button type="button" class="btn btn-secondary product-faq-load-more" data-faq-load-more>Load more questions (${item.faqs.length - visibleFaqCount} more)</button>` : ''}
        <div class="product-faq-footer" style="margin-top: 24px; padding: 20px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); text-align: center;">
          <p style="margin-bottom: 12px; font-size: 15px; color: var(--text);">Want to explore deep-dive use cases, controls, and workflows for <strong>${item.title}</strong>?</p>
          ${item.blogUrl ? `<a href="${item.blogUrl}" class="btn btn-primary btn-sm">Read Related Project Blog on ${item.title} -&gt;</a>&nbsp;&nbsp;` : ''}
          <a href="contact.html" class="btn btn-secondary btn-sm">Speak With Our Solution Experts</a>
        </div>
      </div>
    `);

    document.querySelector('[data-faq-load-more]')?.addEventListener('click', event => {
      document.querySelectorAll('.product-faq-hidden').forEach(faq => faq.classList.remove('product-faq-hidden'));
      event.currentTarget.remove();
    });

    try {
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": item.faqs.slice(0, 10).map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer + (faq.points?.length ? ' ' + faq.points.join(', ') : '')
          }
        }))
      };
      const schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.textContent = JSON.stringify(faqSchema);
      document.head.appendChild(schemaScript);
    } catch (e) {
      console.warn('Schema injection error:', e);
    }
  }

  document.body.insertAdjacentHTML('beforeend', '<footer class="site-footer" role="contentinfo"><div class="container"><div class="footer-grid"><div class="footer-brand"><a href="../index.html" class="nav-logo" aria-label="BHAR India Home"><img src="../images/logo.png" alt="BHAR India Logo" class="nav-logo-img" /><div class="nav-logo-text"><span class="brand-name">Blue Horizon</span><span class="brand-sub">Automation Research</span></div></a><p>Delivering intelligent automation and software solutions that drive measurable business outcomes. Built for India, designed for scale.</p><div class="footer-social" aria-label="Social Media"><a href="https://www.linkedin.com/company/blue-horizon-automation" target="_blank" rel="noopener" class="social-link" aria-label="LinkedIn">in</a><a href="https://www.facebook.com/bharindia" target="_blank" rel="noopener" class="social-link" aria-label="Facebook">f</a><a href="https://www.twitter.com/bharindia" target="_blank" rel="noopener" class="social-link" aria-label="Twitter">𝕏</a><a href="https://www.youtube.com/@bluehorizonautomationresea4382" target="_blank" rel="noopener" class="social-link" aria-label="YouTube">▶</a></div></div><div class="footer-col"><h5>Services</h5><a href="services.html#rpa">Automation Solutions</a><a href="services.html#webapp">Web Applications</a><a href="services.html#erp-implementation">ERP Implementation</a><a href="services.html#consulting">Website Development</a><a href="projects.html">Our Projects</a></div><div class="footer-col"><h5>Products</h5><a href="sap-report-generation.html">SAP Report Generation</a><a href="gst-calculation-automation.html">GST Calculation</a><a href="crm-lead-management.html">CRM &amp; Lead Management</a><a href="clinic-management-system.html">Clinic Management</a><a href="pos-captain-system.html">POS + Captain</a><a href="retail-pos-system.html">POS System</a><a href="smart-sap-process-automation.html">Smart SAP Automation</a><a href="intelligent-invoice-processing.html">Invoice Processing</a><a href="sales-to-erp-workflow-automation.html">Sales to ERP</a><a href="asset-management-system.html">Asset Management</a><a href="property-dealer-management-system.html">Property Dealer System</a><a href="ekyc-government-portal-automation.html">E-KYC Automation</a></div><div class="footer-col"><h5>Company</h5><a href="about.html">About Us</a><a href="blog.html">Blog</a><a href="contact.html">Contact Us</a><a href="../sitemap.xml">Sitemap</a></div></div><div class="footer-bottom"><p>©2024 Blue Horizon Automation Research. All rights reserved.</p><p>Made with ❤️ in India &nbsp;|&nbsp; <a href="mailto:customerdelight@bhar.co.in">customerdelight@bhar.co.in</a></p></div></div></footer><button id="back-to-top" aria-label="Back to top">↑</button>');

  function initThemeToggle() {
    const storageKey = 'bhar-theme-v2';
    const light = 'light';
    const dark = 'dark';

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      document.querySelectorAll('.theme-toggle').forEach(button => {
        button.textContent = theme === dark ? '☀️' : '🌙';
        button.setAttribute('aria-label', theme === dark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
        button.title = theme === dark ? 'Light Mode' : 'Dark Mode';
      });
      localStorage.setItem(storageKey, theme);
    }

    applyTheme(localStorage.getItem(storageKey) || light);
    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || light;
        applyTheme(current === dark ? light : dark);
      });
    });
  }

  function initMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const submenuButtons = [];
    if (!hamburger || !mobileNav) return;

    Array.from(mobileNav.querySelectorAll(':scope > .mobile-section-label')).forEach((label, index) => {
      const items = [];
      let sibling = label.nextElementSibling;
      while (sibling && !sibling.classList.contains('mobile-divider')) {
        items.push(sibling);
        sibling = sibling.nextElementSibling;
      }
      if (!items.length) return;

      const submenuId = `mobile-detail-submenu-${index + 1}`;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mobile-menu-parent';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', submenuId);
      button.innerHTML = `<span>${label.textContent.trim()}</span><span class="mobile-parent-chevron" aria-hidden="true">⌄</span>`;

      const submenu = document.createElement('div');
      submenu.className = 'mobile-submenu';
      submenu.id = submenuId;
      items.forEach(itemNode => submenu.appendChild(itemNode));

      label.replaceWith(button);
      button.insertAdjacentElement('afterend', submenu);
      submenuButtons.push(button);

      button.addEventListener('click', () => {
        const shouldOpen = button.getAttribute('aria-expanded') !== 'true';
        submenuButtons.forEach(otherButton => {
          if (otherButton === button) return;
          const otherSubmenu = document.getElementById(otherButton.getAttribute('aria-controls'));
          otherButton.classList.remove('open');
          otherButton.setAttribute('aria-expanded', 'false');
          otherSubmenu?.classList.remove('open');
        });
        button.classList.toggle('open', shouldOpen);
        button.setAttribute('aria-expanded', String(shouldOpen));
        submenu.classList.toggle('open', shouldOpen);
      });
    });

    function closeMobileMenu() {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', event => {
      event.stopPropagation();
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));
    document.addEventListener('click', event => {
      if (mobileNav.classList.contains('open') && !mobileNav.contains(event.target) && !hamburger.contains(event.target)) {
        closeMobileMenu();
      }
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMobileMenu();
    });
  }

  function initPageUtilities() {
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');
    function handleScroll() {
      navbar?.classList.toggle('scrolled', window.scrollY > 20);
      backToTop?.classList.toggle('show', window.scrollY > 400);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    handleScroll();
  }

  function initFloatingBackLink() {
    const backLink = Array.from(document.querySelectorAll('a[href]')).find(link => /^Back to\s+/i.test(link.textContent.trim()));
    if (!backLink || document.querySelector('.floating-back-link')) return;

    const floatingBackLink = document.createElement('a');
    floatingBackLink.href = backLink.getAttribute('href');
    floatingBackLink.className = 'floating-back-link';
    floatingBackLink.textContent = backLink.textContent.trim();
    floatingBackLink.setAttribute('aria-label', backLink.getAttribute('aria-label') || floatingBackLink.textContent);
    document.body.appendChild(floatingBackLink);
  }

  function cleanFooterLinks() {
    document.querySelectorAll('.site-footer a').forEach(link => {
      const label = link.textContent.trim().toLowerCase();
      const href = link.getAttribute('href') || '';
      if (label === 'our projects' || label === 'sitemap' || href.endsWith('sitemap.xml')) {
        link.remove();
      }
    });
  }

  initThemeToggle();
  initMobileNavigation();
  initPageUtilities();
  initFloatingBackLink();
  cleanFooterLinks();
})();
