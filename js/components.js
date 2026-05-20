const Components = {
    header: (showLoginButton = true) => `
<header class="site-header">
    <a href="index.html" class="site-logo">
        <i class="bi bi-hospital-fill text-primary" style="margin-right: 0.5rem;"></i> 復健紀錄系統
    </a>
    <nav>
        ${showLoginButton ? `
        <a href="login.html" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem; display: inline-flex; align-items: center; gap: 0.35rem;">
            <i class="bi bi-box-arrow-in-right"></i> 登入
        </a>
        ` : ''}
    </nav>
</header>`,

    footer: `
<footer class="site-footer">
    <div class="container footer-content">
        <div class="footer-links">
            <a href="javascript:void(0)" onclick="openLegalModal('disclaimer')">免責聲明</a>
            <a href="javascript:void(0)" onclick="openLegalModal('privacy')">隱私權政策</a>
        </div>
        <div class="copyright">© 2026 復健紀錄系統. All Rights Reserved.</div>
    </div>
</footer>`,

    legalModal: `
<div id="legalModal" class="modal legal-modal">
    <div class="modal-content">
        <span class="close" onclick="closeLegalModal()" style="position: absolute; top: 1.5rem; right: 2rem; font-size: 2rem; cursor: pointer;">&times;</span>
        <h3 id="legalModalTitle" style="margin-bottom: 1.5rem; color: var(--primary-color); display: flex; align-items: center; gap: 0.5rem;"></h3>
        <div id="legalModalBody" class="legal-text"></div>
        <div style="margin-top: 2rem; text-align: right;">
            <button class="btn btn-primary" onclick="closeLegalModal()">關閉</button>
        </div>
    </div>
</div>`,

    toastContainer: `<div id="toastContainer" class="toast-container"></div>`,

    posterModal: `
<div id="posterModal" class="modal poster-modal" onclick="closePosterModal()">
    <div class="poster-modal-inner" onclick="event.stopPropagation()">
        <button class="poster-close-btn" onclick="closePosterModal()"><i class="bi bi-x-lg"></i></button>
        <p id="posterModalTitle" style="text-align:center; font-weight:600; margin-bottom:1rem; color:var(--primary-color); font-size:1rem;"></p>
        <img id="posterModalImg" src="" alt="復健海報" style="max-width:100%; max-height:80vh; border-radius:0.75rem; display:block; margin:0 auto;">
    </div>
</div>`,

    simpleHeader: `
<div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 2rem;">
    <i class="bi bi-hospital-fill text-primary"></i> 復健紀錄系統
</div>`,

    adminHeader: (adminName = '管理員') => `
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
    <h2 style="margin:0; text-align:left; display: flex; align-items: center; gap: 0.5rem; font-size: 1.5rem;">
        <i class="bi bi-hospital-fill text-primary"></i> 復健紀錄系統 - 後台管理
    </h2>
    <div style="display: flex; gap: 1rem; align-items: center;">
        <span id="adminName" style="color: var(--text-secondary); font-size: 0.875rem; font-weight:600; display: inline-flex; align-items: center; gap: 0.25rem;">
            <i class="bi bi-person-workspace text-primary"></i> ${adminName}
        </span>
        <button onclick="logout()" class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.825rem; display: inline-flex; align-items: center; gap: 0.25rem;">
            <i class="bi bi-box-arrow-right"></i> 登出
        </button>
    </div>
</div>`,

    adminTabs: `
<div class="tabs">
    <button class="tab active" data-tab="account-mgmt" style="display: inline-flex; align-items: center; gap: 0.35rem;">
        <i class="bi bi-people-fill"></i> 帳號管理
    </button>
    <button class="tab" data-tab="data-analysis" style="display: inline-flex; align-items: center; gap: 0.35rem;">
        <i class="bi bi-bar-chart-line-fill"></i> 數據分析
    </button>
</div>`,

    adminFooter: `
<div class="footer">
    <p>復健紀錄系統 V1.0.0</p>
</div>`
};

function renderComponent(componentId, componentFn, ...args) {
    const container = document.getElementById(componentId);
    if (container) {
        container.innerHTML = typeof componentFn === 'function' ? componentFn(...args) : componentFn;
    }
}

function initComponents(config = {}) {
    const {
        header = true,
        headerOptions = {},
        footer = true,
        legalModal = true,
        toastContainer = true,
        posterModal = false,
        adminHeader = false,
        adminHeaderOptions = {},
        adminTabs = false,
        adminFooter = false
    } = config;

    if (header) renderComponent('header-component', Components.header, headerOptions.showLoginButton !== false);
    if (footer) renderComponent('footer-component', Components.footer);
    if (legalModal) renderComponent('legal-modal-component', Components.legalModal);
    if (toastContainer) renderComponent('toast-container-component', Components.toastContainer);
    if (posterModal) renderComponent('poster-modal-component', Components.posterModal);
    if (adminHeader) renderComponent('admin-header-component', Components.adminHeader, adminHeaderOptions.adminName);
    if (adminTabs) renderComponent('admin-tabs-component', Components.adminTabs);
    if (adminFooter) renderComponent('admin-footer-component', Components.adminFooter);
}

const CommonScripts = {
    legalContent: {
        disclaimer: {
            title: '<i class="bi bi-file-earmark-text-fill text-primary" style="margin-right: 0.5rem;"></i> 免責聲明',
            body: `
                <h4>1. 系統用途</h4>
                <p>本系統提供復健紀錄與追蹤輔助，不能取代專業醫療診斷或治療建議。</p>
                <h4>2. 資料正確性</h4>
                <p>請依實際狀況填寫紀錄，若症狀惡化或有疑慮，請聯絡醫療人員。</p>
            `
        },
        privacy: {
            title: '<i class="bi bi-shield-fill-check text-primary" style="margin-right: 0.5rem;"></i> 隱私權政策',
            body: `
                <h4>1. 資料蒐集</h4>
                <p>系統會保存帳號資料與復健紀錄，用於後台管理與治療追蹤。</p>
                <h4>2. 資料保存</h4>
                <p>資料儲存在指定的 Google Sheets，請確認分享權限只開放給必要人員。</p>
            `
        }
    },

    openLegalModal(type) {
        const content = this.legalContent[type];
        if (!content) return;
        document.getElementById('legalModalTitle').innerHTML = content.title;
        document.getElementById('legalModalBody').innerHTML = content.body;
        document.getElementById('legalModal').style.display = 'flex';
    },

    closeLegalModal() {
        document.getElementById('legalModal').style.display = 'none';
    },

    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.transition = 'all 0.4s ease';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }
};

window.openLegalModal = (type) => CommonScripts.openLegalModal(type);
window.closeLegalModal = () => CommonScripts.closeLegalModal();
window.showToast = (message, type) => CommonScripts.showToast(message, type);

window.addEventListener('click', function(event) {
    const modal = document.getElementById('legalModal');
    if (modal && event.target === modal) CommonScripts.closeLegalModal();
});
