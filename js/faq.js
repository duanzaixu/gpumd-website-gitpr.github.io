/**
 * GPUMD FAQ - Dynamic Loader & Interaction Handler
 * ES6 Module
 */

class GPUMDFaq {
    constructor(config) {
        this.dataUrl = config?.dataUrl || 'data/gpumd-faq.json';
        this.lang = config?.lang || 'zh';
        this.faqData = [];
        this.filteredData = [];
        this.currentCategory = this.lang === 'en' ? 'All' : '全部';
        this.searchQuery = '';
        
        this.elements = {
            container: document.getElementById('faq-list'),
            searchInput: document.getElementById('faq-search'),
            categoryContainer: document.getElementById('faq-categories'),
            statsCount: document.getElementById('faq-count'),
            expandAllBtn: document.getElementById('expand-all'),
            collapseAllBtn: document.getElementById('collapse-all')
        };

        this.init();
    }

    async init() {
        try {
            const response = await fetch(this.dataUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            this.faqData = await response.json();

            if (this.faqData.length === 0) {
                console.error('FAQ data empty!');
                this.showError();
                return;
            }

            this.filteredData = [...this.faqData];
            this.renderCategories();
            this.handleEvents();
            this.render();
            this.handleUrlAnchor();
        } catch (error) {
            console.error('Error loading FAQ data:', error);
            
            let customMsg = null;
            if (window.location.protocol === 'file:') {
                customMsg = this.lang === 'en' 
                    ? 'Browser security blocks loading JSON via file:// protocol. Please use a local server (e.g., python -m http.server).' 
                    : '浏览器安全策略限制 file:// 协议加载 JSON。请使用本地服务器预览（如 python -m http.server）。';
            }
            
            this.showError(customMsg);
        }
    }

    renderCategories() {
        const allLabel = this.lang === 'en' ? 'All' : '全部';
        const categories = [allLabel, ...new Set(this.faqData.map(item => item.category))];
        this.elements.categoryContainer.innerHTML = categories.map(cat => `
            <button class="faq-category-btn ${cat === this.currentCategory ? 'active' : ''}" data-category="${cat}">
                ${cat}
            </button>
        `).join('');
    }

    handleEvents() {
        // Search
        this.elements.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.filter();
        });

        // Category Filter
        this.elements.categoryContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.faq-category-btn');
            if (!btn) return;
            this.currentCategory = btn.dataset.category;
            this.updateCategoryUI();
            this.filter();
        });

        // Expand/Collapse All
        this.elements.expandAllBtn.addEventListener('click', () => this.toggleAll(true));
        this.elements.collapseAllBtn.addEventListener('click', () => this.toggleAll(false));

        // Improved Toggle with Height Transition
        this.elements.container.addEventListener('click', (e) => {
            const trigger = e.target.closest('.faq-question-trigger');
            if (!trigger) return;
            
            const card = trigger.closest('.faq-card');
            const isActive = card.classList.contains('active');
            
            this.toggleItem(card, !isActive);
        });
    }

    updateCategoryUI() {
        this.elements.categoryContainer.querySelectorAll('.faq-category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === this.currentCategory);
        });
    }

    filter() {
        const allLabel = this.lang === 'en' ? 'All' : '全部';
        this.filteredData = this.faqData.filter(item => {
            const matchCategory = this.currentCategory === allLabel || item.category === this.currentCategory;
            const matchSearch = item.question.toLowerCase().includes(this.searchQuery) || 
                               item.answer.toLowerCase().includes(this.searchQuery);
            return matchCategory && matchSearch;
        });
        this.render();
    }

    toggleItem(card, expand) {
        const answerWrap = card.querySelector('.faq-answer-wrap');
        const icon = card.querySelector('.icon-chevron');

        if (expand) {
            card.classList.add('active');
            answerWrap.style.maxHeight = answerWrap.scrollHeight + "px";
            if (icon) icon.style.transform = "rotate(180deg)";
        } else {
            card.classList.remove('active');
            answerWrap.style.maxHeight = "0";
            if (icon) icon.style.transform = "rotate(0deg)";
        }
    }

    toggleAll(expand) {
        this.elements.container.querySelectorAll('.faq-card').forEach(card => {
            this.toggleItem(card, expand);
        });
    }

    highlight(text) {
        if (!this.searchQuery) return text;
        const regex = new RegExp(`(${this.searchQuery})`, 'gi');
        return text.replace(regex, '<mark class="highlight">$1</mark>');
    }

    handleUrlAnchor() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            setTimeout(() => {
                const target = document.getElementById(hash);
                if (target) {
                    target.classList.add('active');
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
        }
    }

    showError(customMessage = null) {
        const defaultMsg = this.lang === 'en' ? 'Failed to load FAQ data.' : '无法加载 FAQ 数据，请确保数据文件完整。';
        const msg = customMessage || defaultMsg;
        this.elements.container.innerHTML = `
            <div class="no-results">
                <i data-lucide="alert-circle" class="w-12 h-12 text-red-500 mx-auto mb-4"></i>
                <p class="text-slate-500 text-center max-w-lg mx-auto">${msg}</p>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    }

    render() {
        this.elements.statsCount.innerText = this.filteredData.length;

        if (this.filteredData.length === 0) {
            const msg = this.lang === 'en' ? 'No related questions found' : '未找到相关问题';
            this.elements.container.innerHTML = `
                <div class="no-results">
                    <i data-lucide="search-x" class="w-12 h-12 text-slate-300 mx-auto mb-4"></i>
                    <p class="text-slate-500 text-lg">${msg}</p>
                </div>
            `;
        } else {
            this.elements.container.innerHTML = this.filteredData.map(item => `
                <div class="faq-card group" id="${item.id}">
                    <button class="faq-question-trigger w-full text-left p-6 md:p-8 flex items-start justify-between gap-6" aria-expanded="false">
                        <div class="flex-grow">
                            <div class="flex items-center gap-3 mb-2">
                                <span class="text-brand-500 font-black text-[10px] tracking-[0.2em] uppercase opacity-70">Question</span>
                                <span class="w-1 h-1 rounded-full bg-brand-200"></span>
                                <span class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">${item.category}</span>
                            </div>
                            <h3 class="text-lg md:text-xl font-bold text-slate-900 leading-snug">
                                ${this.highlight(item.question)}
                            </h3>
                        </div>
                        <div class="faq-plus-icon shrink-0 w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-600 transition-all duration-300">
                            <i data-lucide="chevron-down" class="w-5 h-5 icon-chevron"></i>
                        </div>
                    </button>

                    <div class="faq-answer-wrap overflow-hidden transition-all duration-500 ease-in-out" style="max-height: 0;">
                        <div class="px-6 md:px-8 pb-8 pt-0">
                            <div class="h-px w-full bg-slate-100 mb-6"></div>
                            <div class="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium">
                                ${this.formatAnswer(item.answer)}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        if (window.lucide) window.lucide.createIcons();
    }

    formatAnswer(text) {
        // Simple markdown-like formatting for links, code, and lists
        let formatted = this.highlight(text);
        
        // Code blocks
        formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-brand-600 font-mono text-sm">$1</code>');
        
        // Lists
        if (formatted.includes('\n')) {
            const lines = formatted.split('\n');
            formatted = lines.map(line => {
                if (/^\d+\./.test(line)) {
                    return `<div class="flex gap-2 mb-2"><span class="font-bold text-brand-500">${line.split('.')[0]}.</span><span>${line.split('.').slice(1).join('.')}</span></div>`;
                }
                return `<p class="mb-4">${line}</p>`;
            }).join('');
        }

        return formatted;
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    const config = window.FAQ_CONFIG || {};
    window.gpumdFaq = new GPUMDFaq(config);
});
