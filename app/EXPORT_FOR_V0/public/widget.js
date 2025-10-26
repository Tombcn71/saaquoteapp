/**
 * KozijnSaaS Widget - Embed anywhere
 * 
 * Usage:
 * <script src="https://kozijnsaas.nl/widget.js" data-company-id="abc-123"></script>
 * 
 * or programmatic:
 * <script>
 *   window.KozijnWidget.init({
 *     companyId: 'abc-123',
 *     position: 'bottom-right',
 *     displayMode: 'floating_button',
 *     buttonText: 'Gratis Offerte',
 *     primaryColor: '#2563eb'
 *   });
 * </script>
 */

(function() {
  'use strict';

  // Prevent multiple initializations
  if (window.KozijnWidget) {
    console.warn('KozijnWidget already initialized');
    return;
  }

  const WIDGET_VERSION = '1.0.0';
  const API_BASE = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://kozijnsaas.nl'; // Update met je productie URL

  class KozijnWidget {
    constructor(config = {}) {
      this.config = {
        companyId: config.companyId || this.getScriptAttribute('data-company-id'),
        widgetKey: config.widgetKey || this.getScriptAttribute('data-widget-key'),
        position: config.position || 'bottom-right',
        displayMode: config.displayMode || 'floating_button',
        buttonText: config.buttonText || 'Gratis Offerte',
        primaryColor: config.primaryColor || '#2563eb',
        secondaryColor: config.secondaryColor || '#1e40af',
        showLogo: config.showLogo !== false,
        triggerType: config.triggerType || 'button',
        triggerDelay: config.triggerDelay || 0,
        zIndex: config.zIndex || 999999,
      };

      this.isOpen = false;
      this.container = null;
      this.iframe = null;
      this.floatingButton = null;

      if (this.config.companyId || this.config.widgetKey) {
        this.init();
      } else {
        console.error('KozijnWidget: Missing companyId or widgetKey');
      }
    }

    getScriptAttribute(attr) {
      const script = document.querySelector('script[src*="widget.js"]');
      return script ? script.getAttribute(attr) : null;
    }

    init() {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.render());
      } else {
        this.render();
      }

      // Track widget view
      this.trackEvent('widget_view');
    }

    render() {
      if (this.config.displayMode === 'floating_button') {
        this.renderFloatingButton();
      } else if (this.config.displayMode === 'inline') {
        this.renderInline();
      } else if (this.config.displayMode === 'popup') {
        this.handlePopupTrigger();
      }
    }

    renderFloatingButton() {
      // Create floating button
      this.floatingButton = document.createElement('button');
      this.floatingButton.id = 'kozijn-widget-button';
      this.floatingButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
        <span>${this.config.buttonText}</span>
      `;

      // Style the button
      this.applyStyles(this.floatingButton, this.getFloatingButtonStyles());

      // Add click handler
      this.floatingButton.addEventListener('click', () => {
        this.open();
        this.trackEvent('widget_interaction');
      });

      document.body.appendChild(this.floatingButton);

      // Add hover effect
      this.floatingButton.addEventListener('mouseenter', () => {
        this.floatingButton.style.transform = 'scale(1.05)';
      });
      this.floatingButton.addEventListener('mouseleave', () => {
        this.floatingButton.style.transform = 'scale(1)';
      });
    }

    renderInline() {
      // Find inline container
      const container = document.querySelector('[data-kozijn-widget]');
      if (!container) {
        console.error('KozijnWidget: Inline container not found. Add <div data-kozijn-widget></div> to your page.');
        return;
      }

      this.createIframe(container, 'inline');
    }

    handlePopupTrigger() {
      if (this.config.triggerType === 'auto' || this.config.triggerType === 'time_delay') {
        setTimeout(() => this.open(), this.config.triggerDelay * 1000);
      } else if (this.config.triggerType === 'scroll') {
        this.setupScrollTrigger();
      } else if (this.config.triggerType === 'exit_intent') {
        this.setupExitIntentTrigger();
      }
    }

    setupScrollTrigger() {
      let triggered = false;
      window.addEventListener('scroll', () => {
        if (triggered) return;
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercentage > 50) {
          triggered = true;
          this.open();
          this.trackEvent('widget_interaction', { trigger: 'scroll' });
        }
      });
    }

    setupExitIntentTrigger() {
      let triggered = false;
      document.addEventListener('mouseout', (e) => {
        if (triggered) return;
        if (e.clientY < 0) {
          triggered = true;
          this.open();
          this.trackEvent('widget_interaction', { trigger: 'exit_intent' });
        }
      });
    }

    open() {
      if (this.isOpen) return;
      this.isOpen = true;

      // Create overlay
      this.container = document.createElement('div');
      this.container.id = 'kozijn-widget-overlay';
      this.applyStyles(this.container, this.getOverlayStyles());

      // Create close button
      const closeButton = document.createElement('button');
      closeButton.innerHTML = '×';
      this.applyStyles(closeButton, this.getCloseButtonStyles());
      closeButton.addEventListener('click', () => this.close());

      // Create iframe
      this.createIframe(this.container, 'modal');

      this.container.appendChild(closeButton);
      document.body.appendChild(this.container);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Close on overlay click
      this.container.addEventListener('click', (e) => {
        if (e.target === this.container) {
          this.close();
        }
      });

      // Close on ESC key
      this.escHandler = (e) => {
        if (e.key === 'Escape') this.close();
      };
      document.addEventListener('keydown', this.escHandler);
    }

    close() {
      if (!this.isOpen) return;
      this.isOpen = false;

      if (this.container) {
        this.container.remove();
        this.container = null;
      }

      if (this.iframe) {
        this.iframe = null;
      }

      // Restore body scroll
      document.body.style.overflow = '';

      // Remove ESC handler
      if (this.escHandler) {
        document.removeEventListener('keydown', this.escHandler);
        this.escHandler = null;
      }
    }

    createIframe(parent, mode) {
      this.iframe = document.createElement('iframe');
      this.iframe.id = 'kozijn-widget-iframe';
      
      // Build iframe URL with params
      const params = new URLSearchParams({
        companyId: this.config.companyId || '',
        widgetKey: this.config.widgetKey || '',
        mode: mode,
        referrer: window.location.href,
        primaryColor: this.config.primaryColor,
        secondaryColor: this.config.secondaryColor,
        showLogo: this.config.showLogo,
      });

      this.iframe.src = `${API_BASE}/widget/embed?${params.toString()}`;
      this.iframe.allow = 'camera; microphone';
      this.iframe.allowFullscreen = true;

      if (mode === 'modal') {
        this.applyStyles(this.iframe, this.getIframeStyles());
      } else if (mode === 'inline') {
        this.applyStyles(this.iframe, {
          width: '100%',
          height: '800px',
          border: 'none',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        });
      }

      parent.appendChild(this.iframe);

      // Listen for messages from iframe
      window.addEventListener('message', this.handleIframeMessage.bind(this));
    }

    handleIframeMessage(event) {
      // Verify origin
      if (event.origin !== API_BASE) return;

      const { type, data } = event.data;

      switch (type) {
        case 'kozijn_widget_close':
          this.close();
          break;
        case 'kozijn_widget_resize':
          if (this.iframe && data.height) {
            this.iframe.style.height = `${data.height}px`;
          }
          break;
        case 'kozijn_widget_conversion':
          this.trackEvent('widget_conversion', data);
          break;
      }
    }

    trackEvent(eventName, data = {}) {
      // Track events to your analytics
      fetch(`${API_BASE}/api/widgets/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widgetKey: this.config.widgetKey,
          companyId: this.config.companyId,
          event: eventName,
          data: {
            ...data,
            url: window.location.href,
            userAgent: navigator.userAgent,
          },
        }),
      }).catch(err => console.debug('Tracking failed:', err));
    }

    // Styles
    getFloatingButtonStyles() {
      const positions = {
        'bottom-right': { bottom: '24px', right: '24px' },
        'bottom-left': { bottom: '24px', left: '24px' },
        'top-right': { top: '24px', right: '24px' },
        'top-left': { top: '24px', left: '24px' },
      };

      return {
        position: 'fixed',
        ...positions[this.config.position],
        zIndex: this.config.zIndex,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '14px 24px',
        backgroundColor: this.config.primaryColor,
        color: 'white',
        border: 'none',
        borderRadius: '50px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      };
    }

    getOverlayStyles() {
      return {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: this.config.zIndex,
        padding: '20px',
      };
    }

    getIframeStyles() {
      return {
        width: '100%',
        maxWidth: '900px',
        height: '90vh',
        maxHeight: '800px',
        border: 'none',
        borderRadius: '16px',
        backgroundColor: 'white',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      };
    }

    getCloseButtonStyles() {
      return {
        position: 'absolute',
        top: '10px',
        right: '10px',
        width: '40px',
        height: '40px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: 'none',
        borderRadius: '50%',
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#333',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: this.config.zIndex + 1,
        transition: 'all 0.2s',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      };
    }

    applyStyles(element, styles) {
      Object.assign(element.style, styles);
    }
  }

  // Auto-initialize from script tag
  if (document.currentScript) {
    const companyId = document.currentScript.getAttribute('data-company-id');
    const widgetKey = document.currentScript.getAttribute('data-widget-key');
    
    if (companyId || widgetKey) {
      window.KozijnWidget = new KozijnWidget({
        companyId,
        widgetKey,
      });
    }
  }

  // Export for manual initialization
  window.KozijnWidget = KozijnWidget;

  console.log(`KozijnWidget v${WIDGET_VERSION} loaded`);
})();

