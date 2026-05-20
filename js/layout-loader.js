/**
 * Layout Loader - 動態載入組件與佈局
 * 用於純靜態 HTML 專案的組件化架構
 */

class LayoutLoader {
    constructor() {
        this.componentsPath = 'components/';
        this.layoutsPath = 'layouts/';
        this.components = {};
    }

    /**
     * 載入組件 HTML
     */
    async loadComponent(name) {
        if (this.components[name]) {
            return this.components[name];
        }

        try {
            const response = await fetch(`${this.componentsPath}${name}.html`);
            if (!response.ok) throw new Error(`Failed to load component: ${name}`);
            const html = await response.text();
            this.components[name] = html;
            return html;
        } catch (error) {
            console.error(`Error loading component ${name}:`, error);
            return '';
        }
    }

    /**
     * 載入佈局 HTML
     */
    async loadLayout(name) {
        try {
            const response = await fetch(`${this.layoutsPath}${name}.html`);
            if (!response.ok) throw new Error(`Failed to load layout: ${name}`);
            return await response.text();
        } catch (error) {
            console.error(`Error loading layout ${name}:`, error);
            return '';
        }
    }

    /**
     * 替換佔位符
     */
    replacePlaceholders(template, replacements) {
        let result = template;
        for (const [key, value] of Object.entries(replacements)) {
            const pattern = new RegExp(`<!-- ${key } -->[\\s\\S]*?<!-- /${key } -->`, 'g');
            result = result.replace(pattern, value || '');
        }
        return result;
    }

    /**
     * 渲染頁面
     */
    async render(config) {
        const {
            layout,
            title,
            components = [],
            content = '',
            pageScripts = '',
            options = {}
        } = config;

        // 載入佈局
        const layoutHtml = await this.loadLayout(layout);
        
        // 載入組件
        const componentHtmls = {};
        for (const componentName of components) {
            componentHtmls[componentName.toUpperCase()] = await this.loadComponent(componentName);
        }

        // 準備替換內容
        const replacements = {
            PAGE_TITLE: title || '',
            CONTENT: content,
            PAGE_SCRIPTS: pageScripts,
            ...componentHtmls,
            CHART_JS: options.includeChartJs ? '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>' : '',
            POSTER_MODAL: options.includePosterModal ? componentHtmls['POSTER_MODAL'] || '' : '',
            FOOTER: componentHtmls['FOOTER'] || '',
            LEGAL_MODAL: componentHtmls['LEGAL_MODAL'] || '',
            TOAST_CONTAINER: componentHtmls['TOAST_CONTAINER'] || ''
        };

        // 替換佔位符
        let finalHtml = this.replacePlaceholders(layoutHtml, replacements);

        // 寫入到 body
        document.body.innerHTML = finalHtml;

        // 執行頁面腳本
        if (pageScripts) {
            const script = document.createElement('script');
            script.textContent = pageScripts;
            document.body.appendChild(script);
        }
    }
}

// 全域實例
const layoutLoader = new LayoutLoader();
