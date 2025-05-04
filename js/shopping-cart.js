/**
 * 购物车类
 */
class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadCartItems();
        
        // 初始化购物车UI事件
        this.initializeEventListeners();
    }
    
    // ... existing code ...
    
    // 批量从阿里巴巴代发商品（管理员功能）
    batchFulfillmentFromAlibaba() {
        if (this.items.length === 0) {
            showMessage('购物车为空，没有可处理的订单', 'warning');
            return;
        }
        
        // 创建批量处理模态框
        const modalHTML = `
            <div class="batch-fulfillment-modal modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h2>阿里巴巴批量订单处理</h2>
                    <div class="cart-items-list">
                        <h3>订单商品（${this.items.length}件）</h3>
                        <ul class="batch-items">
                            ${this.items.map(item => `
                                <li>
                                    <div class="item-info">
                                        <img src="${item.image}" alt="${item.name}">
                                        <div class="item-details">
                                            <h4>${item.name}</h4>
                                            <p>数量: ${item.quantity}</p>
                                            <p>单价: ¥${item.price.toFixed(2)}</p>
                                            <p>阿里巴巴链接: <a href="${item.alibabaLink || '#'}" target="_blank" class="alibaba-link">
                                                ${item.alibabaLink ? '查看链接' : '无链接'}
                                            </a></p>
                                        </div>
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div class="order-total">
                        <h3>订单总计: ¥${this.calculateTotal().toFixed(2)}</h3>
                    </div>
                    
                    <div class="receiver-info">
                        <h3>收货人信息</h3>
                        <div class="form-group">
                            <label for="receiver-name">收货人:</label>
                            <input type="text" id="receiver-name" placeholder="姓名">
                        </div>
                        <div class="form-group">
                            <label for="receiver-phone">手机号:</label>
                            <input type="tel" id="receiver-phone" placeholder="联系电话">
                        </div>
                        <div class="form-group">
                            <label for="receiver-address">收货地址:</label>
                            <textarea id="receiver-address" placeholder="详细地址"></textarea>
                        </div>
                    </div>
                    
                    <div class="fulfillment-options">
                        <h3>发货选项</h3>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="combined-shipping" checked>
                                合并发货（节省运费）
                            </label>
                        </div>
                        <div class="form-group">
                            <label for="shipping-method">物流方式:</label>
                            <select id="shipping-method">
                                <option value="default">默认物流</option>
                                <option value="express">快递</option>
                                <option value="ems">EMS</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="remarks">备注:</label>
                            <textarea id="remarks" placeholder="备注信息"></textarea>
                        </div>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="btn batch-process-btn">批量处理订单</button>
                        <button class="btn cancel-btn">取消</button>
                    </div>
                </div>
            </div>
        `;
        
        // 添加到页面
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // 获取模态框元素
        const modal = document.querySelector('.batch-fulfillment-modal');
        
        // 显示模态框
        modal.classList.add('active');
        
        // 关闭按钮事件
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            // 延迟移除DOM
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });
        
        // 点击模态框背景关闭
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                modal.classList.remove('active');
                // 延迟移除DOM
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            }
        });
        
        // 取消按钮事件
        const cancelBtn = modal.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            // 延迟移除DOM
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });
        
        // 批量处理按钮事件
        const processBtn = modal.querySelector('.batch-process-btn');
        processBtn.addEventListener('click', () => {
            // 获取收货信息
            const name = document.getElementById('receiver-name').value;
            const phone = document.getElementById('receiver-phone').value;
            const address = document.getElementById('receiver-address').value;
            
            // 验证必填信息
            if (!name || !phone || !address) {
                showMessage('请完整填写收货人信息', 'error');
                return;
            }
            
            // 处理订单逻辑 - 这里可以添加实际的订单处理代码
            showMessage('订单已提交处理', 'success');
            
            // 清空购物车
            this.clearCart();
            
            // 关闭模态框
            modal.classList.remove('active');
            // 延迟移除DOM
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });
    }
    
    // ... existing code ...
} 