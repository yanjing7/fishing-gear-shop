/**
 * 抖音橱窗商品爬取和处理工具
 * 注意：由于跨域限制，实际运行时需要使用代理服务或后端API来获取抖音数据
 */

class DouyinScraper {
    constructor() {
        this.proxyUrl = 'https://corsproxy.io/?'; // CORS代理服务，实际部署可以改为自己的代理
        this.cacheKey = 'douyin_products_cache';
        this.cacheExpiry = 3600000; // 缓存有效期：1小时（毫秒）
        this.apiEndpoints = {
            userProfile: (userId) => `https://www.douyin.com/user/${userId}`,
            shopWindow: (userId) => `https://www.douyin.com/aweme/v1/web/shop/window/products/?device_platform=webapp&aid=6383&user_id=${userId}&count=20&cursor=0`,
            productDetail: (productId) => `https://www.douyin.com/product/${productId}`
        };
        this.shareCodeKey = 'douyin_share_code'; // 存储抖音分享口令的键
    }

    /**
     * 获取抖音用户店铺橱窗商品
     * @param {string} userId 抖音用户ID
     * @returns {Promise<Array>} 商品数组
     */
    async fetchProducts(userId) {
        // 先检查缓存
        const cachedProducts = this.getProductsFromCache();
        if (cachedProducts) {
            console.log('从缓存加载抖音商品数据');
            return cachedProducts;
        }
        
        try {
            console.log(`正在从抖音获取用户 ${userId} 的商品数据...`);
            
            // 由于现在是前端项目，无法真正抓取抖音数据，这里模拟API请求
            // 在实际应用中，这里应当发起真实的API请求或使用后端服务抓取数据
            const simulatedResponse = await this.simulateApiRequest(userId);
            
            if (simulatedResponse && simulatedResponse.products && simulatedResponse.products.length > 0) {
                // 缓存数据
                this.cacheProducts(simulatedResponse.products);
                return simulatedResponse.products;
            } else {
                console.log('抖音未返回有效数据，使用演示数据');
                return this.getAndCacheDemoProducts();
            }
        } catch (error) {
            console.error('抖音数据获取失败:', error);
            // 返回演示数据
            return this.getAndCacheDemoProducts();
        }
    }
    
    /**
     * 保存抖音分享口令
     * @param {string} shareCode 抖音分享口令
     */
    saveShareCode(shareCode) {
        if (!shareCode) return;
        
        try {
            localStorage.setItem(this.shareCodeKey, shareCode);
            console.log('抖音分享口令已保存');
        } catch (error) {
            console.error('保存抖音分享口令失败:', error);
        }
    }
    
    /**
     * 获取保存的抖音分享口令
     * @returns {string|null} 抖音分享口令或null
     */
    getShareCode() {
        try {
            return localStorage.getItem(this.shareCodeKey);
        } catch (error) {
            console.error('获取抖音分享口令失败:', error);
            return null;
        }
    }
    
    /**
     * 解析抖音分享口令中的商品ID
     * @param {string} shareCode 抖音分享口令
     * @returns {string|null} 提取的商品ID或null
     */
    parseShareCodeProductId(shareCode) {
        if (!shareCode) return null;
        
        // 常见的抖音分享口令格式包含特定的标识，尝试提取
        const patterns = [
            /бб([a-zA-Z0-9]+)бб/,  // 匹配类似бб123бб的格式
            /http[s]?:\/\/[^\s]+/,  // 匹配URL格式
            /[a-zA-Z0-9]{8,}/       // 匹配可能的ID格式（8位以上的字母数字组合）
        ];
        
        for (const pattern of patterns) {
            const match = shareCode.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        return null;
    }
    
    /**
     * 模拟API请求
     * @param {string} userId - 抖音用户ID
     * @returns {Promise<Object>} - 模拟的响应数据
     */
    async simulateApiRequest(userId) {
        // 这里模拟一个API请求延迟和可能的失败
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 模拟失败的概率，让它始终失败以便演示备用数据功能
                const shouldFail = true;
                
                if (shouldFail) {
                    reject(new Error('模拟的API请求失败'));
                } else {
                    // 实际项目中这里会返回真实数据
                    resolve({
                        success: true,
                        products: []
                    });
                }
            }, 1000); // 模拟网络延迟
        });
    }
    
    /**
     * 从缓存获取产品数据
     * @returns {Array|null} - 缓存的商品数据，如果没有有效缓存则返回null
     */
    getProductsFromCache() {
        try {
            const cachedData = localStorage.getItem(this.cacheKey);
            
            if (!cachedData) {
                return null;
            }
            
            const { timestamp, products } = JSON.parse(cachedData);
            const now = Date.now();
            
            // 检查缓存是否过期
            if (now - timestamp > this.cacheExpiry) {
                console.log('缓存已过期');
                return null;
            }
            
            return products;
        } catch (error) {
            console.error('读取缓存失败:', error);
            return null;
        }
    }
    
    /**
     * 缓存商品数据
     * @param {Array} products - 要缓存的商品数据
     */
    cacheProducts(products) {
        try {
            const cacheData = {
                timestamp: Date.now(),
                products: products
            };
            
            localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
            console.log('商品数据已缓存');
        } catch (error) {
            console.error('缓存商品数据失败:', error);
        }
    }
    
    /**
     * 获取并缓存演示数据
     * @returns {Array} - 演示商品数据
     */
    getAndCacheDemoProducts() {
        let demoProducts = [];
        
        // 首先尝试从全局变量获取（如果已经被加载）
        if (typeof DEMO_PRODUCTS !== 'undefined') {
            demoProducts = DEMO_PRODUCTS;
        } 
        // 然后尝试从外部脚本导入
        else if (typeof require !== 'undefined') {
            try {
                const { DEMO_PRODUCTS } = require('./demo-data.js');
                demoProducts = DEMO_PRODUCTS;
            } catch (e) {
                console.error('无法加载演示数据模块:', e);
            }
        }
        
        // 如果仍然没有数据，则使用硬编码的备用数据
        if (demoProducts.length === 0) {
            demoProducts = this.getFallbackProducts();
        }
        
        // 缓存演示数据
        this.cacheProducts(demoProducts);
        return demoProducts;
    }
    
    /**
     * 最后的备用产品数据
     * @returns {Array} - 硬编码的备用商品数据
     */
    getFallbackProducts() {
        return [
            {
                id: 'custom-hook-001',
                title: '程老板定制串钩',
                description: '专业钓鱼串钩，适合黄辣丁、小鲶鱼等远河野钓，高强度耐用，售价7元/付，3付起卖。',
                price: '7',
                originalPrice: '10',
                category: '钓鱼配件',
                sales: '128',
                imageUrl: 'img/custom-hooks-1.jpg',
                minimumOrder: 3,
                detailImages: [
                    'img/custom-hooks-1.jpg',
                    'img/custom-hooks-2.jpg',
                    'img/custom-hooks-3.jpg'
                ]
            },
            {
                id: 'backup-product-001',
                title: '高强度钓鱼竿',
                description: '碳素钓鱼竿，强韧耐用，适合各种野钓环境',
                price: '158',
                originalPrice: '198',
                category: '钓鱼竿',
                sales: '86',
                imageUrl: 'https://via.placeholder.com/400x300/4a7043/ffffff?text=高强度钓鱼竿',
                minimumOrder: 1
            }
        ];
    }
}

// 导出供其他文件使用
window.DouyinScraper = DouyinScraper; 