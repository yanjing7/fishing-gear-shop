/**
 * 抖音橱窗商品爬取和处理工具
 * 注意：由于跨域限制，实际运行时需要使用代理服务或后端API来获取抖音数据
 */

class DouyinScraper {
    constructor() {
        this.proxyUrl = 'https://corsproxy.io/?'; // CORS代理服务，实际部署可以改为自己的代理
        this.cacheKey = 'douyin_products_cache';
        this.cacheDuration = 1800000; // 缓存30分钟
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
        try {
            // 检查缓存
            const cachedData = this.getFromCache();
            if (cachedData) {
                console.log('使用缓存的商品数据');
                return cachedData;
            }

            console.log('开始获取抖音橱窗商品...');
            
            // 先尝试使用API直接获取商品数据
            const products = await this.fetchProductsFromApi(userId);
            
            if (products && products.length > 0) {
                // 保存到本地缓存
                this.saveToCache(products);
                return products;
            }
            
            // 如果API方式失败，尝试从用户页面抓取
            return await this.fetchProductsFromUserPage(userId);
        } catch (error) {
            console.error('获取抖音商品失败:', error);
            
            // 如果请求失败但有缓存，返回缓存数据
            const cachedData = this.getFromCache();
            if (cachedData) {
                console.log('请求失败，使用缓存数据');
                return cachedData;
            }
            
            // 完全失败时，返回一些示例数据以供展示
            return this.getFallbackProducts();
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
     * 尝试直接从抖音商品API获取数据
     * 这种方式更稳定，但可能会遇到更严格的访问限制
     */
    async fetchProductsFromApi(userId) {
        try {
            const apiUrl = `${this.proxyUrl}${this.apiEndpoints.shopWindow(userId)}`;
            
            const headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': `https://www.douyin.com/user/${userId}`,
                'Accept': 'application/json, text/plain, */*'
            };
            
            const response = await fetch(apiUrl, { headers });
            
            if (!response.ok) {
                console.warn(`API请求失败: ${response.status}`);
                return null;
            }
            
            const data = await response.json();
            
            if (data && data.products_info && Array.isArray(data.products_info)) {
                return data.products_info.map(item => ({
                    id: item.product_id,
                    title: item.title,
                    price: item.price,
                    originalPrice: item.original_price,
                    imageUrl: item.cover.url_list[0],
                    detailUrl: `https://www.douyin.com/product/${item.product_id}`,
                    sales: item.sales_count || '0',
                    category: item.category_name || '渔具',
                    description: item.description || item.title
                }));
            }
            
            return null;
        } catch (error) {
            console.warn('从API获取商品数据失败:', error);
            return null;
        }
    }
    
    /**
     * 从用户页面获取橱窗商品信息
     */
    async fetchProductsFromUserPage(userId) {
        try {
            const url = `${this.proxyUrl}${this.apiEndpoints.userProfile(userId)}`;
            
            // 模拟获取抖音页面内容
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            
            if (!response.ok) {
                throw new Error(`无法获取抖音页面: ${response.status}`);
            }
            
            const html = await response.text();
            
            // 解析HTML内容寻找商品数据
            const products = this.parseProductsFromHtml(html, userId);
            
            // 保存到本地缓存
            this.saveToCache(products);
            
            return products;
        } catch (error) {
            console.error('从用户页面获取抖音商品失败:', error);
            return this.getFallbackProducts();
        }
    }
    
    /**
     * 从HTML中解析商品数据
     * 注意：实际实现需要根据抖音网页结构调整
     */
    parseProductsFromHtml(html, userId) {
        // 实际项目中，这里需要使用正则表达式或DOM解析抖音页面中的商品数据
        // 以下是示例解析逻辑，实际代码需要根据抖音页面结构调整
        
        try {
            // 查找包含商品数据的JSON字符串 - 方法1
            // 抖音通常在页面中嵌入初始数据，可能在window.__INITIAL_STATE__中
            const regex = /window\.__INITIAL_STATE__\s*=\s*({.+?});/;
            const match = html.match(regex);
            
            if (match && match[1]) {
                try {
                    const initialState = JSON.parse(match[1]);
                    
                    // 在initialState中寻找商品数据
                    // 具体路径需要根据抖音页面结构确定
                    const shopProducts = initialState?.shopModule?.products || 
                                        initialState?.shop?.products ||
                                        initialState?.userInfo?.shop?.products ||
                                        [];
                    
                    if (shopProducts.length > 0) {
                        return shopProducts.map(item => ({
                            id: item.product_id,
                            title: item.title,
                            price: item.price,
                            originalPrice: item.original_price,
                            imageUrl: item.cover_url,
                            detailUrl: `https://www.douyin.com/product/${item.product_id}`,
                            sales: item.sales || '0',
                            category: item.category_name || '渔具',
                            description: item.description || item.title
                        }));
                    }
                } catch (e) {
                    console.warn('解析INITIAL_STATE失败:', e);
                }
            }
            
            // 方法2: 寻找特定的JSON数据块
            const renderDataRegex = /<script id="RENDER_DATA"[^>]*>([^<]+)<\/script>/;
            const renderMatch = html.match(renderDataRegex);
            
            if (renderMatch && renderMatch[1]) {
                try {
                    const decodedData = decodeURIComponent(renderMatch[1]);
                    const renderData = JSON.parse(decodedData);
                    
                    // 在renderData中寻找商品信息
                    const shopData = renderData?.app?.shop || 
                                    renderData?.user?.shop ||
                                    renderData?.shop;
                                    
                    if (shopData && shopData.products && shopData.products.length > 0) {
                        return shopData.products.map(item => ({
                            id: item.product_id,
                            title: item.title,
                            price: item.price,
                            originalPrice: item.original_price || '',
                            imageUrl: item.cover?.url_list?.[0] || item.cover_url,
                            detailUrl: `https://www.douyin.com/product/${item.product_id}`,
                            sales: item.sales_count || '0',
                            category: item.category_name || '渔具',
                            description: item.description || item.title
                        }));
                    }
                } catch (e) {
                    console.warn('解析RENDER_DATA失败:', e);
                }
            }
            
            // 方法3: 如果无法解析结构化数据，使用正则表达式尝试提取商品链接和基本信息
            const productRegex = /<a[^>]*href="\/product\/([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
            const products = [];
            let productMatch;
            
            while ((productMatch = productRegex.exec(html)) !== null) {
                const productId = productMatch[1];
                const productContent = productMatch[2];
                
                // 从内容中提取标题和价格
                const titleMatch = /<div[^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/div>/i.exec(productContent);
                const priceMatch = /<span[^>]*class="[^"]*price[^"]*"[^>]*>([\s\S]*?)<\/span>/i.exec(productContent);
                const imageMatch = /<img[^>]*src="([^"]+)"[^>]*>/i.exec(productContent);
                
                if (titleMatch || priceMatch) {
                    products.push({
                        id: productId,
                        title: titleMatch ? titleMatch[1].trim() : `商品${products.length + 1}`,
                        price: priceMatch ? priceMatch[1].replace(/[^\d.]/g, '') : '0',
                        originalPrice: '',
                        imageUrl: imageMatch ? imageMatch[1] : 'img/product-placeholder.jpg',
                        detailUrl: `https://www.douyin.com/product/${productId}`,
                        sales: '0',
                        category: '渔具',
                        description: titleMatch ? titleMatch[1].trim() : `商品${products.length + 1}详情`
                    });
                }
            }
            
            if (products.length > 0) {
                return products;
            }
            
            // 如果还是无法解析，返回备用数据
            return this.getFallbackProducts();
        } catch (error) {
            console.error('解析商品数据失败:', error);
            return this.getFallbackProducts();
        }
    }
    
    /**
     * 保存商品数据到本地缓存
     */
    saveToCache(products) {
        if (!products || products.length === 0) return;
        
        const cacheData = {
            timestamp: Date.now(),
            products: products
        };
        
        localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
    }
    
    /**
     * 从本地缓存获取商品数据
     */
    getFromCache() {
        try {
            const cachedData = localStorage.getItem(this.cacheKey);
            if (!cachedData) return null;
            
            const cache = JSON.parse(cachedData);
            const now = Date.now();
            
            // 检查缓存是否过期
            if (now - cache.timestamp < this.cacheDuration) {
                return cache.products;
            }
            
            return null;
        } catch (error) {
            console.error('读取缓存失败:', error);
            return null;
        }
    }
    
    /**
     * 获取备用商品数据（当无法从抖音获取时使用）
     */
    getFallbackProducts() {
        // 如果存在demo-data.js提供的数据，则使用它
        if (window.fallbackProductsJson) {
            try {
                return JSON.parse(window.fallbackProductsJson);
            } catch (error) {
                console.error('解析备用JSON数据失败:', error);
            }
        }

        // 如果demo-data不可用或解析失败，使用硬编码数据
        return [
            {
                id: 'raft-rod-001',
                title: '2.1米野钓筏竿',
                price: '168.00',
                originalPrice: '198.00',
                imageUrl: window.demoProductImages ? window.demoProductImages[0] : 'img/product1.jpg',
                detailUrl: '#',
                sales: '326',
                category: '鱼竿',
                description: '软调夜光竿稍，灵敏探黄辣丁轻口，坚韧抗鲶鱼拉力，运河必备。'
            },
            {
                id: 'spinning-reel-001',
                title: '1000型野钓纺车轮',
                price: '119.00',
                originalPrice: '139.00',
                imageUrl: window.demoProductImages ? window.demoProductImages[1] : 'img/product2.jpg',
                detailUrl: '#',
                sales: '158',
                category: '鱼轮',
                description: '4-6kg泄力，6+1轴承，夜钓顺滑，抗运河波浪干扰。'
            },
            {
                id: 'pe-line-001',
                title: '0.8号PE线',
                price: '38.00',
                originalPrice: '45.00',
                imageUrl: window.demoProductImages ? window.demoProductImages[2] : 'img/product3.jpg',
                detailUrl: '#',
                sales: '521',
                category: '线组',
                description: '8编高强度，耐磨抗桩基刮擦，适合运河野钓，100米。'
            },
            {
                id: 'hooks-001',
                title: '伊势尼鱼钩套装',
                price: '15.80',
                originalPrice: '20.00',
                imageUrl: window.demoProductImages ? window.demoProductImages[3] : 'img/product4.jpg',
                detailUrl: '#',
                sales: '1024',
                category: '配件',
                description: '4-9号（黄辣丁/鲶鱼），锋利耐用，野钓利器。'
            },
            {
                id: 'float-001',
                title: '夜光筏钓漂',
                price: '25.80',
                originalPrice: '35.00',
                imageUrl: window.demoProductImages ? window.demoProductImages[4] : 'img/product5.jpg',
                detailUrl: '#',
                sales: '687',
                category: '配件',
                description: '吃铅1-3克，高亮漂尾，抗运河波浪，夜钓黄辣丁、鳗鱼必备。'
            },
            {
                id: 'bait-001',
                title: '野钓活饵及窝料',
                price: '36.90',
                originalPrice: '45.00',
                imageUrl: window.demoProductImages ? window.demoProductImages[5] : 'img/product6.jpg',
                detailUrl: '#',
                sales: '452',
                category: '饵料',
                description: '蚯蚓、鸡肝、酒米，引黄辣丁、鲶鱼、鳗鱼，运河鱼群聚集。'
            },
            {
                id: 'rod-001',
                title: '4.5米碳素鱼竿',
                price: '229.00',
                originalPrice: '289.00',
                imageUrl: window.demoProductImages ? window.demoProductImages[6] : 'img/product7.jpg',
                detailUrl: '#',
                sales: '76',
                category: '鱼竿',
                description: '超轻碳素材质，28调性能，远投近钓两相宜，手感舒适，抗疲劳。'
            },
            {
                id: 'tackle-box-001',
                title: '多功能渔具盒',
                price: '59.90',
                originalPrice: '79.00',
                imageUrl: window.demoProductImages ? window.demoProductImages[7] : 'img/product8.jpg',
                detailUrl: '#',
                sales: '215',
                category: '配件',
                description: '防水设计，多层隔断，收纳鱼钩、铅坠、浮漂等小配件，野钓必备。'
            }
        ];
    }
}

// 导出供其他文件使用
window.DouyinScraper = DouyinScraper; 