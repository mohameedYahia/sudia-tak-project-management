// Main Application Logic
class ProjectManagementApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'login';
        this.projects = [];
        this.documents = [];
        this.notifications = [];
        this.suppliers = [];
        this.materials = [];
        this.samples = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Navigation items
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-nav]')) {
                this.navigateTo(e.target.dataset.nav);
            }
            
            if (e.target.matches('[data-action]')) {
                this.handleAction(e.target.dataset.action, e.target);
            }
        });

        // Modal handlers
        document.addEventListener('click', (e) => {
            if (e.target.matches('.modal-overlay') || e.target.matches('[data-close-modal]')) {
                this.closeModal();
            }
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Filter functionality
        const filterSelect = document.getElementById('filterSelect');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => this.handleFilter(e.target.value));
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        if (!username || !password) {
            this.showNotification('يرجى إدخال اسم المستخدم وكلمة المرور', 'error');
            return;
        }

        this.showLoading(true);

        try {
            // Simulate API call
            await this.delay(1000);
            
            if (username === 'admin' && password === '12') {
                this.currentUser = {
                    username: username,
                    role: username === 'admin' ? 'مدير النظام' : 'مستخدم',
                    loginTime: new Date().toISOString()
                };

                if (rememberMe) {
                    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                }

                this.addNotification('تسجيل الدخول', 'النظام', 'مصادقة', this.currentUser.role);
                this.showNotification('تم تسجيل الدخول بنجاح', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                throw new Error('بيانات الدخول غير صحيحة');
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    checkAuthStatus() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }

        // Redirect to login if not authenticated and not on login page
        if (!this.currentUser && !window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
            window.location.href = 'index.html';
        }
    }

    navigateTo(page) {
        this.currentPage = page;
        
        // Update active navigation
        document.querySelectorAll('[data-nav]').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-nav="${page}"]`)?.classList.add('active');

        // Load page content
        this.loadPageContent(page);
    }

    loadPageContent(page) {
        const contentArea = document.getElementById('mainContent');
        if (!contentArea) return;

        switch (page) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'projects':
                this.loadProjects();
                break;
            case 'documents':
                this.loadDocuments();
                break;
            case 'notifications':
                this.loadNotifications();
                break;
            case 'suppliers':
                this.loadSuppliers();
                break;
            case 'materials':
                this.loadMaterials();
                break;
            case 'samples':
                this.loadSamples();
                break;
            default:
                this.loadDashboard();
        }
    }

    loadDashboard() {
        const content = `
            <div class="animate-fade-in">
                <h1 class="text-3xl font-bold text-gray-900 mb-8">لوحة التحكم</h1>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="card hover:shadow-lg transition-shadow duration-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">إجمالي المشاريع</p>
                                <p class="text-3xl font-bold text-primary-600">${this.projects.length}</p>
                            </div>
                            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <span class="text-primary-600 text-xl">📊</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card hover:shadow-lg transition-shadow duration-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">جاهزة للطرح</p>
                                <p class="text-3xl font-bold text-green-600">${this.projects.filter(p => p.status === 'جاهزة للطرح').length}</p>
                            </div>
                            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <span class="text-green-600 text-xl">✅</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card hover:shadow-lg transition-shadow duration-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">قيد الدراسة</p>
                                <p class="text-3xl font-bold text-yellow-600">${this.projects.filter(p => p.status === 'قيد الدراسة').length}</p>
                            </div>
                            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <span class="text-yellow-600 text-xl">⏳</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card hover:shadow-lg transition-shadow duration-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">المستندات</p>
                                <p class="text-3xl font-bold text-blue-600">${this.documents.length}</p>
                            </div>
                            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span class="text-blue-600 text-xl">📁</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="card">
                        <h3 class="text-xl font-semibold mb-4">المشاريع الحديثة</h3>
                        <div class="space-y-3">
                            ${this.projects.slice(0, 5).map(project => `
                                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p class="font-medium">${project.name}</p>
                                        <p class="text-sm text-gray-600">${project.region}</p>
                                    </div>
                                    <span class="px-3 py-1 text-xs font-medium rounded-full ${this.getStatusColor(project.status)}">${project.status}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="card">
                        <h3 class="text-xl font-semibold mb-4">الإشعارات الأخيرة</h3>
                        <div class="space-y-3">
                            ${this.notifications.slice(0, 5).map(notification => `
                                <div class="flex items-start space-x-3 space-x-reverse p-3 bg-gray-50 rounded-lg">
                                    <div class="flex-1">
                                        <p class="text-sm font-medium">${notification.action} في ${notification.section}</p>
                                        <p class="text-xs text-gray-600">${notification.user} - ${this.formatDate(notification.date)}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('mainContent').innerHTML = content;
    }

    loadProjects() {
        const content = `
            <div class="animate-fade-in">
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold text-gray-900">إدارة المشاريع</h1>
                    <button data-action="add-project" class="btn-primary">
                        إضافة مشروع جديد
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    ${this.getProjectCategories().map(category => `
                        <div class="card hover:shadow-lg transition-shadow duration-200 cursor-pointer" data-action="filter-projects" data-status="${category.status}">
                            <div class="text-center">
                                <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span class="text-2xl">${category.icon}</span>
                                </div>
                                <h3 class="text-lg font-semibold mb-2">${category.name}</h3>
                                <p class="text-3xl font-bold text-primary-600">${category.count}</p>
                                <p class="text-sm text-gray-600">مشروع</p>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="card">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-semibold">قائمة المشاريع</h3>
                        <div class="flex space-x-4 space-x-reverse">
                            <input type="text" id="searchInput" placeholder="البحث في المشاريع..." class="input-field w-64">
                            <select id="filterSelect" class="input-field w-48">
                                <option value="">جميع الحالات</option>
                                <option value="جاهزة للطرح">جاهزة للطرح</option>
                                <option value="قيد الدراسة">قيد الدراسة</option>
                                <option value="مقترحة">مقترحة</option>
                                <option value="سابقة">سابقة</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="min-w-full">
                            <thead>
                                <tr>
                                    <th class="table-header">اسم المشروع</th>
                                    <th class="table-header">المنطقة</th>
                                    <th class="table-header">الحالة</th>
                                    <th class="table-header">تاريخ الإنشاء</th>
                                    <th class="table-header">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody id="projectsTableBody">
                                ${this.renderProjectsTable()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('mainContent').innerHTML = content;
        this.setupProjectsEventListeners();
    }

    renderProjectsTable(filteredProjects = null) {
        const projects = filteredProjects || this.projects;
        
        if (projects.length === 0) {
            return `
                <tr>
                    <td colspan="5" class="table-cell text-center text-gray-500 py-8">
                        لا توجد مشاريع متاحة
                    </td>
                </tr>
            `;
        }

        return projects.map(project => `
            <tr class="hover:bg-gray-50">
                <td class="table-cell font-medium">${project.name}</td>
                <td class="table-cell">${project.region}</td>
                <td class="table-cell">
                    <span class="px-3 py-1 text-xs font-medium rounded-full ${this.getStatusColor(project.status)}">${project.status}</span>
                </td>
                <td class="table-cell">${this.formatDate(project.createdAt)}</td>
                <td class="table-cell">
                    <div class="flex space-x-2 space-x-reverse">
                        <button data-action="edit-project" data-id="${project.id}" class="text-blue-600 hover:text-blue-800 text-sm font-medium">تعديل</button>
                        <button data-action="delete-project" data-id="${project.id}" class="text-red-600 hover:text-red-800 text-sm font-medium">حذف</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    setupProjectsEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const filterSelect = document.getElementById('filterSelect');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProjects(e.target.value, filterSelect?.value || '');
            });
        }

        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.filterProjects(searchInput?.value || '', e.target.value);
            });
        }
    }

    filterProjects(searchTerm, statusFilter) {
        let filtered = this.projects;

        if (searchTerm) {
            filtered = filtered.filter(project => 
                project.name.includes(searchTerm) || 
                project.region.includes(searchTerm)
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(project => project.status === statusFilter);
        }

        const tableBody = document.getElementById('projectsTableBody');
        if (tableBody) {
            tableBody.innerHTML = this.renderProjectsTable(filtered);
        }
    }

    loadDocuments() {
        const content = `
            <div class="animate-fade-in">
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold text-gray-900">مكتبة المستندات</h1>
                    <button data-action="upload-document" class="btn-primary">
                        رفع مستند جديد
                    </button>
                </div>

                <div class="card">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-semibold">المستندات</h3>
                        <input type="text" placeholder="البحث في المستندات..." class="input-field w-64">
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="min-w-full">
                            <thead>
                                <tr>
                                    <th class="table-header">اسم الملف</th>
                                    <th class="table-header">اسم المشروع</th>
                                    <th class="table-header">حالة المشروع</th>
                                    <th class="table-header">المستخدم</th>
                                    <th class="table-header">تاريخ الإضافة</th>
                                    <th class="table-header">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.documents.map(doc => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="table-cell">
                                            <div class="flex items-center">
                                                <span class="text-lg ml-2">${this.getFileIcon(doc.type)}</span>
                                                ${doc.name}
                                            </div>
                                        </td>
                                        <td class="table-cell">${doc.projectName}</td>
                                        <td class="table-cell">
                                            <span class="px-3 py-1 text-xs font-medium rounded-full ${this.getStatusColor(doc.projectStatus)}">${doc.projectStatus}</span>
                                        </td>
                                        <td class="table-cell">${doc.user}</td>
                                        <td class="table-cell">${this.formatDate(doc.uploadedAt)}</td>
                                        <td class="table-cell">
                                            <div class="flex space-x-2 space-x-reverse">
                                                <button data-action="download-document" data-id="${doc.id}" class="text-blue-600 hover:text-blue-800 text-sm font-medium">تحميل</button>
                                                <button data-action="delete-document" data-id="${doc.id}" class="text-red-600 hover:text-red-800 text-sm font-medium">حذف</button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('mainContent').innerHTML = content;
    }

    loadNotifications() {
        const content = `
            <div class="animate-fade-in">
                <h1 class="text-3xl font-bold text-gray-900 mb-8">سجل التعديلات (الإشعارات)</h1>

                <div class="card">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-semibold">سجل الأنشطة</h3>
                        <div class="flex space-x-4 space-x-reverse">
                            <input type="text" placeholder="البحث في السجل..." class="input-field w-64">
                            <select class="input-field w-48">
                                <option value="">جميع الأقسام</option>
                                <option value="المشاريع">المشاريع</option>
                                <option value="المستندات">المستندات</option>
                                <option value="النظام">النظام</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="min-w-full">
                            <thead>
                                <tr>
                                    <th class="table-header">التاريخ</th>
                                    <th class="table-header">القسم</th>
                                    <th class="table-header">العنصر</th>
                                    <th class="table-header">الإجراء</th>
                                    <th class="table-header">المستخدم</th>
                                    <th class="table-header">التفاصيل</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.notifications.map(notification => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="table-cell">${this.formatDateTime(notification.date)}</td>
                                        <td class="table-cell">${notification.section}</td>
                                        <td class="table-cell">${notification.element}</td>
                                        <td class="table-cell">
                                            <span class="px-3 py-1 text-xs font-medium rounded-full ${this.getActionColor(notification.action)}">${notification.action}</span>
                                        </td>
                                        <td class="table-cell">${notification.user}</td>
                                        <td class="table-cell">${notification.details || '-'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('mainContent').innerHTML = content;
    }

    loadSuppliers() {
        const content = `
            <div class="animate-fade-in">
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold text-gray-900">إدارة الموردين</h1>
                    <button data-action="add-supplier" class="btn-primary">
                        إضافة مورد جديد
                    </button>
                </div>

                <div class="card">
                    <div class="overflow-x-auto">
                        <table class="min-w-full">
                            <thead>
                                <tr>
                                    <th class="table-header">اسم المورد</th>
                                    <th class="table-header">نوع المورد</th>
                                    <th class="table-header">المدينة</th>
                                    <th class="table-header">الهاتف</th>
                                    <th class="table-header">البريد الإلكتروني</th>
                                    <th class="table-header">التقييم</th>
                                    <th class="table-header">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.suppliers.map(supplier => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="table-cell font-medium">${supplier.name}</td>
                                        <td class="table-cell">${supplier.type}</td>
                                        <td class="table-cell">${supplier.city}</td>
                                        <td class="table-cell">${supplier.phone}</td>
                                        <td class="table-cell">${supplier.email}</td>
                                        <td class="table-cell">
                                            <div class="flex">
                                                ${this.renderStars(supplier.rating)}
                                            </div>
                                        </td>
                                        <td class="table-cell">
                                            <div class="flex space-x-2 space-x-reverse">
                                                <button data-action="edit-supplier" data-id="${supplier.id}" class="text-blue-600 hover:text-blue-800 text-sm font-medium">تعديل</button>
                                                <button data-action="delete-supplier" data-id="${supplier.id}" class="text-red-600 hover:text-red-800 text-sm font-medium">حذف</button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('mainContent').innerHTML = content;
    }

    loadMaterials() {
        const content = `
            <div class="animate-fade-in">
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold text-gray-900">إدارة المواد</h1>
                    <button data-action="add-material" class="btn-primary">
                        إضافة مادة جديدة
                    </button>
                </div>

                <div class="card">
                    <div class="overflow-x-auto">
                        <table class="min-w-full">
                            <thead>
                                <tr>
                                    <th class="table-header">اسم المادة</th>
                                    <th class="table-header">المواصفات الفنية</th>
                                    <th class="table-header">المورد المعتمد</th>
                                    <th class="table-header">سعر السوق (تقديري)</th>
                                    <th class="table-header">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.materials.map(material => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="table-cell font-medium">${material.name}</td>
                                        <td class="table-cell">${material.specifications}</td>
                                        <td class="table-cell">${material.approvedSupplier}</td>
                                        <td class="table-cell">${material.estimatedPrice} ريال</td>
                                        <td class="table-cell">
                                            <div class="flex space-x-2 space-x-reverse">
                                                <button data-action="edit-material" data-id="${material.id}" class="text-blue-600 hover:text-blue-800 text-sm font-medium">تعديل</button>
                                                <button data-action="delete-material" data-id="${material.id}" class="text-red-600 hover:text-red-800 text-sm font-medium">حذف</button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('mainContent').innerHTML = content;
    }

    loadSamples() {
        const content = `
            <div class="animate-fade-in">
                <div class="flex justify-between items-center mb-8">
                    <h1 class="text-3xl font-bold text-gray-900">إدارة العينات</h1>
                    <button data-action="add-sample" class="btn-primary">
                        إضافة عينة جديدة
                    </button>
                </div>

                <div class="card">
                    <div class="overflow-x-auto">
                        <table class="min-w-full">
                            <thead>
                                <tr>
                                    <th class="table-header">اسم العينة</th>
                                    <th class="table-header">المشروع</th>
                                    <th class="table-header">المورد/المقاول</th>
                                    <th class="table-header">تاريخ التقديم</th>
                                    <th class="table-header">الحالة</th>
                                    <th class="table-header">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.samples.map(sample => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="table-cell font-medium">${sample.name}</td>
                                        <td class="table-cell">${sample.project}</td>
                                        <td class="table-cell">${sample.supplier}</td>
                                        <td class="table-cell">${this.formatDate(sample.submissionDate)}</td>
                                        <td class="table-cell">
                                            <span class="px-3 py-1 text-xs font-medium rounded-full ${this.getSampleStatusColor(sample.status)}">${sample.status}</span>
                                        </td>
                                        <td class="table-cell">
                                            <div class="flex space-x-2 space-x-reverse">
                                                <button data-action="edit-sample" data-id="${sample.id}" class="text-blue-600 hover:text-blue-800 text-sm font-medium">تعديل</button>
                                                <button data-action="delete-sample" data-id="${sample.id}" class="text-red-600 hover:text-red-800 text-sm font-medium">حذف</button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('mainContent').innerHTML = content;
    }

    handleAction(action, element) {
        const id = element.dataset.id;
        
        switch (action) {
            case 'add-project':
                this.showAddProjectModal();
                break;
            case 'edit-project':
                this.showEditProjectModal(id);
                break;
            case 'delete-project':
                this.showDeleteConfirmation('project', id);
                break;
            case 'add-supplier':
                this.showAddSupplierModal();
                break;
            case 'edit-supplier':
                this.showEditSupplierModal(id);
                break;
            case 'delete-supplier':
                this.showDeleteConfirmation('supplier', id);
                break;
            case 'add-material':
                this.showAddMaterialModal();
                break;
            case 'edit-material':
                this.showEditMaterialModal(id);
                break;
            case 'delete-material':
                this.showDeleteConfirmation('material', id);
                break;
            case 'add-sample':
                this.showAddSampleModal();
                break;
            case 'edit-sample':
                this.showEditSampleModal(id);
                break;
            case 'delete-sample':
                this.showDeleteConfirmation('sample', id);
                break;
            case 'upload-document':
                this.showUploadDocumentModal();
                break;
            case 'download-document':
                this.downloadDocument(id);
                break;
            case 'delete-document':
                this.showDeleteConfirmation('document', id);
                break;
            case 'logout':
                this.logout();
                break;
            case 'filter-projects':
                const status = element.dataset.status;
                this.filterProjects('', status);
                break;
            default:
                console.warn('Unknown action:', action);
        }
    }

    showAddProjectModal() {
        this.showNotification('إضافة مشروع جديد - قريباً', 'info');
    }

    showEditProjectModal(id) {
        this.showNotification('تعديل المشروع - قريباً', 'info');
    }

    showDeleteConfirmation(type, id) {
        if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
            this.showNotification('تم الحذف بنجاح', 'success');
        }
    }

    showAddSupplierModal() {
        this.showNotification('إضافة مورد جديد - قريباً', 'info');
    }

    showEditSupplierModal(id) {
        this.showNotification('تعديل المورد - قريباً', 'info');
    }

    showAddMaterialModal() {
        this.showNotification('إضافة مادة جديدة - قريباً', 'info');
    }

    showEditMaterialModal(id) {
        this.showNotification('تعديل المادة - قريباً', 'info');
    }

    showAddSampleModal() {
        this.showNotification('إضافة عينة جديدة - قريباً', 'info');
    }

    showEditSampleModal(id) {
        this.showNotification('تعديل العينة - قريباً', 'info');
    }

    showUploadDocumentModal() {
        this.showNotification('رفع مستند جديد - قريباً', 'info');
    }

    downloadDocument(id) {
        this.showNotification('تحميل المستند - قريباً', 'info');
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        window.location.href = 'index.html';
    }

    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    }

    addNotification(element, section, action, user, details = '') {
        const notification = {
            id: Date.now(),
            date: new Date().toISOString(),
            element,
            section,
            action,
            user,
            details
        };
        this.notifications.unshift(notification);
    }

    getProjectCategories() {
        return [
            {
                name: 'جاهزة للطرح',
                status: 'جاهزة للطرح',
                count: this.projects.filter(p => p.status === 'جاهزة للطرح').length,
                icon: '🚀'
            },
            {
                name: 'قيد الدراسة',
                status: 'قيد الدراسة',
                count: this.projects.filter(p => p.status === 'قيد الدراسة').length,
                icon: '📋'
            },
            {
                name: 'مقترحة',
                status: 'مقترحة',
                count: this.projects.filter(p => p.status === 'مقترحة').length,
                icon: '💡'
            },
            {
                name: 'سابقة',
                status: 'سابقة',
                count: this.projects.filter(p => p.status === 'سابقة').length,
                icon: '📁'
            }
        ];
    }

    getStatusColor(status) {
        switch (status) {
            case 'جاهزة للطرح':
                return 'bg-green-100 text-green-700';
            case 'قيد الدراسة':
                return 'bg-yellow-100 text-yellow-700';
            case 'مقترحة':
                return 'bg-blue-100 text-blue-700';
            case 'سابقة':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    }

    getSampleStatusColor(status) {
        switch (status) {
            case 'معتمدة':
                return 'bg-green-100 text-green-700';
            case 'مرفوضة':
                return 'bg-red-100 text-red-700';
            case 'تحت المراجعة':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    }

    getActionColor(action) {
        switch (action) {
            case 'إضافة':
                return 'bg-green-100 text-green-700';
            case 'تعديل':
                return 'bg-yellow-100 text-yellow-700';
            case 'حذف':
                return 'bg-red-100 text-red-700';
            case 'تسجيل الدخول':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    }

    getFileIcon(type) {
        switch (type) {
            case 'pdf':
                return '📄';
            case 'txt':
                return '📃';
            case 'json':
                return '🗒️';
            default:
                return '📁';
        }
    }

    renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += i <= rating ? '⭐' : '☆';
        }
        return stars;
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ar-EG');
    }

    formatDateTime(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleString('ar-EG');
    }

    showNotification(message, type = 'info') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification ${type} animate-slide-up`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('animate-fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    showLoading(show) {
        let loader = document.getElementById('loadingSpinner');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'loadingSpinner';
            loader.className = 'spinner fixed top-4 left-4 z-50';
            document.body.appendChild(loader);
        }
        loader.style.display = show ? 'block' : 'none';
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    loadInitialData() {
        // Sample data for demonstration
        this.projects = [
            { id: 1, name: 'تطوير الواجهة البحرية', region: 'المنطقة الشرقية', status: 'جاهزة للطرح', createdAt: '2023-07-01' },
            { id: 2, name: 'بناء مجمع سكني', region: 'الرياض', status: 'سابقة', createdAt: '2023-06-15' },
            { id: 3, name: 'إنشاء حديقة عامة', region: 'جدة', status: 'مقترحة', createdAt: '2023-07-10' },
            { id: 4, name: 'ترميم مبنى تاريخي', region: 'المدينة المنورة', status: 'سابقة', createdAt: '2023-05-20' },
            { id: 5, name: 'مشروع مستقبلي', region: 'مكة', status: 'مقترحة', createdAt: '2023-08-01' },
            { id: 6, name: 'مشروع قيد الدراسة', region: 'الدمام', status: 'قيد الدراسة', createdAt: '2023-07-15' }
        ];

        this.documents = [
            { id: 1, name: 'كراسة شروط الواجهة.txt', type: 'txt', projectName: 'تطوير الواجهة البحرية', projectStatus: 'جاهزة للطرح', user: 'مدير النظام', uploadedAt: '2023-07-01' },
            { id: 2, name: 'مخطط الواجهة.pdf', type: 'pdf', projectName: 'تطوير الواجهة البحرية', projectStatus: 'جاهزة للطرح', user: 'مدير النظام', uploadedAt: '2023-07-02' },
            { id: 3, name: 'جدول كميات المجمع.json', type: 'json', projectName: 'بناء مجمع سكني', projectStatus: 'سابقة', user: 'مدير النظام', uploadedAt: '2023-06-16' }
        ];

        this.notifications = [
            { id: 1, date: '2023-07-25T02:37:00', section: 'النظام', element: 'تسجيل الدخول', action: 'تسجيل الدخول', user: 'مدير النظام', details: 'تم تسجيل الدخول بنجاح' }
        ];

        this.suppliers = [
            { id: 1, name: 'شركة الموردين الأولى', type: 'مورد', city: 'الرياض', phone: '0501234567', email: 'supplier1@example.com', rating: 4 },
            { id: 2, name: 'شركة المقاولات', type: 'مقاول', city: 'جدة', phone: '0557654321', email: 'contractor@example.com', rating: 5 }
        ];

        this.materials = [
            { id: 1, name: 'حديد التسليح', specifications: 'حديد عالي الجودة', approvedSupplier: 'شركة الموردين الأولى', estimatedPrice: 1500 },
            { id: 2, name: 'أسمنت', specifications: 'أسمنت بورتلاندي', approvedSupplier: 'شركة المقاولات', estimatedPrice: 300 }
        ];

        this.samples = [
            { id: 1, name: 'عينة خرسانة', project: 'بناء مجمع سكني', supplier: 'شركة المقاولات', submissionDate: '2023-07-20', status: 'تحت المراجعة' },
            { id: 2, name: 'عينة طوب', project: 'إنشاء حديقة عامة', supplier: 'شركة الموردين الأولى', submissionDate: '2023-07-22', status: 'معتمدة' }
        ];
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ProjectManagementApp();
});
