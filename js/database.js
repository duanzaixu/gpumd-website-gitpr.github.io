/**
 * NEP Force Field Database Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // State
    const state = {
        forceFields: [],
        filteredFields: [],
        selectedElements: new Set(),
        searchQuery: '',
        currentPage: 1,
        itemsPerPage: 9,
        isLoading: true
    };

    // Elements
    const elementsData = [
        { symbol: 'H', name: 'Hydrogen', atomic: 1, mass: 1.008, group: 1, period: 1, category: 'nonmetal' },
        { symbol: 'He', name: 'Helium', atomic: 2, mass: 4.0026, group: 18, period: 1, category: 'noble-gas' },
        { symbol: 'Li', name: 'Lithium', atomic: 3, mass: 6.94, group: 1, period: 2, category: 'alkali-metal' },
        { symbol: 'Be', name: 'Beryllium', atomic: 4, mass: 9.0122, group: 2, period: 2, category: 'alkaline-earth' },
        { symbol: 'B', name: 'Boron', atomic: 5, mass: 10.81, group: 13, period: 2, category: 'metalloid' },
        { symbol: 'C', name: 'Carbon', atomic: 6, mass: 12.011, group: 14, period: 2, category: 'nonmetal' },
        { symbol: 'N', name: 'Nitrogen', atomic: 7, mass: 14.007, group: 15, period: 2, category: 'nonmetal' },
        { symbol: 'O', name: 'Oxygen', atomic: 8, mass: 15.999, group: 16, period: 2, category: 'nonmetal' },
        { symbol: 'F', name: 'Fluorine', atomic: 9, mass: 18.998, group: 17, period: 2, category: 'halogen' },
        { symbol: 'Ne', name: 'Neon', atomic: 10, mass: 20.180, group: 18, period: 2, category: 'noble-gas' },
        { symbol: 'Na', name: 'Sodium', atomic: 11, mass: 22.990, group: 1, period: 3, category: 'alkali-metal' },
        { symbol: 'Mg', name: 'Magnesium', atomic: 12, mass: 24.305, group: 2, period: 3, category: 'alkaline-earth' },
        { symbol: 'Al', name: 'Aluminum', atomic: 13, mass: 26.982, group: 13, period: 3, category: 'post-transition' },
        { symbol: 'Si', name: 'Silicon', atomic: 14, mass: 28.085, group: 14, period: 3, category: 'metalloid' },
        { symbol: 'P', name: 'Phosphorus', atomic: 15, mass: 30.974, group: 15, period: 3, category: 'nonmetal' },
        { symbol: 'S', name: 'Sulfur', atomic: 16, mass: 32.06, group: 16, period: 3, category: 'nonmetal' },
        { symbol: 'Cl', name: 'Chlorine', atomic: 17, mass: 35.45, group: 17, period: 3, category: 'halogen' },
        { symbol: 'Ar', name: 'Argon', atomic: 18, mass: 39.948, group: 18, period: 3, category: 'noble-gas' },
        { symbol: 'K', name: 'Potassium', atomic: 19, mass: 39.098, group: 1, period: 4, category: 'alkali-metal' },
        { symbol: 'Ca', name: 'Calcium', atomic: 20, mass: 40.078, group: 2, period: 4, category: 'alkaline-earth' },
        { symbol: 'Sc', name: 'Scandium', atomic: 21, mass: 44.956, group: 3, period: 4, category: 'transition' },
        { symbol: 'Ti', name: 'Titanium', atomic: 22, mass: 47.867, group: 4, period: 4, category: 'transition' },
        { symbol: 'V', name: 'Vanadium', atomic: 23, mass: 50.942, group: 5, period: 4, category: 'transition' },
        { symbol: 'Cr', name: 'Chromium', atomic: 24, mass: 51.996, group: 6, period: 4, category: 'transition' },
        { symbol: 'Mn', name: 'Manganese', atomic: 25, mass: 54.938, group: 7, period: 4, category: 'transition' },
        { symbol: 'Fe', name: 'Iron', atomic: 26, mass: 55.845, group: 8, period: 4, category: 'transition' },
        { symbol: 'Co', name: 'Cobalt', atomic: 27, mass: 58.933, group: 9, period: 4, category: 'transition' },
        { symbol: 'Ni', name: 'Nickel', atomic: 28, mass: 58.693, group: 10, period: 4, category: 'transition' },
        { symbol: 'Cu', name: 'Copper', atomic: 29, mass: 63.546, group: 11, period: 4, category: 'transition' },
        { symbol: 'Zn', name: 'Zinc', atomic: 30, mass: 65.38, group: 12, period: 4, category: 'transition' },
        { symbol: 'Ga', name: 'Gallium', atomic: 31, mass: 69.723, group: 13, period: 4, category: 'post-transition' },
        { symbol: 'Ge', name: 'Germanium', atomic: 32, mass: 72.63, group: 14, period: 4, category: 'metalloid' },
        { symbol: 'As', name: 'Arsenic', atomic: 33, mass: 74.922, group: 15, period: 4, category: 'metalloid' },
        { symbol: 'Se', name: 'Selenium', atomic: 34, mass: 78.96, group: 16, period: 4, category: 'nonmetal' },
        { symbol: 'Br', name: 'Bromine', atomic: 35, mass: 79.904, group: 17, period: 4, category: 'halogen' },
        { symbol: 'Kr', name: 'Krypton', atomic: 36, mass: 83.798, group: 18, period: 4, category: 'noble-gas' },
        { symbol: 'Rb', name: 'Rubidium', atomic: 37, mass: 85.468, group: 1, period: 5, category: 'alkali-metal' },
        { symbol: 'Sr', name: 'Strontium', atomic: 38, mass: 87.62, group: 2, period: 5, category: 'alkaline-earth' },
        { symbol: 'Y', name: 'Yttrium', atomic: 39, mass: 88.906, group: 3, period: 5, category: 'transition' },
        { symbol: 'Zr', name: 'Zirconium', atomic: 40, mass: 91.224, group: 4, period: 5, category: 'transition' },
        { symbol: 'Nb', name: 'Niobium', atomic: 41, mass: 92.906, group: 5, period: 5, category: 'transition' },
        { symbol: 'Mo', name: 'Molybdenum', atomic: 42, mass: 95.95, group: 6, period: 5, category: 'transition' },
        { symbol: 'Tc', name: 'Technetium', atomic: 43, mass: 98, group: 7, period: 5, category: 'transition' },
        { symbol: 'Ru', name: 'Ruthenium', atomic: 44, mass: 101.07, group: 8, period: 5, category: 'transition' },
        { symbol: 'Rh', name: 'Rhodium', atomic: 45, mass: 102.91, group: 9, period: 5, category: 'transition' },
        { symbol: 'Pd', name: 'Palladium', atomic: 46, mass: 106.42, group: 10, period: 5, category: 'transition' },
        { symbol: 'Ag', name: 'Silver', atomic: 47, mass: 107.87, group: 11, period: 5, category: 'transition' },
        { symbol: 'Cd', name: 'Cadmium', atomic: 48, mass: 112.41, group: 12, period: 5, category: 'transition' },
        { symbol: 'In', name: 'Indium', atomic: 49, mass: 114.82, group: 13, period: 5, category: 'post-transition' },
        { symbol: 'Sn', name: 'Tin', atomic: 50, mass: 118.71, group: 14, period: 5, category: 'post-transition' },
        { symbol: 'Sb', name: 'Antimony', atomic: 51, mass: 121.76, group: 15, period: 5, category: 'metalloid' },
        { symbol: 'Te', name: 'Tellurium', atomic: 52, mass: 127.60, group: 16, period: 5, category: 'metalloid' },
        { symbol: 'I', name: 'Iodine', atomic: 53, mass: 126.90, group: 17, period: 5, category: 'halogen' },
        { symbol: 'Xe', name: 'Xenon', atomic: 54, mass: 131.29, group: 18, period: 5, category: 'noble-gas' },
        { symbol: 'Cs', name: 'Cesium', atomic: 55, mass: 132.91, group: 1, period: 6, category: 'alkali-metal' },
        { symbol: 'Ba', name: 'Barium', atomic: 56, mass: 137.33, group: 2, period: 6, category: 'alkaline-earth' },
        { symbol: 'La', name: 'Lanthanum', atomic: 57, mass: 138.91, group: 3, period: 6, category: 'lanthanide' },
        { symbol: 'Ce', name: 'Cerium', atomic: 58, mass: 140.12, group: 3, period: 6, category: 'lanthanide' },
        { symbol: 'Pr', name: 'Praseodymium', atomic: 59, mass: 140.91, group: 3, period: 6, category: 'lanthanide' },
        { symbol: 'Nd', name: 'Neodymium', atomic: 60, mass: 144.24, group: 3, period: 6, category: 'lanthanide' },
        { symbol: 'Pm', name: 'Promethium', atomic: 61, mass: 145, group: 3, period: 6, category: 'lanthanide' },
        { symbol: 'Sm', name: 'Samarium', atomic: 62, mass: 150.36, group: 3, period: 6, category: 'lanthanide' },
        { symbol: 'Eu', name: 'Europium', atomic: 63, mass: 151.96, group: 3, period: 6, category: 'lanthanide' },
        { symbol: 'Gd', name: 'Gadolinium', atomic: 64, mass: 157.25, group: 3, period: 6, category: 'lanthanide' },
        { symbol: 'Tb', name: 'Terbium', atomic: 65, mass: 158.93, group: 3, period: 6, category: 'lanthanide' },
        { symbol: 'Dy', name: 'Dysprosium', atomic: 66, mass: 162.50, group: 3, period: 6, category: 'lanthanide' },
        { symbol: 'Ho', name: 'Holmium', atomic: 67, mass: 164.93, group: 3, period: 6, category: 'lanthanide' },
        { symbol: 'Er', name: 'Erbium', atomic: 68, mass: 167.26, group: 3, period: 6, category: 'lanthanide' },
        { symbol: 'Tm', name: 'Thulium', atomic: 69, mass: 168.93, group: 3, period: 6, category: 'lanthanide' },
        { symbol: 'Yb', name: 'Ytterbium', atomic: 70, mass: 173.05, group: 3, period: 6, category: 'lanthanide' },
        { symbol: 'Lu', name: 'Lutetium', atomic: 71, mass: 174.97, group: 3, period: 6, category: 'lanthanide' },
        { symbol: 'Hf', name: 'Hafnium', atomic: 72, mass: 178.49, group: 4, period: 6, category: 'transition' },
        { symbol: 'Ta', name: 'Tantalum', atomic: 73, mass: 180.95, group: 5, period: 6, category: 'transition' },
        { symbol: 'W', name: 'Tungsten', atomic: 74, mass: 183.84, group: 6, period: 6, category: 'transition' },
        { symbol: 'Re', name: 'Rhenium', atomic: 75, mass: 186.21, group: 7, period: 6, category: 'transition' },
        { symbol: 'Os', name: 'Osmium', atomic: 76, mass: 190.23, group: 8, period: 6, category: 'transition' },
        { symbol: 'Ir', name: 'Iridium', atomic: 77, mass: 192.22, group: 9, period: 6, category: 'transition' },
        { symbol: 'Pt', name: 'Platinum', atomic: 78, mass: 195.08, group: 10, period: 6, category: 'transition' },
        { symbol: 'Au', name: 'Gold', atomic: 79, mass: 196.97, group: 11, period: 6, category: 'transition' },
        { symbol: 'Hg', name: 'Mercury', atomic: 80, mass: 200.59, group: 12, period: 6, category: 'transition' },
        { symbol: 'Tl', name: 'Thallium', atomic: 81, mass: 204.38, group: 13, period: 6, category: 'post-transition' },
        { symbol: 'Pb', name: 'Lead', atomic: 82, mass: 207.2, group: 14, period: 6, category: 'post-transition' },
        { symbol: 'Bi', name: 'Bismuth', atomic: 83, mass: 208.98, group: 15, period: 6, category: 'post-transition' },
        { symbol: 'Po', name: 'Polonium', atomic: 84, mass: 209, group: 16, period: 6, category: 'post-transition' },
        { symbol: 'At', name: 'Astatine', atomic: 85, mass: 210, group: 17, period: 6, category: 'halogen' },
        { symbol: 'Rn', name: 'Radon', atomic: 86, mass: 222, group: 18, period: 6, category: 'noble-gas' },
        { symbol: 'Fr', name: 'Francium', atomic: 87, mass: 223, group: 1, period: 7, category: 'alkali-metal' },
        { symbol: 'Ra', name: 'Radium', atomic: 88, mass: 226, group: 2, period: 7, category: 'alkaline-earth' },
        { symbol: 'Ac', name: 'Actinium', atomic: 89, mass: 227, group: 3, period: 7, category: 'actinide' },
        { symbol: 'Th', name: 'Thorium', atomic: 90, mass: 232.04, group: 3, period: 7, category: 'actinide' },
        { symbol: 'Pa', name: 'Protactinium', atomic: 91, mass: 231.04, group: 3, period: 7, category: 'actinide' },
        { symbol: 'U', name: 'Uranium', atomic: 92, mass: 238.03, group: 3, period: 7, category: 'actinide' },
        { symbol: 'Np', name: 'Neptunium', atomic: 93, mass: 237, group: 3, period: 7, category: 'actinide' },
        { symbol: 'Pu', name: 'Plutonium', atomic: 94, mass: 244, group: 3, period: 7, category: 'actinide' },
        { symbol: 'Am', name: 'Americium', atomic: 95, mass: 243, group: 3, period: 7, category: 'actinide' },
        { symbol: 'Cm', name: 'Curium', atomic: 96, mass: 247, group: 3, period: 7, category: 'actinide' },
        { symbol: 'Bk', name: 'Berkelium', atomic: 97, mass: 247, group: 3, period: 7, category: 'actinide' },
        { symbol: 'Cf', name: 'Californium', atomic: 98, mass: 251, group: 3, period: 7, category: 'actinide' },
        { symbol: 'Es', name: 'Einsteinium', atomic: 99, mass: 252, group: 3, period: 7, category: 'actinide' },
        { symbol: 'Fm', name: 'Fermium', atomic: 100, mass: 257, group: 3, period: 7, category: 'actinide' },
        { symbol: 'Md', name: 'Mendelevium', atomic: 101, mass: 258, group: 3, period: 7, category: 'actinide' },
        { symbol: 'No', name: 'Nobelium', atomic: 102, mass: 259, group: 3, period: 7, category: 'actinide' },
        { symbol: 'Lr', name: 'Lawrencium', atomic: 103, mass: 262, group: 3, period: 7, category: 'actinide' },
        { symbol: 'Rf', name: 'Rutherfordium', atomic: 104, mass: 267, group: 4, period: 7, category: 'transition' },
        { symbol: 'Db', name: 'Dubnium', atomic: 105, mass: 268, group: 5, period: 7, category: 'transition' },
        { symbol: 'Sg', name: 'Seaborgium', atomic: 106, mass: 271, group: 6, period: 7, category: 'transition' },
        { symbol: 'Bh', name: 'Bohrium', atomic: 107, mass: 272, group: 7, period: 7, category: 'transition' },
        { symbol: 'Hs', name: 'Hassium', atomic: 108, mass: 270, group: 8, period: 7, category: 'transition' },
        { symbol: 'Mt', name: 'Meitnerium', atomic: 109, mass: 276, group: 9, period: 7, category: 'transition' },
        { symbol: 'Ds', name: 'Darmstadtium', atomic: 110, mass: 281, group: 10, period: 7, category: 'transition' },
        { symbol: 'Rg', name: 'Roentgenium', atomic: 111, mass: 280, group: 11, period: 7, category: 'transition' },
        { symbol: 'Cn', name: 'Copernicium', atomic: 112, mass: 285, group: 12, period: 7, category: 'transition' },
        { symbol: 'Nh', name: 'Nihonium', atomic: 113, mass: 284, group: 13, period: 7, category: 'post-transition' },
        { symbol: 'Fl', name: 'Flerovium', atomic: 114, mass: 289, group: 14, period: 7, category: 'post-transition' },
        { symbol: 'Mc', name: 'Moscovium', atomic: 115, mass: 288, group: 15, period: 7, category: 'post-transition' },
        { symbol: 'Lv', name: 'Livermorium', atomic: 116, mass: 293, group: 16, period: 7, category: 'post-transition' },
        { symbol: 'Ts', name: 'Tennessine', atomic: 117, mass: 294, group: 17, period: 7, category: 'halogen' },
        { symbol: 'Og', name: 'Oganesson', atomic: 118, mass: 294, group: 18, period: 7, category: 'noble-gas' }
    ];

    // Initialize
    const translations = {
        'zh-CN': {
            loadError: '加载数据失败，请刷新页面重试。',
            clearAll: '清除全部',
            noMatches: '未找到匹配的力场',
            suggestions: '建议：',
            suggestion1: '• 尝试减少选中的元素数量',
            suggestion2: '• 检查化学式拼写是否正确 (如: Li-La-Zr-O)',
            suggestion3: '• 尝试搜索更通用的术语',
            clearFilters: '清除所有筛选',
            pathError: '未找到该力场文件的路径配置。',
            download404: '抱歉，该力场文件暂时无法下载 (404 Not Found)。',
            networkError: '下载请求失败，请检查网络连接。',
            more: '更多'
        },
        'en': {
            loadError: 'Failed to load data, please refresh and try again.',
            clearAll: 'Clear All',
            noMatches: 'No matching force fields found',
            suggestions: 'Suggestions:',
            suggestion1: '• Try selecting fewer elements',
            suggestion2: '• Check chemical formula spelling (e.g., Li-La-Zr-O)',
            suggestion3: '• Try broader search terms',
            clearFilters: 'Clear all filters',
            pathError: 'Configuration path for this force field file not found.',
            download404: 'Sorry, this force field file is currently unavailable (404 Not Found).',
            networkError: 'Download request failed, please check your network connection.',
            more: 'More'
        }
    };

    function t(key) {
        const lang = document.documentElement.lang || 'zh-CN';
        return (translations[lang] || translations['zh-CN'])[key];
    }

    async function init() {
        try {
            initModal();
            renderPeriodicTable();
            await fetchForceFields();
            setupEventListeners();
            filterAndRender();
        } catch (error) {
            console.error('Initialization error:', error);
            showError(t('loadError'));
        }
    }

    // Fetch data from JSON
    async function fetchForceFields() {
        try {
            const response = await fetch('data/force_fields.json');
            const data = await response.json();
            state.forceFields = data.force_fields;
            state.isLoading = false;
        } catch (error) {
            console.error('Error fetching force fields:', error);
            state.isLoading = false;
            throw error;
        }
    }

    // Render Periodic Table
    function renderPeriodicTable() {
        const container = document.getElementById('periodic-table-container');
        if (!container) return;

        container.innerHTML = '';
        const grid = document.createElement('div');
        grid.className = 'periodic-table-grid';

        // 1. Add Group Numbers (Roman Numerals: IA-VIIIA)
        const groupLabels = [
            'IA', 'IIA', 'IIIB', 'IVB', 'VB', 'VIB', 'VIIB', 
            'VIII', 'VIII', 'VIII', 
            'IB', 'IIB', 'IIIA', 'IVA', 'VA', 'VIA', 'VIIA', '0'
        ];
        for (let i = 1; i <= 18; i++) {
            const groupLabel = document.createElement('div');
            groupLabel.className = 'flex items-end justify-center pb-2 text-[10px] lg:text-xs font-bold text-slate-400 select-none font-serif';
            groupLabel.style.gridColumn = i;
            groupLabel.style.gridRow = 1;
            groupLabel.textContent = groupLabels[i - 1];
            grid.appendChild(groupLabel);
        }

        // 2. Add Placeholder Content in Empty Area (Rows 2-4, Cols 3-12)
        // Covers the gap in Period 1, 2, 3
        const placeholder = document.createElement('div');
        placeholder.className = 'flex flex-col items-center justify-center text-slate-200 pointer-events-none select-none';
        placeholder.style.gridColumn = '3 / span 10';
        placeholder.style.gridRow = '2 / span 3'; 
        placeholder.innerHTML = `
            <div class="relative w-full h-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30">
                <div class="flex items-center gap-4 mb-3">
                    <i data-lucide="database" class="w-12 h-12 text-slate-300"></i>
                    <span class="text-4xl font-black text-slate-300 tracking-widest">NEP Database</span>
                </div>
                <div class="text-sm font-bold text-slate-300 uppercase tracking-[0.3em]"></div>
            </div>
        `;
        grid.appendChild(placeholder);

        // 3. Render Elements
        elementsData.forEach(el => {
            const cell = document.createElement('div');
            cell.className = `element-cell ${el.category}`;
            cell.dataset.symbol = el.symbol;
            cell.style.gridColumn = el.group;
            cell.style.gridRow = el.period + 1; // Shift down by 1 row for group numbers

            // Handle Lanthanides and Actinides offset
            if (el.category === 'lanthanide') {
                cell.style.gridRow = 10; // 9 + 1
                cell.style.gridColumn = el.atomic - 57 + 3;
            } else if (el.category === 'actinide') {
                cell.style.gridRow = 11; // 10 + 1
                cell.style.gridColumn = el.atomic - 89 + 3;
            }

            cell.innerHTML = `
                <span class="atomic-number">${el.atomic}</span>
                <span class="symbol">${el.symbol}</span>
                <span class="name">${el.name}</span>
            `;

            cell.addEventListener('click', () => toggleElement(el.symbol));
            grid.appendChild(cell);
        });

        // Add special markers for Lanthanides and Actinides in main grid
        const lanthMarker = document.createElement('div');
        lanthMarker.className = 'element-cell marker';
        lanthMarker.style.gridColumn = 3;
        lanthMarker.style.gridRow = 7; // 6 + 1
        lanthMarker.innerHTML = '57-71<br>*';
        grid.appendChild(lanthMarker);

        const actinMarker = document.createElement('div');
        actinMarker.className = 'element-cell marker';
        actinMarker.style.gridColumn = 3;
        actinMarker.style.gridRow = 8; // 7 + 1
        actinMarker.innerHTML = '89-103<br>**';
        grid.appendChild(actinMarker);

        container.appendChild(grid);
        lucide.createIcons();
    }

    // Toggle Element Selection
    function toggleElement(symbol) {
        if (state.selectedElements.has(symbol)) {
            state.selectedElements.delete(symbol);
        } else {
            state.selectedElements.add(symbol);
        }
        updatePeriodicTableUI();
        updateSelectedElementsDisplay();
        filterAndRender();
    }

    function updatePeriodicTableUI() {
        document.querySelectorAll('.element-cell').forEach(cell => {
            const symbol = cell.dataset.symbol;
            if (state.selectedElements.has(symbol)) {
                cell.classList.add('selected');
            } else {
                cell.classList.remove('selected');
            }
        });
    }

    function updateSelectedElementsDisplay() {
        const container = document.getElementById('selected-elements-tags');
        if (!container) return;

        container.innerHTML = '';
        state.selectedElements.forEach(symbol => {
            const tag = document.createElement('span');
            tag.className = 'element-tag';
            tag.innerHTML = `${symbol} <i data-lucide="x" class="w-3 h-3 cursor-pointer"></i>`;
            tag.querySelector('i').addEventListener('click', (e) => {
                e.stopPropagation();
                toggleElement(symbol);
            });
            container.appendChild(tag);
        });
        
        if (state.selectedElements.size > 0) {
            const clearBtn = document.createElement('button');
            clearBtn.className = 'text-xs text-slate-400 hover:text-brand-600 ml-2 transition-colors';
            clearBtn.textContent = t('clearAll');
            clearBtn.onclick = clearAllSelections;
            container.appendChild(clearBtn);
        }
        
        lucide.createIcons();
    }

    function clearAllSelections() {
        state.selectedElements.clear();
        state.searchQuery = '';
        const searchInput = document.getElementById('element-search-input');
        if (searchInput) searchInput.value = '';
        updatePeriodicTableUI();
        updateSelectedElementsDisplay();
        filterAndRender();
    }

    // Filtering Logic
    function filterAndRender() {
        const queryElements = parseChemicalFormula(state.searchQuery);
        
        state.filteredFields = state.forceFields.filter(field => {
            // AND Logic: Match periodic table AND search query
            // 1. Periodic Table Selection (if any elements selected, field must contain ALL of them)
            const matchesPT = state.selectedElements.size === 0 || 
                [...state.selectedElements].every(el => field.elements.includes(el));
            
            // 2. Search Query (if query exists, field must match name OR elements)
            const matchesSearch = state.searchQuery.trim() === '' || 
                field.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                (queryElements.length > 0 && queryElements.every(el => field.elements.includes(el)));

            return matchesPT && matchesSearch;
        });

        state.currentPage = 1;
        renderResults();
        renderStats();
    }

    function parseChemicalFormula(formula) {
        if (!formula) return [];
        
        // 1. Try exact match (case-insensitive) for single element
        // This handles cases like "TI" -> "Ti", "ti" -> "Ti", "li" -> "Li"
        const cleanFormula = formula.trim();
        const exactMatch = elementsData.find(el => el.symbol.toLowerCase() === cleanFormula.toLowerCase());
        if (exactMatch) {
            return [exactMatch.symbol];
        }

        // Support formats like "Li-La-Zr-O", "Li La Zr O", or "LiLaZrO"
        let parts = [];
        if (formula.includes('-') || formula.includes(',') || formula.includes(' ')) {
            parts = formula.split(/[-,\s]+/);
        } else {
            // Try to split by capital letters (e.g., "LiLaZrO" -> ["Li", "La", "Zr", "O"])
            parts = formula.match(/[A-Z][a-z]*/g) || [formula];
        }

        return parts.filter(s => s.length > 0).map(s => {
            // Capitalize first letter, lowercase others (e.g., "li" -> "Li")
            return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
        }).filter(s => elementsData.some(el => el.symbol === s));
    }

    // Rendering Results
    function renderResults() {
        const container = document.getElementById('results-container');
        if (!container) return;

        if (state.isLoading) {
            renderSkeletons();
            return;
        }

        if (state.filteredFields.length === 0) {
            container.innerHTML = `
                <div class="col-span-full py-20 text-center">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4 text-slate-300">
                        <i data-lucide="search-x" class="w-8 h-8"></i>
                    </div>
                    <h3 class="text-lg font-medium text-slate-900">${t('noMatches')}</h3>
                    <p class="text-slate-500 mt-2">${t('suggestions')}</p>
                    <ul class="text-sm text-slate-400 mt-2 space-y-1">
                        <li>${t('suggestion1')}</li>
                        <li>${t('suggestion2')}</li>
                        <li>${t('suggestion3')}</li>
                    </ul>
                    <button onclick="clearAllSelections()" class="mt-6 px-6 py-2 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white transition-all font-bold">${t('clearFilters')}</button>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        const start = (state.currentPage - 1) * state.itemsPerPage;
        const end = start + state.itemsPerPage;
        const paginatedItems = state.filteredFields.slice(start, end);

        container.innerHTML = paginatedItems.map(field => {
            // Handle element display logic
            let elementsDisplay;
            const MAX_VISIBLE_ELEMENTS = 12; // Show max 12 individual tags
            const tagClass = "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200";
            
            if (field.elements.length <= MAX_VISIBLE_ELEMENTS) {
                // Normal display for reasonable number of elements
                elementsDisplay = field.elements.map(el => 
                    `<span class="${tagClass}">${el}</span>`
                ).join('');
            } else {
                // Grouped display for large number of elements
                const visibleElements = field.elements.slice(0, 10);
                const remainingCount = field.elements.length - 10;
                
                elementsDisplay = `
                    ${visibleElements.map(el => `<span class="${tagClass}">${el}</span>`).join('')}
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-brand-50 text-brand-600 border border-brand-200" title="${field.elements.slice(10).join(', ')}">
                        +${remainingCount} ${t('more')}
                    </span>
                `;
            }

            return `
            <div class="force-field-card group flex flex-col h-full bg-gradient-to-br from-white via-sky-50/30 to-sky-100/40 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-sky-200 hover:to-sky-50 transition-all duration-300 cursor-pointer relative overflow-hidden" onclick="openForceFieldModal('${field.id}')">
                
                <!-- Top-Right Decoration: Hexagon (Structure) -->
                <i data-lucide="hexagon" class="absolute -top-12 -right-12 w-48 h-48 text-sky-200/20 fill-sky-50/30 stroke-[0.5] group-hover:rotate-12 group-hover:scale-110 group-hover:text-sky-300/30 transition-all duration-700 pointer-events-none"></i>

                <!-- Bottom-Left Decoration: Box (Data) -->
                <i data-lucide="box" class="absolute -bottom-10 -left-10 w-40 h-40 text-indigo-200/20 fill-indigo-50/30 stroke-[0.5] group-hover:-rotate-12 group-hover:scale-110 group-hover:text-indigo-300/30 transition-all duration-700 pointer-events-none"></i>

                <!-- Header -->
                <div class="p-5 pb-3 relative z-10">
                    <div class="flex justify-between items-start gap-4 mb-2">
                        <h3 class="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-tight">
                            <span class="hover:underline decoration-2 decoration-brand-200 underline-offset-2">${field.name}</span>
                        </h3>
                        <span class="shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/60 backdrop-blur-sm px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                            ${field.created_date.split('-')[0]}
                        </span>
                    </div>
                    
                    <!-- Elements Tags -->
                    <div class="flex flex-wrap gap-1.5 mb-3">
                        ${elementsDisplay}
                    </div>
                </div>
                
                <!-- Content -->
                <div class="px-5 pb-4 flex-grow relative z-10">
                    <p class="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
                        ${field.intro}
                    </p>
                    
                    <div class="space-y-2">
                        <div class="flex items-start gap-2 text-xs text-slate-500">
                            <i data-lucide="users" class="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0"></i>
                            <span class="line-clamp-1">${field.authors.join(', ')}</span>
                        </div>
                        <div class="flex items-start gap-2 text-xs text-slate-500">
                            <i data-lucide="book-open" class="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0"></i>
                            <span class="line-clamp-1 italic">${field.publication.journal}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Footer -->
                <div class="px-5 py-3 border-t border-slate-50 bg-white/40 backdrop-blur-sm rounded-b-2xl mt-auto flex items-center justify-between gap-3 relative z-10">
                    <a href="https://doi.org/${field.publication.doi}" target="_blank" onclick="event.stopPropagation()"
                       class="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors group/link px-2 py-1.5 rounded hover:bg-white hover:shadow-sm">
                        <i data-lucide="link" class="w-3.5 h-3.5 group-hover/link:stroke-2"></i>
                        <span>DOI</span>
                    </a>
                    
                    <a href="${field.repository_url}" target="_blank" onclick="event.stopPropagation()"
                       class="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors group/link px-2 py-1.5 rounded hover:bg-white hover:shadow-sm">
                        <i data-lucide="github" class="w-3.5 h-3.5 group-hover/link:stroke-2"></i>
                        <span>Link</span>
                    </a>

                    <button onclick="event.stopPropagation(); handleNepDownload('${field.nep_file || ''}')"
                       class="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors group/link px-2 py-1.5 rounded hover:bg-white hover:shadow-sm">
                        <i data-lucide="download" class="w-3.5 h-3.5 group-hover/link:stroke-2"></i>
                        <span>nep.txt</span>
                    </button>
                </div>
            </div>
        `}).join('');

        renderPagination();
        lucide.createIcons();
    }

    function renderSkeletons() {
        const container = document.getElementById('results-container');
        container.innerHTML = Array(6).fill(0).map(() => `
            <div class="force-field-card animate-pulse">
                <div class="h-6 bg-slate-100 rounded w-3/4 mb-4"></div>
                <div class="flex gap-2 mb-4">
                    <div class="h-5 bg-slate-100 rounded w-10"></div>
                    <div class="h-5 bg-slate-100 rounded w-10"></div>
                </div>
                <div class="h-4 bg-slate-100 rounded w-full mb-2"></div>
                <div class="h-4 bg-slate-100 rounded w-5/6 mb-6"></div>
                <div class="pt-4 border-t border-slate-100 mt-auto">
                    <div class="h-3 bg-slate-100 rounded w-1/2 mb-2"></div>
                    <div class="h-3 bg-slate-100 rounded w-2/3"></div>
                </div>
            </div>
        `).join('');
    }

    function renderStats() {
        const countEl = document.getElementById('results-count');
        if (countEl) {
            countEl.textContent = state.filteredFields.length;
        }
    }

    function renderPagination() {
        const totalPages = Math.ceil(state.filteredFields.length / state.itemsPerPage);
        const container = document.getElementById('pagination-container');
        if (!container || totalPages <= 1) {
            if (container) container.innerHTML = '';
            return;
        }

        let html = `
            <div class="flex items-center justify-center gap-2 mt-12">
                <button ${state.currentPage === 1 ? 'disabled' : ''} 
                    onclick="changePage(${state.currentPage - 1})"
                    class="p-2 rounded-lg border border-slate-200 hover:border-brand-500 disabled:opacity-30 disabled:hover:border-slate-200 transition-colors">
                    <i data-lucide="chevron-left" class="w-5 h-5"></i>
                </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            html += `
                <button onclick="changePage(${i})"
                    class="w-10 h-10 rounded-lg border ${state.currentPage === i ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-200 hover:border-brand-500 text-slate-600'} transition-all font-medium">
                    ${i}
                </button>
            `;
        }

        html += `
                <button ${state.currentPage === totalPages ? 'disabled' : ''} 
                    onclick="changePage(${state.currentPage + 1})"
                    class="p-2 rounded-lg border border-slate-200 hover:border-brand-500 disabled:opacity-30 disabled:hover:border-slate-200 transition-colors">
                    <i data-lucide="chevron-right" class="w-5 h-5"></i>
                </button>
            </div>
        `;

        container.innerHTML = html;
        lucide.createIcons();
    }

    window.changePage = (page) => {
        state.currentPage = page;
        renderResults();
        window.scrollTo({ top: document.getElementById('results-section').offsetTop - 100, behavior: 'smooth' });
    };

    // Event Listeners
    function setupEventListeners() {
        const searchInput = document.getElementById('element-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                state.searchQuery = e.target.value;
                
                // Reverse sync: Search box -> Periodic Table
                const parsedElements = parseChemicalFormula(state.searchQuery);
                // Only update selection if the query looks like a formula (contains elements)
                if (parsedElements.length > 0 || state.searchQuery === '') {
                    state.selectedElements = new Set(parsedElements);
                    updatePeriodicTableUI();
                    updateSelectedElementsDisplay();
                }

                updateSuggestions(e.target.value);
                filterAndRender();
            }, 50)); // <100ms latency requirement

            // Hide suggestions on click outside
            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target)) {
                    hideSuggestions();
                }
            });
        }

        // Search Button
        const searchBtn = document.getElementById('search-btn');
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => {
                state.searchQuery = searchInput.value;
                filterAndRender();
            });
        }

        // Mobile menu toggle
        const menuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }

    function updateSuggestions(query) {
        if (!query || query.length < 1) {
            hideSuggestions();
            return;
        }

        // Suggest based on force field names or element symbols
        const suggestions = [];
        
        // 1. Element matches
        const matchedElements = elementsData.filter(el => 
            el.symbol.toLowerCase().startsWith(query.toLowerCase()) || 
            el.name.toLowerCase().startsWith(query.toLowerCase())
        ).slice(0, 5);
        
        matchedElements.forEach(el => suggestions.push({ type: 'element', value: el.symbol, label: `${el.symbol} (${el.name})` }));

        // 2. Force field name or contained elements matches
        const matchedFields = state.forceFields.filter(f => {
            // Match name
            const nameMatch = f.name.toLowerCase().includes(query.toLowerCase());
            // Match contained elements
            const elementMatch = f.elements.some(el => 
                el.toLowerCase() === query.toLowerCase()
            );
            return nameMatch || elementMatch;
        }).slice(0, 5);
        
        matchedFields.forEach(f => {
            const elementsHtml = f.elements.map(el => 
                `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 ml-1">${el}</span>`
            ).join('');
            
            suggestions.push({ 
                type: 'field', 
                value: f.name, 
                label: `<span class="mr-2">${f.name}</span><div class="flex flex-wrap gap-1">${elementsHtml}</div>` 
            });
        });

        renderSuggestions(suggestions);
    }

    function renderSuggestions(suggestions) {
        let container = document.getElementById('search-suggestions');
        if (!container) {
            container = document.createElement('div');
            container.id = 'search-suggestions';
            container.className = 'absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden';
            const searchContainer = document.querySelector('.search-container');
            searchContainer.appendChild(container);
        }

        if (suggestions.length === 0) {
            hideSuggestions();
            return;
        }

        container.innerHTML = suggestions.map(s => `
            <div class="suggestion-item px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 border-b border-slate-50 last:border-none" data-value="${s.value}">
                <i data-lucide="${s.type === 'element' ? 'component' : 'database'}" class="w-4 h-4 text-slate-400 shrink-0"></i>
                <div class="text-sm font-medium text-slate-700 flex flex-wrap items-center">${s.label}</div>
            </div>
        `).join('');

        container.classList.remove('hidden');
        lucide.createIcons();

        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const value = item.dataset.value;
                const searchInput = document.getElementById('element-search-input');
                searchInput.value = value;
                state.searchQuery = value;
                hideSuggestions();
                filterAndRender();
            });
        });
    }

    function hideSuggestions() {
        const container = document.getElementById('search-suggestions');
        if (container) container.classList.add('hidden');
    }

    // Utils
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function showError(message) {
        const container = document.getElementById('results-container');
        if (container) {
            container.innerHTML = `<div class="col-span-full py-20 text-center text-red-500">${message}</div>`;
        }
    }

    // Handle NEP File Download
    window.handleNepDownload = async function(filePath) {
        if (!filePath) {
            alert(t('pathError'));
            return;
        }

        try {
            // Check if file exists using HEAD request
            const response = await fetch(filePath, { method: 'HEAD' });
            if (response.ok) {
                // Create a temporary link to trigger download
                const link = document.createElement('a');
                link.href = filePath;
                link.download = 'nep.txt';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                alert(t('download404'));
            }
        } catch (error) {
            console.error('Download error:', error);
            alert(t('networkError'));
        }
    };

    // Modal Logic
    function initModal() {
        const modal = document.getElementById('db-modal');
        const closeBtn = document.getElementById('db-modal-close');
        
        if (!modal || !closeBtn) return;

        // Close on button click
        closeBtn.addEventListener('click', closeForceFieldModal);

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeForceFieldModal();
            }
        });

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeForceFieldModal();
            }
        });
    }

    window.openForceFieldModal = function(fieldId) {
        const field = state.forceFields.find(f => f.id === fieldId);
        if (!field) return;

        // Populate Content
        document.getElementById('modal-title').textContent = field.name;
        document.getElementById('modal-date').textContent = field.created_date.split('-')[0];
        document.getElementById('modal-intro').textContent = field.intro;
        document.getElementById('modal-authors').textContent = field.authors.join(', ');
        
        // Elements
        const elementsContainer = document.getElementById('modal-elements');
        elementsContainer.innerHTML = field.elements.map(el => 
            `<span class="db-modal-tag">${el}</span>`
        ).join('');

        // Publication
        document.getElementById('modal-pub-title').textContent = field.publication.title || 'N/A';
        document.getElementById('modal-pub-journal').textContent = `${field.publication.journal}, ${field.publication.year}`;

        // Buttons
        const btnDownload = document.getElementById('modal-btn-download');
        btnDownload.onclick = (e) => {
            e.preventDefault();
            handleNepDownload(field.nep_file);
        };

        const btnDoi = document.getElementById('modal-btn-doi');
        btnDoi.href = `https://doi.org/${field.publication.doi}`;

        const btnRepo = document.getElementById('modal-btn-repo');
        btnRepo.href = field.repository_url;

        // Show Modal
        const modal = document.getElementById('db-modal');
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    function closeForceFieldModal() {
        const modal = document.getElementById('db-modal');
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    // Global clear function for clear button in HTML
    window.clearAllSelections = clearAllSelections;

    init();
});
