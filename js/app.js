/**
 * 程老板渔具网站 - 主应用逻辑
 */

// 基本常量配置
const CONFIG = {
    // 抖音用户ID，用于爬取橱窗商品
    // 在实际使用中替换为自己的抖音用户ID
    douyinUserId: 'chenglaobanl',
    
    // 本地存储键名
    localStorageKeys: {
        cart: 'fishing_cart_items',
        lastVisit: 'fishing_last_visit'
    }
};

/**
 * 购物车类 - 管理购物车功能
 */
class ShoppingCart {
    constructor() {
        this.items = []; // 购物车商品
        this.cartKey = CONFIG.localStorageKeys.cart;
        this.loadFromStorage();
        
        // 绑定事件处理器
        this.bindEvents();
    }
    
    // 加载本地存储的购物车数据
    loadFromStorage() {
        try {
            const storedItems = localStorage.getItem(this.cartKey);
            if (storedItems) {
                this.items = JSON.parse(storedItems);
            }
        } catch (error) {
            console.error('加载购物车数据失败:', error);
            this.items = [];
        }
        
        this.updateCartDisplay();
    }
    
    // 保存购物车到本地存储
    saveToStorage() {
        try {
            localStorage.setItem(this.cartKey, JSON.stringify(this.items));
        } catch (error) {
            console.error('保存购物车数据失败:', error);
        }
    }
    
    // 添加商品到购物车
    addItem(product, quantity = 1) {
        // 检查商品是否已在购物车中
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                title: product.title,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: quantity
            });
        }
        
        this.saveToStorage();
        this.updateCartDisplay();
        
        // 显示添加成功信息
        this.showMessage(`已添加 ${product.title} 到购物车`);
    }
    
    // 从购物车移除商品
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.updateCartDisplay();
    }
    
    // 更新商品数量
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveToStorage();
                this.updateCartDisplay();
            }
        }
    }
    
    // 清空购物车
    clearCart() {
        this.items = [];
        this.saveToStorage();
        this.updateCartDisplay();
    }
    
    // 计算购物车总价
    calculateTotal() {
        return this.items.reduce((total, item) => {
            return total + (parseFloat(item.price) * item.quantity);
        }, 0).toFixed(2);
    }
    
    // 获取购物车商品总数
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }
    
    // 更新购物车显示
    updateCartDisplay() {
        // 更新购物车图标的数量显示
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const itemCount = this.getItemCount();
            cartCount.textContent = itemCount;
            cartCount.style.display = itemCount > 0 ? 'flex' : 'none';
        }
        
        // 更新购物车列表
        const cartItemsContainer = document.querySelector('.cart-items');
        if (cartItemsContainer) {
            if (this.items.length === 0) {
                cartItemsContainer.innerHTML = '<div class="empty-cart">购物车是空的</div>';
            } else {
                cartItemsContainer.innerHTML = this.items.map(item => `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="cart-item-image">
                            <img src="${item.imageUrl}" alt="${item.title}">
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.title}</div>
                            <div class="cart-item-price">¥${item.price}</div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn decrease-btn">-</button>
                                <span class="quantity-value">${item.quantity}</span>
                                <button class="quantity-btn increase-btn">+</button>
                            </div>
                            <div class="cart-item-remove">删除</div>
                        </div>
                    </div>
                `).join('');
                
                // 绑定购物车项目事件
                this.bindCartItemEvents();
            }
        }
        
        // 更新总计金额
        const totalElement = document.querySelector('.cart-total-amount');
        if (totalElement) {
            totalElement.textContent = `¥${this.calculateTotal()}`;
        }
    }
    
    // 显示信息提示
    showMessage(message, type = 'success') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-toast ${type}`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        // 显示消息
        setTimeout(() => {
            messageDiv.classList.add('active');
            
            // 自动隐藏
            setTimeout(() => {
                messageDiv.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(messageDiv);
                }, 300);
            }, 2000);
        }, 10);
    }
    
    // 绑定购物车项目事件
    bindCartItemEvents() {
        // 增加商品数量
        document.querySelectorAll('.increase-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const cartItem = e.target.closest('.cart-item');
                const productId = cartItem.dataset.id;
                const quantityDisplay = cartItem.querySelector('.quantity-value');
                const currentQuantity = parseInt(quantityDisplay.textContent, 10);
                this.updateQuantity(productId, currentQuantity + 1);
            });
        });
        
        // 减少商品数量
        document.querySelectorAll('.decrease-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const cartItem = e.target.closest('.cart-item');
                const productId = cartItem.dataset.id;
                const quantityDisplay = cartItem.querySelector('.quantity-value');
                const currentQuantity = parseInt(quantityDisplay.textContent, 10);
                this.updateQuantity(productId, currentQuantity - 1);
            });
        });
        
        // 删除商品
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', e => {
                const cartItem = e.target.closest('.cart-item');
                const productId = cartItem.dataset.id;
                this.removeItem(productId);
            });
        });
    }
    
    // 绑定购物车事件
    bindEvents() {
        // 购物车图标点击显示购物车
        const cartIcon = document.querySelector('.cart-icon');
        const cartContainer = document.querySelector('.cart-container');
        const closeCart = document.querySelector('.close-cart');
        
        if (cartIcon && cartContainer) {
            cartIcon.addEventListener('click', () => {
                cartContainer.classList.add('active');
            });
        }
        
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                cartContainer.classList.remove('active');
            });
        }
        
        // 结账按钮
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.items.length === 0) {
                    this.showMessage('请先添加商品到购物车', 'error');
                    return;
                }
                
                this.checkout();
            });
        }
    }
    
    // 结账处理
    checkout() {
        // 抖音分享口令
        const douyinShareCode = "在这里填入你的抖音店铺分享口令";
        
        // 创建一个模态框显示抖音分享口令
        const modalHtml = `
            <div class="douyin-share-modal modal active">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <div class="douyin-share-container">
                        <h3>前往抖音橱窗</h3>
                        <p class="share-instructions">请复制下方口令，打开抖音APP粘贴使用：</p>
                        <div class="share-code-container">
                            <textarea class="share-code" readonly>${douyinShareCode}</textarea>
                        </div>
                        <div class="share-actions">
                            <button class="btn copy-btn">复制口令</button>
                            <a href="https://www.douyin.com/user/${CONFIG.douyinUserId}" target="_blank" class="btn btn-secondary">直接前往抖音</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 添加模态框到body
        const modalElement = document.createElement('div');
        modalElement.innerHTML = modalHtml;
        document.body.appendChild(modalElement.firstElementChild);
        
        // 获取刚创建的模态框
        const modal = document.querySelector('.douyin-share-modal');
        const copyBtn = modal.querySelector('.copy-btn');
        const shareCode = modal.querySelector('.share-code');
        const closeBtn = modal.querySelector('.close-modal');
        
        // 复制按钮功能
        copyBtn.addEventListener('click', () => {
            shareCode.select();
            document.execCommand('copy');
            this.showMessage('抖音口令已复制，请打开抖音APP粘贴使用');
        });
        
        // 关闭按钮功能
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // 点击模态框背景关闭
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    // 后台批量代发功能（仅供管理员使用）
    batchFulfillmentFromAlibaba() {
        // 创建阿里巴巴批量代发模态框
        const modalHtml = `
            <div class="alibaba-modal modal active">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <div class="alibaba-container">
                        <h3>阿里巴巴批量代发</h3>
                        <div class="cart-summary-display">
                            <h4>购物车商品 (${this.items.length}件)</h4>
                            <div class="cart-items-preview">
                                ${this.items.map(item => `
                                    <div class="cart-preview-item">
                                        <img src="${item.imageUrl}" alt="${item.title}">
                                        <div class="preview-item-info">
                                            <p class="preview-item-title">${item.title}</p>
                                            <p class="preview-item-price">¥${item.price} × ${item.quantity}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="cart-total-preview">
                                <p>总计: <span>¥${this.calculateTotal()}</span></p>
                            </div>
                        </div>
                        <div class="alibaba-options">
                            <div class="option-group">
                                <label>收货人信息：</label>
                                <div class="receiver-info">
                                    <input type="text" placeholder="收货人姓名" class="receiver-name">
                                    <input type="text" placeholder="收货人电话" class="receiver-phone">
                                </div>
                                <textarea placeholder="收货地址（省市区详细地址）" class="receiver-address"></textarea>
                            </div>
                            <div class="option-group">
                                <label>代发选项：</label>
                                <div class="delivery-options">
                                    <div class="option">
                                        <input type="radio" name="delivery-type" id="direct-delivery" checked>
                                        <label for="direct-delivery">直接发货</label>
                                    </div>
                                    <div class="option">
                                        <input type="radio" name="delivery-type" id="customize-package">
                                        <label for="customize-package">定制包装</label>
                                    </div>
                                </div>
                            </div>
                            <div class="option-group">
                                <label>备注信息：</label>
                                <textarea placeholder="备注信息（选填）" class="order-note"></textarea>
                            </div>
                        </div>
                        <div class="alibaba-actions">
                            <button class="btn alibaba-submit">确认代发订单</button>
                            <a href="https://s.1688.com/youyuan/index.htm?keywords=渔具" target="_blank" class="btn btn-secondary">前往阿里巴巴选购</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 添加模态框到body
        const modalElement = document.createElement('div');
        modalElement.innerHTML = modalHtml;
        document.body.appendChild(modalElement.firstElementChild);
        
        // 获取刚创建的模态框
        const alibabaModal = document.querySelector('.alibaba-modal');
        const submitBtn = alibabaModal.querySelector('.alibaba-submit');
        const closeBtn = alibabaModal.querySelector('.close-modal');
        
        // 提交按钮功能
        submitBtn.addEventListener('click', () => {
            const name = alibabaModal.querySelector('.receiver-name').value;
            const phone = alibabaModal.querySelector('.receiver-phone').value;
            const address = alibabaModal.querySelector('.receiver-address').value;
            
            if (!name || !phone || !address) {
                this.showMessage('请填写完整的收货信息', 'error');
                return;
            }
            
            // 这里可以添加实际的提交逻辑
            this.showMessage('批量代发订单已提交，我们将尽快为您安排发货', 'success');
            
            // 关闭模态框
            document.body.removeChild(alibabaModal);
            
            // 清空购物车
            this.clearCart();
            
            // 关闭购物车
            const cartContainer = document.querySelector('.cart-container');
            if (cartContainer) {
                cartContainer.classList.remove('active');
            }
        });
        
        // 关闭按钮功能
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(alibabaModal);
        });
        
        // 点击模态框背景关闭
        alibabaModal.addEventListener('click', e => {
            if (e.target === alibabaModal) {
                document.body.removeChild(alibabaModal);
            }
        });
    }
}

/**
 * 产品管理类 - 处理产品展示和筛选
 */
class ProductManager {
    constructor() {
        this.products = []; // 存储所有产品
        this.filteredProducts = []; // 存储筛选后的产品
        this.currentCategory = 'all'; // 当前选择的分类
        this.currentSort = 'default'; // 当前排序方式
        this.searchTerm = ''; // 当前搜索词
        
        // 获取DOM元素
        this.productsGrid = document.querySelector('.products-grid');
        this.categorySelect = document.querySelector('#category-filter');
        this.sortSelect = document.querySelector('#sort-filter');
        this.searchInput = document.querySelector('.search-input');
        this.searchButton = document.querySelector('.search-button');
        this.refreshButton = document.querySelector('.refresh-button');
        
        // 绑定事件
        this.bindEvents();
    }
    
    // 从抖音获取产品
    async fetchProducts(forceRefresh = false) {
        try {
            showLoader(true);
            const douyinScraper = new DouyinScraper();
            
            // 如果强制刷新，先清除缓存
            if (forceRefresh) {
                localStorage.removeItem(douyinScraper.cacheKey);
            }
            
            this.products = await douyinScraper.fetchProducts(CONFIG.douyinUserId);
            this.applyFilters();
            showLoader(false);
            
            if (forceRefresh) {
                showMessage('商品数据已刷新', 'success');
            }
        } catch (error) {
            console.error('获取产品失败:', error);
            showLoader(false);
            showMessage('获取产品数据失败，请稍后再试', 'error');
        }
    }
    
    // 应用过滤和排序
    applyFilters() {
        // 首先按类别过滤
        this.filteredProducts = this.currentCategory === 'all' 
            ? [...this.products] 
            : this.products.filter(product => product.category === this.currentCategory);
        
        // 然后应用搜索词过滤
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            this.filteredProducts = this.filteredProducts.filter(product => 
                product.title.toLowerCase().includes(term) || 
                product.description.toLowerCase().includes(term)
            );
        }
        
        // 最后应用排序
        switch (this.currentSort) {
            case 'price-asc':
                this.filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'price-desc':
                this.filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case 'sales':
                this.filteredProducts.sort((a, b) => parseInt(b.sales, 10) - parseInt(a.sales, 10));
                break;
            default:
                // 默认排序，保持原顺序
                break;
        }
        
        // 更新展示
        this.renderProducts();
    }
    
    // 渲染产品列表
    renderProducts() {
        if (!this.productsGrid) return;
        
        if (this.filteredProducts.length === 0) {
            this.productsGrid.innerHTML = '<div class="no-products">没有找到符合条件的商品</div>';
            return;
        }
        
        // 抖音分享口令
        const douyinShareCode = "在这里填入你的抖音店铺分享口令";
        
        this.productsGrid.innerHTML = this.filteredProducts.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.imageUrl}" alt="${product.title}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-price">
                        ¥${product.price}
                        ${product.originalPrice ? `<span class="original-price">¥${product.originalPrice}</span>` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="btn add-to-cart-btn">加入购物车</button>
                        <button class="btn btn-secondary view-details-btn">查看详情</button>
                    </div>
                    <div class="product-source">
                        <a href="javascript:void(0)" class="douyin-link" data-product-id="${product.id}">
                            <i class="fab fa-tiktok"></i> 去抖音购买
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
        
        // 绑定产品卡片事件
        this.bindProductEvents();
    }
    
    // 绑定产品卡片事件
    bindProductEvents() {
        // 添加到购物车按钮
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const card = e.target.closest('.product-card');
                const productId = card.dataset.id;
                const product = this.findProductById(productId);
                
                if (product) {
                    app.cart.addItem(product);
                }
            });
        });
        
        // 查看详情按钮
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const card = e.target.closest('.product-card');
                const productId = card.dataset.id;
                const product = this.findProductById(productId);
                
                if (product) {
                    this.showProductDetails(product);
                }
            });
        });
        
        // 抖音链接点击事件
        document.querySelectorAll('.douyin-link').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const productId = link.dataset.productId;
                const product = this.findProductById(productId);
                
                if (product) {
                    this.showDouyinShareModal(product);
                }
            });
        });
        
        // 整个卡片点击也显示详情
        document.querySelectorAll('.product-image').forEach(img => {
            img.addEventListener('click', e => {
                const card = e.target.closest('.product-card');
                const productId = card.dataset.id;
                const product = this.findProductById(productId);
                
                if (product) {
                    this.showProductDetails(product);
                }
            });
        });
    }
    
    // 根据ID查找产品
    findProductById(productId) {
        return this.products.find(product => product.id === productId);
    }
    
    // 显示产品详情
    showProductDetails(product) {
        // 获取模态框元素
        const modal = document.querySelector('.product-detail-modal');
        const imageElement = modal.querySelector('.product-detail-image img');
        const titleElement = modal.querySelector('.product-detail-title');
        const priceElement = modal.querySelector('.product-detail-price');
        const descElement = modal.querySelector('.product-detail-desc');
        const buyNowBtn = modal.querySelector('.buy-now-btn');
        const addToCartBtn = modal.querySelector('.detail-add-to-cart-btn');
        
        // 设置详情内容
        imageElement.src = product.imageUrl;
        imageElement.alt = product.title;
        titleElement.textContent = product.title;
        priceElement.innerHTML = `¥${product.price} <small><del>¥${product.originalPrice || (parseFloat(product.price) * 1.2).toFixed(2)}</del></small>`;
        descElement.textContent = product.description;
        
        // 添加支付方式和收款码对定制串钩的特殊处理
        let paymentInfo = '';
        if (product.id === 'custom-hooks-001') {
            paymentInfo = `
                <div class="payment-methods">
                    <h4>支付方式</h4>
                    <div class="payment-options">
                        <div class="payment-option">
                            <input type="radio" id="alipay" name="payment" value="alipay" checked>
                            <label for="alipay">支付宝</label>
                        </div>
                        <div class="payment-option">
                            <input type="radio" id="wechat" name="payment" value="wechat">
                            <label for="wechat">微信支付</label>
                        </div>
                    </div>
                    <div class="payment-qrcode">
                        <div class="qrcode-container alipay-qrcode active">
                            <img src="img/alipay-qrcode.jpg" alt="支付宝收款码">
                            <p>请使用支付宝扫码支付</p>
                        </div>
                        <div class="qrcode-container wechat-qrcode">
                            <img src="img/wechat-qrcode.jpg" alt="微信收款码">
                            <p>请使用微信扫码支付</p>
                        </div>
                    </div>
                </div>
            `;
            descElement.insertAdjacentHTML('afterend', paymentInfo);
            
            // 绑定支付方式切换事件
            setTimeout(() => {
                const alipayRadio = modal.querySelector('#alipay');
                const wechatRadio = modal.querySelector('#wechat');
                const alipayQrcode = modal.querySelector('.alipay-qrcode');
                const wechatQrcode = modal.querySelector('.wechat-qrcode');
                
                alipayRadio.addEventListener('change', () => {
                    alipayQrcode.classList.add('active');
                    wechatQrcode.classList.remove('active');
                });
                
                wechatRadio.addEventListener('change', () => {
                    wechatQrcode.classList.add('active');
                    alipayQrcode.classList.remove('active');
                });
            }, 100);
        }
        
        // 为按钮绑定事件
        buyNowBtn.onclick = () => {
            if (product.id === 'custom-hooks-001') {
                this.showMessage('请通过上方二维码直接支付', 'info');
            } else {
                this.showDouyinShareModal(product);
            }
            modal.classList.remove('active');
        };
        
        addToCartBtn.onclick = () => {
            app.cart.addItem(product);
        };
        
        // 显示模态框
        modal.classList.add('active');
        
        // 绑定关闭事件
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.onclick = () => {
            modal.classList.remove('active');
            // 移除支付方式元素(如果存在)
            const paymentMethods = modal.querySelector('.payment-methods');
            if (paymentMethods) {
                paymentMethods.remove();
            }
        };
        
        // 点击模态框背景关闭
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                // 移除支付方式元素(如果存在)
                const paymentMethods = modal.querySelector('.payment-methods');
                if (paymentMethods) {
                    paymentMethods.remove();
                }
            }
        };
    }
    
    // 保留阿里巴巴一键代发功能供后台使用
    showAlibabaModal(product) {
        // 创建阿里巴巴代发模态框
        const modalHtml = `
            <div class="alibaba-modal modal active">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <div class="alibaba-container">
                        <h3>阿里巴巴一键代发</h3>
                        <div class="product-brief">
                            <img src="${product.imageUrl}" alt="${product.title}">
                            <div class="brief-info">
                                <h4>${product.title}</h4>
                                <p class="brief-price">¥${product.price}</p>
                            </div>
                        </div>
                        <div class="alibaba-options">
                            <div class="option-group">
                                <label>收货人信息：</label>
                                <div class="receiver-info">
                                    <input type="text" placeholder="收货人姓名" class="receiver-name">
                                    <input type="text" placeholder="收货人电话" class="receiver-phone">
                                </div>
                                <textarea placeholder="收货地址（省市区详细地址）" class="receiver-address"></textarea>
                            </div>
                            <div class="option-group">
                                <label>代发选项：</label>
                                <div class="delivery-options">
                                    <div class="option">
                                        <input type="radio" name="delivery-type" id="direct-delivery" checked>
                                        <label for="direct-delivery">直接发货</label>
                                    </div>
                                    <div class="option">
                                        <input type="radio" name="delivery-type" id="customize-package">
                                        <label for="customize-package">定制包装</label>
                                    </div>
                                </div>
                            </div>
                            <div class="option-group">
                                <label>备注信息：</label>
                                <textarea placeholder="备注信息（选填）" class="order-note"></textarea>
                            </div>
                        </div>
                        <div class="alibaba-actions">
                            <button class="btn alibaba-submit">确认代发</button>
                            <a href="https://s.1688.com/youyuan/index.htm?keywords=${encodeURIComponent(product.title)}" target="_blank" class="btn btn-secondary">前往阿里巴巴选购</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 添加模态框到body
        const modalElement = document.createElement('div');
        modalElement.innerHTML = modalHtml;
        document.body.appendChild(modalElement.firstElementChild);
        
        // 获取刚创建的模态框
        const alibabaModal = document.querySelector('.alibaba-modal');
        const submitBtn = alibabaModal.querySelector('.alibaba-submit');
        const closeBtn = alibabaModal.querySelector('.close-modal');
        
        // 提交按钮功能
        submitBtn.addEventListener('click', () => {
            const name = alibabaModal.querySelector('.receiver-name').value;
            const phone = alibabaModal.querySelector('.receiver-phone').value;
            const address = alibabaModal.querySelector('.receiver-address').value;
            
            if (!name || !phone || !address) {
                showMessage('请填写完整的收货信息', 'error');
                return;
            }
            
            // 这里可以添加实际的提交逻辑
            showMessage('代发订单已提交，我们将尽快处理', 'success');
            
            // 关闭模态框
            document.body.removeChild(alibabaModal);
        });
        
        // 关闭按钮功能
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(alibabaModal);
        });
        
        // 点击模态框背景关闭
        alibabaModal.addEventListener('click', e => {
            if (e.target === alibabaModal) {
                document.body.removeChild(alibabaModal);
            }
        });
    }
    
    // 显示抖音分享模态框
    showDouyinShareModal(product) {
        // 抖音分享口令
        const douyinShareCode = "在这里填入你的抖音店铺分享口令";
        
        // 创建抖音分享模态框
        const modalHtml = `
            <div class="douyin-share-modal modal active">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <div class="douyin-share-container">
                        <h3>前往抖音购买 ${product.title}</h3>
                        <p class="share-instructions">请复制下方口令，打开抖音APP粘贴使用：</p>
                        <div class="share-code-container">
                            <textarea class="share-code" readonly>${douyinShareCode}</textarea>
                        </div>
                        <div class="share-actions">
                            <button class="btn copy-btn">复制口令</button>
                            <a href="${product.detailUrl}" target="_blank" class="btn btn-secondary">直接前往抖音</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 添加模态框到body
        const modalElement = document.createElement('div');
        modalElement.innerHTML = modalHtml;
        document.body.appendChild(modalElement.firstElementChild);
        
        // 获取刚创建的模态框
        const shareModal = document.querySelector('.douyin-share-modal');
        const copyBtn = shareModal.querySelector('.copy-btn');
        const shareCode = shareModal.querySelector('.share-code');
        const closeBtn = shareModal.querySelector('.close-modal');
        
        // 复制按钮功能
        copyBtn.addEventListener('click', () => {
            shareCode.select();
            document.execCommand('copy');
            showMessage('抖音口令已复制，请打开抖音APP粘贴使用');
        });
        
        // 关闭按钮功能
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(shareModal);
        });
        
        // 点击模态框背景关闭
        shareModal.addEventListener('click', e => {
            if (e.target === shareModal) {
                document.body.removeChild(shareModal);
            }
        });
    }
    
    // 绑定过滤和排序事件
    bindEvents() {
        // 分类选择
        if (this.categorySelect) {
            this.categorySelect.addEventListener('change', () => {
                this.currentCategory = this.categorySelect.value;
                this.applyFilters();
            });
        }
        
        // 排序选择
        if (this.sortSelect) {
            this.sortSelect.addEventListener('change', () => {
                this.currentSort = this.sortSelect.value;
                this.applyFilters();
            });
        }
        
        // 搜索输入框
        if (this.searchInput && this.searchButton) {
            // 点击搜索按钮
            this.searchButton.addEventListener('click', () => {
                this.searchTerm = this.searchInput.value.trim();
                this.applyFilters();
            });
            
            // 回车键搜索
            this.searchInput.addEventListener('keypress', e => {
                if (e.key === 'Enter') {
                    this.searchTerm = this.searchInput.value.trim();
                    this.applyFilters();
                }
            });
        }
        
        // 刷新按钮
        if (this.refreshButton) {
            this.refreshButton.addEventListener('click', () => {
                this.fetchProducts(true); // 强制刷新
            });
        }
    }
    
    // 初始化分类选择器
    initializeFilters() {
        if (!this.categorySelect) return;
        
        // 获取所有唯一分类
        const categories = [...new Set(this.products.map(product => product.category))];
        
        // 清空旧选项并添加"全部"选项
        this.categorySelect.innerHTML = '<option value="all">全部分类</option>';
        
        // 添加分类选项
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            this.categorySelect.appendChild(option);
        });
    }
}

/**
 * 显示加载动画
 */
function showLoader(show) {
    const loader = document.querySelector('.loader');
    if (loader) {
        if (show) {
            loader.classList.add('active');
        } else {
            loader.classList.remove('active');
        }
    }
}

/**
 * 显示消息通知
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型: success, error, warning, info
 * @param {number} duration - 显示时长(毫秒)
 */
function showMessage(message, type = 'info', duration = 3000) {
    // 创建消息元素
    const messageElement = document.createElement('div');
    messageElement.className = `message-notification ${type}`;
    messageElement.innerHTML = `
        <div class="message-content">
            <span>${message}</span>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(messageElement);
    
    // 显示动画
    setTimeout(() => {
        messageElement.classList.add('show');
    }, 10);
    
    // 设置自动消失
    setTimeout(() => {
        messageElement.classList.remove('show');
        
        // 移除元素
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 300);
    }, duration);
}

/**
 * 主应用类
 */
class App {
    constructor() {
        this.cart = new ShoppingCart();
        this.productManager = new ProductManager();
        
        // 记录访问时间
        this.recordVisit();
        
        // 管理员功能
        this.adminCredentials = {
            username: 'admin',
            password: 'cl123456'  // 实际应用中应使用更安全的方式存储和验证
        };
    }
    
    // 初始化应用
    async initialize() {
        // 绑定导航菜单切换
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('nav ul');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
        
        // 初始化刷新按钮（如果过滤器容器中不存在）
        const filterContainer = document.querySelector('.filter-container .filter-options');
        if (filterContainer && !document.querySelector('.refresh-button')) {
            const refreshButton = document.createElement('button');
            refreshButton.className = 'btn refresh-button';
            refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i> 刷新商品';
            filterContainer.appendChild(refreshButton);
        }
        
        // 加载产品
        await this.productManager.fetchProducts();
        
        // 初始化分类筛选器
        this.productManager.initializeFilters();
        
        // 初始化平滑滚动
        this.initializeSmoothScroll();
        
        // 初始化管理员功能
        this.initializeAdminFeatures();
    }
    
    // 记录最后访问时间
    recordVisit() {
        try {
            localStorage.setItem(CONFIG.localStorageKeys.lastVisit, Date.now().toString());
        } catch (error) {
            console.error('记录访问时间失败:', error);
        }
    }
    
    // 初始化平滑滚动
    initializeSmoothScroll() {
        // 获取所有导航链接
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        // 为每个链接添加点击事件
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // 关闭移动端导航菜单
                const navMenu = document.querySelector('nav ul');
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
                
                // 获取目标元素
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // 计算滚动位置（考虑固定导航栏高度）
                    const navHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    
                    // 平滑滚动
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // 初始化管理员功能
    initializeAdminFeatures() {
        // 管理员入口按钮
        const adminLoginBtn = document.getElementById('admin-login-btn');
        const adminLoginModal = document.querySelector('.admin-login-modal');
        const adminPanelModal = document.querySelector('.admin-panel-modal');
        
        if (!adminLoginBtn || !adminLoginModal || !adminPanelModal) return;
        
        // 显示管理员登录模态框
        adminLoginBtn.addEventListener('click', () => {
            adminLoginModal.classList.add('active');
        });
        
        // 关闭按钮
        const closeButtons = document.querySelectorAll('.close-modal');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', e => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                }
            });
        });
        
        // 点击模态框背景关闭
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', e => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
        
        // 管理员登录表单提交
        const loginSubmitBtn = document.getElementById('admin-login-submit');
        if (loginSubmitBtn) {
            loginSubmitBtn.addEventListener('click', () => {
                const username = document.getElementById('admin-username').value;
                const password = document.getElementById('admin-password').value;
                
                if (username === this.adminCredentials.username && 
                    password === this.adminCredentials.password) {
                    // 登录成功
                    adminLoginModal.classList.remove('active');
                    
                    // 关闭当前模态框，打开淘宝风格后台
                    this.createTaobaoStyleAdmin();
                    
                    // 清空输入
                    document.getElementById('admin-username').value = '';
                    document.getElementById('admin-password').value = '';
                } else {
                    showMessage('用户名或密码错误', 'error');
                }
            });
        }
        
        // 管理面板功能按钮
        const batchFulfillmentBtn = document.getElementById('alibaba-batch-fulfillment');
        if (batchFulfillmentBtn) {
            batchFulfillmentBtn.addEventListener('click', () => {
                adminPanelModal.classList.remove('active');
                this.cart.batchFulfillmentFromAlibaba();
            });
        }
        
        const productSourcingBtn = document.getElementById('alibaba-product-sourcing');
        if (productSourcingBtn) {
            productSourcingBtn.addEventListener('click', () => {
                adminPanelModal.classList.remove('active');
                window.open('https://www.1688.com/yq/search.html?keywords=%D3%E6%BE%DF&cosite=baidujj&trackid=8288303244560185085', '_blank');
            });
        }
        
        const orderManagementBtn = document.getElementById('order-management');
        if (orderManagementBtn) {
            orderManagementBtn.addEventListener('click', () => {
                adminPanelModal.classList.remove('active');
                showMessage('订单管理功能开发中', 'warning');
            });
        }
    }
    
    // 创建淘宝风格后台
    createTaobaoStyleAdmin() {
        // 检查是否已存在后台页面
        if (document.getElementById('taobao-admin-panel')) {
            document.getElementById('taobao-admin-panel').classList.add('active');
            return;
        }
        
        // 创建后台面板
        const adminPanel = document.createElement('div');
        adminPanel.id = 'taobao-admin-panel';
        adminPanel.className = 'taobao-admin-panel';
        
        // 添加后台面板HTML
        adminPanel.innerHTML = `
            <div class="admin-header">
                <div class="admin-logo">
                    <img src="img/logo.png" alt="程老板渔具管理系统">
                    <span>程老板渔具管理系统</span>
                </div>
                <div class="admin-user">
                    <span>管理员</span>
                    <div class="admin-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="admin-dropdown">
                        <ul>
                            <li id="admin-settings"><i class="fas fa-cog"></i> 账号设置</li>
                            <li id="admin-logout"><i class="fas fa-sign-out-alt"></i> 退出登录</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="admin-container">
                <div class="admin-sidebar">
                    <ul class="admin-menu">
                        <li class="active" data-tab="dashboard">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>控制面板</span>
                        </li>
                        <li data-tab="orders">
                            <i class="fas fa-shopping-bag"></i>
                            <span>订单管理</span>
                            <span class="badge">5</span>
                        </li>
                        <li data-tab="products">
                            <i class="fas fa-fish"></i>
                            <span>商品管理</span>
                        </li>
                        <li data-tab="sourcing">
                            <i class="fas fa-search"></i>
                            <span>货源管理</span>
                        </li>
                        <li data-tab="fulfillment">
                            <i class="fas fa-shipping-fast"></i>
                            <span>发货管理</span>
                        </li>
                        <li data-tab="customers">
                            <i class="fas fa-users"></i>
                            <span>客户管理</span>
                        </li>
                        <li data-tab="statistics">
                            <i class="fas fa-chart-line"></i>
                            <span>数据统计</span>
                        </li>
                        <li data-tab="settings">
                            <i class="fas fa-cog"></i>
                            <span>系统设置</span>
                        </li>
                    </ul>
                </div>
                
                <div class="admin-content">
                    <!-- 控制面板 -->
                    <div class="admin-tab-content active" id="dashboard-content">
                        <h2>控制面板</h2>
                        
                        <div class="admin-stats">
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-shopping-bag"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">15</div>
                                    <div class="stat-label">今日订单</div>
                                </div>
                                <div class="stat-change up">
                                    <i class="fas fa-arrow-up"></i>
                                    <span>12%</span>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-yuan-sign"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">¥2,860</div>
                                    <div class="stat-label">今日销售额</div>
                                </div>
                                <div class="stat-change up">
                                    <i class="fas fa-arrow-up"></i>
                                    <span>8%</span>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-users"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">128</div>
                                    <div class="stat-label">访客数量</div>
                                </div>
                                <div class="stat-change down">
                                    <i class="fas fa-arrow-down"></i>
                                    <span>3%</span>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-box"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">5</div>
                                    <div class="stat-label">待发货</div>
                                </div>
                                <div class="stat-change nochange">
                                    <i class="fas fa-minus"></i>
                                    <span>0%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="admin-charts">
                            <div class="chart-container">
                                <h3>销售趋势</h3>
                                <div class="chart-placeholder">
                                    <div class="chart-bars">
                                        <div class="chart-bar" style="height: 40%"></div>
                                        <div class="chart-bar" style="height: 60%"></div>
                                        <div class="chart-bar" style="height: 45%"></div>
                                        <div class="chart-bar" style="height: 70%"></div>
                                        <div class="chart-bar" style="height: 65%"></div>
                                        <div class="chart-bar" style="height: 90%"></div>
                                        <div class="chart-bar" style="height: 80%"></div>
                                    </div>
                                    <div class="chart-labels">
                                        <span>周一</span>
                                        <span>周二</span>
                                        <span>周三</span>
                                        <span>周四</span>
                                        <span>周五</span>
                                        <span>周六</span>
                                        <span>周日</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="chart-container">
                                <h3>热销商品</h3>
                                <ul class="trending-products">
                                    <li>
                                        <div class="product-rank">1</div>
                                        <div class="product-image">
                                            <img src="img/product-1.jpg" alt="钓鱼竿">
                                        </div>
                                        <div class="product-info">
                                            <div class="product-name">超轻碳素台钓竿</div>
                                            <div class="product-sales">售出 32 件</div>
                                        </div>
                                        <div class="product-price">¥128</div>
                                    </li>
                                    <li>
                                        <div class="product-rank">2</div>
                                        <div class="product-image">
                                            <img src="img/product-2.jpg" alt="渔线">
                                        </div>
                                        <div class="product-info">
                                            <div class="product-name">高强度尼龙渔线</div>
                                            <div class="product-sales">售出 28 件</div>
                                        </div>
                                        <div class="product-price">¥45</div>
                                    </li>
                                    <li>
                                        <div class="product-rank">3</div>
                                        <div class="product-image">
                                            <img src="img/product-3.jpg" alt="鱼饵">
                                        </div>
                                        <div class="product-info">
                                            <div class="product-name">万能诱鱼小药</div>
                                            <div class="product-sales">售出 25 件</div>
                                        </div>
                                        <div class="product-price">¥36</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="recent-orders">
                            <div class="section-header">
                                <h3>最近订单</h3>
                                <a href="#" class="view-all">查看全部</a>
                            </div>
                            <table class="orders-table">
                                <thead>
                                    <tr>
                                        <th>订单号</th>
                                        <th>客户</th>
                                        <th>商品</th>
                                        <th>金额</th>
                                        <th>状态</th>
                                        <th>下单时间</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>#DY28431</td>
                                        <td>张先生</td>
                                        <td>碳素钓鱼竿套装</td>
                                        <td>¥458</td>
                                        <td><span class="status pending">待发货</span></td>
                                        <td>2023-05-15 10:23</td>
                                        <td>
                                            <button class="btn-action ship-btn">发货</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>#DY28430</td>
                                        <td>李女士</td>
                                        <td>全套浮漂鱼钩组合</td>
                                        <td>¥128</td>
                                        <td><span class="status shipped">已发货</span></td>
                                        <td>2023-05-15 09:46</td>
                                        <td>
                                            <button class="btn-action track-btn">物流</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>#DY28429</td>
                                        <td>王先生</td>
                                        <td>专业路亚竿</td>
                                        <td>¥680</td>
                                        <td><span class="status completed">已完成</span></td>
                                        <td>2023-05-14 16:28</td>
                                        <td>
                                            <button class="btn-action detail-btn">详情</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <!-- 其他标签页内容 -->
                    <div class="admin-tab-content" id="orders-content">
                        <h2>订单管理</h2>
                        <div class="order-filters">
                            <div class="filter-group">
                                <select class="order-status-filter">
                                    <option value="all">全部订单</option>
                                    <option value="pending">待付款</option>
                                    <option value="paid">已付款</option>
                                    <option value="shipped">已发货</option>
                                    <option value="completed">已完成</option>
                                    <option value="cancelled">已取消</option>
                                </select>
                                <div class="date-range">
                                    <input type="date" class="date-start" placeholder="开始日期">
                                    <span>至</span>
                                    <input type="date" class="date-end" placeholder="结束日期">
                                </div>
                                <button class="btn search-btn">搜索</button>
                                <button class="btn reset-btn">重置</button>
                            </div>
                            <div class="batch-actions">
                                <button class="btn batch-fulfill-btn" id="batch-fulfill-btn">批量代发</button>
                                <button class="btn export-btn">导出订单</button>
                            </div>
                        </div>
                        
                        <!-- 订单表格 -->
                        <table class="orders-table full-width">
                            <thead>
                                <tr>
                                    <th><input type="checkbox" class="select-all"></th>
                                    <th>订单号</th>
                                    <th>客户信息</th>
                                    <th>商品信息</th>
                                    <th>金额</th>
                                    <th>支付方式</th>
                                    <th>订单状态</th>
                                    <th>下单时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input type="checkbox" class="order-select"></td>
                                    <td>#DY28431</td>
                                    <td>
                                        <div>张先生</div>
                                        <div class="small-text">138****5678</div>
                                    </td>
                                    <td>
                                        <div class="order-products">
                                            <img src="img/product-1.jpg" alt="碳素钓鱼竿">
                                            <div>碳素钓鱼竿套装 x1</div>
                                        </div>
                                    </td>
                                    <td>¥458</td>
                                    <td>抖音支付</td>
                                    <td><span class="status pending">待发货</span></td>
                                    <td>2023-05-15 10:23</td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="btn-action ship-btn">发货</button>
                                            <button class="btn-action detail-btn">详情</button>
                                        </div>
                                    </td>
                                </tr>
                                <!-- 更多订单行 -->
                            </tbody>
                        </table>
                        
                        <!-- 分页 -->
                        <div class="pagination">
                            <button class="page-btn prev-btn" disabled>上一页</button>
                            <div class="page-numbers">
                                <button class="page-number active">1</button>
                                <button class="page-number">2</button>
                                <button class="page-number">3</button>
                                <span>...</span>
                                <button class="page-number">10</button>
                            </div>
                            <button class="page-btn next-btn">下一页</button>
                            <span class="page-info">共10页，每页20条</span>
                        </div>
                    </div>
                    
                    <!-- 货源管理标签页 -->
                    <div class="admin-tab-content" id="sourcing-content">
                        <h2>货源管理</h2>
                        <div class="sourcing-container">
                            <div class="alibaba-search">
                                <h3>阿里巴巴货源搜索</h3>
                                <div class="search-box">
                                    <input type="text" placeholder="输入关键词搜索阿里巴巴货源">
                                    <button class="search-btn">搜索</button>
                                </div>
                                <div class="hot-keywords">
                                    <span class="keyword-label">热门搜索:</span>
                                    <a href="#" class="keyword">钓鱼竿</a>
                                    <a href="#" class="keyword">渔线</a>
                                    <a href="#" class="keyword">鱼饵</a>
                                    <a href="#" class="keyword">渔具套装</a>
                                    <a href="#" class="keyword">浮漂</a>
                                </div>
                            </div>
                            
                            <div class="product-mapping">
                                <h3>商品映射管理</h3>
                                <table class="mapping-table">
                                    <thead>
                                        <tr>
                                            <th width="200px">我的商品</th>
                                            <th width="250px">阿里巴巴货源</th>
                                            <th>价格差</th>
                                            <th>利润率</th>
                                            <th>状态</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div class="product-cell">
                                                    <img src="img/product-1.jpg" alt="碳素钓鱼竿">
                                                    <div>碳素钓鱼竿套装</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="alibaba-cell">
                                                    <img src="img/alibaba-1.jpg" alt="阿里巴巴碳素钓鱼竿">
                                                    <div>碳素台钓竿3.9米轻硬28调</div>
                                                </div>
                                            </td>
                                            <td>¥258</td>
                                            <td>56.3%</td>
                                            <td><span class="status active">可用</span></td>
                                            <td>
                                                <button class="btn-action edit-btn">编辑</button>
                                                <button class="btn-action delete-btn">删除</button>
                                            </td>
                                        </tr>
                                        <!-- 更多映射行 -->
                                    </tbody>
                                </table>
                                <button class="btn add-mapping-btn">添加新映射</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="admin-footer">
                <div>程老板渔具管理系统 &copy; 2023 All Rights Reserved</div>
                <button id="return-to-store" class="btn return-btn">返回商城</button>
            </div>
        `;
        
        // 添加到页面
        document.body.appendChild(adminPanel);
        document.body.style.overflow = 'hidden'; // 防止背景滚动
        
        // 添加事件监听
        this.initializeAdminPanelEvents();
    }
    
    // 初始化后台面板事件
    initializeAdminPanelEvents() {
        const adminPanel = document.getElementById('taobao-admin-panel');
        
        if (!adminPanel) return;
        
        // 导航菜单切换
        const menuItems = adminPanel.querySelectorAll('.admin-menu li');
        
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                // 移除所有激活状态
                menuItems.forEach(i => i.classList.remove('active'));
                // 添加当前激活状态
                item.classList.add('active');
                
                // 切换内容
                const tabName = item.getAttribute('data-tab');
                const tabContents = adminPanel.querySelectorAll('.admin-tab-content');
                
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });
                
                const currentContent = adminPanel.querySelector(`#${tabName}-content`);
                if (currentContent) {
                    currentContent.classList.add('active');
                }
            });
        });
        
        // 批量代发按钮
        const batchFulfillBtn = adminPanel.querySelector('#batch-fulfill-btn');
        if (batchFulfillBtn) {
            batchFulfillBtn.addEventListener('click', () => {
                this.cart.batchFulfillmentFromAlibaba();
            });
        }
        
        // 用户下拉菜单
        const userAvatar = adminPanel.querySelector('.admin-avatar');
        if (userAvatar) {
            userAvatar.addEventListener('click', () => {
                const dropdown = adminPanel.querySelector('.admin-dropdown');
                dropdown.classList.toggle('active');
            });
        }
        
        // 退出登录
        const logoutBtn = adminPanel.querySelector('#admin-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                // 移除后台面板
                document.body.removeChild(adminPanel);
                document.body.style.overflow = ''; // 恢复滚动
                showMessage('已退出管理系统', 'info');
            });
        }
        
        // 返回商城
        const returnBtn = adminPanel.querySelector('#return-to-store');
        if (returnBtn) {
            returnBtn.addEventListener('click', () => {
                // 隐藏后台面板
                adminPanel.classList.remove('active');
                document.body.style.overflow = ''; // 恢复滚动
            });
        }
    }
}

// 在DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    app.initialize();
}); 