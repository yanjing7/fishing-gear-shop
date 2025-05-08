/**
 * 演示数据 - 供网站初始化使用
 */

// QR码URL - 如果img/qrcode.jpg不存在，将使用这个作为备用
window.qrcodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://www.douyin.com/user/MS4wLjABAAAA8jzJnzR9cQ-hFRhpzqISFcsDIS_B0gmsuX0OFLVy-mOXsfnOWkujToJ6JM8TmhJJ';

// 演示商品图片URLs - 这些URLs在网页加载时会检查img/product*.jpg是否存在，如果不存在则使用这些URL作为备用
window.demoProductImages = [
    'https://via.placeholder.com/400x300/4a7043/ffffff?text=筏竿',
    'https://via.placeholder.com/400x300/2a4d69/ffffff?text=纺车轮',
    'https://via.placeholder.com/400x300/e63946/ffffff?text=PE线',
    'https://via.placeholder.com/400x300/457b9d/ffffff?text=鱼钩',
    'https://via.placeholder.com/400x300/1d3557/ffffff?text=夜光漂',
    'https://via.placeholder.com/400x300/f1faee/333333?text=饵料',
    'https://via.placeholder.com/400x300/a8dadc/333333?text=碳素竿',
    'https://via.placeholder.com/400x300/fca311/ffffff?text=渔具盒'
];

// 产品类别
window.productCategories = [
    '鱼竿',
    '鱼轮',
    '线组',
    '配件',
    '饵料',
    '工具'
];

// 背景图URL - 如果img/hero-bg.jpg不存在，将使用这个作为备用
window.heroBgUrl = 'https://via.placeholder.com/1920x1080/2a4d69/ffffff?text=野钓张家港运河';

// 简单检查本地图片是否存在，如果不存在则使用备用URL
document.addEventListener('DOMContentLoaded', () => {
    // 检查和设置QR码
    const qrcodeImg = document.querySelector('.qrcode-section img');
    if (qrcodeImg) {
        const img = new Image();
        img.onload = () => console.log('本地QR码图片加载成功');
        img.onerror = () => {
            console.log('本地QR码图片不存在，使用在线生成的QR码');
            qrcodeImg.src = window.qrcodeUrl;
        };
        img.src = qrcodeImg.src;
    }
    
    // 检查和设置英雄区背景图
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const computedStyle = getComputedStyle(heroSection);
        const bgImage = computedStyle.backgroundImage;
        
        if (bgImage === 'none' || bgImage.includes('missing')) {
            heroSection.style.backgroundImage = `url('${window.heroBgUrl}')`;
        }
    }
    
    // 在douyin-scraper.js的getFallbackProducts方法中使用这些图片URL
});

// 为了防止跨域问题，当抖音API调用失败时，可以使用这个JSON作为备用数据
window.fallbackProductsJson = `[
    {
        "id": "custom-hooks",
        "name": "程老板定制串钩",
        "price": 7.00,
        "originalPrice": 10.00,
        "imageUrl": "https://via.placeholder.com/400x300/4a7043/ffffff?text=程老板定制串钩",
        "description": "专业钓鱼串钩，适合黄辣丁、小鲶鱼等运河野钓，高强度耐用，售价7元/付，3付起卖。",
        "category": "饵料",
        "inStock": true,
        "isFeatured": true,
        "douyinCode": "23897650921",
        "url": "https://v.douyin.com/h4UKpJR/",
        "minimumOrder": 3
    },
    {
        "id": "raft-rod-001",
        "title": "2.1米野钓筏竿",
        "price": "168.00",
        "originalPrice": "198.00",
        "imageUrl": "${window.demoProductImages[0]}",
        "detailUrl": "#",
        "sales": "326",
        "category": "鱼竿",
        "description": "软调夜光竿稍，灵敏探黄辣丁轻口，坚韧抗鲶鱼拉力，运河必备。"
    },
    {
        "id": "spinning-reel-001",
        "title": "1000型野钓纺车轮",
        "price": "119.00",
        "originalPrice": "139.00",
        "imageUrl": "${window.demoProductImages[1]}",
        "detailUrl": "#",
        "sales": "158",
        "category": "鱼轮",
        "description": "4-6kg泄力，6+1轴承，夜钓顺滑，抗运河波浪干扰。"
    },
    {
        "id": "pe-line-001",
        "title": "0.8号PE线",
        "price": "38.00",
        "originalPrice": "45.00",
        "imageUrl": "${window.demoProductImages[2]}",
        "detailUrl": "#",
        "sales": "521",
        "category": "线组",
        "description": "8编高强度，耐磨抗桩基刮擦，适合运河野钓，100米。"
    },
    {
        "id": "hooks-001",
        "title": "伊势尼鱼钩套装",
        "price": "15.80",
        "originalPrice": "20.00",
        "imageUrl": "${window.demoProductImages[3]}",
        "detailUrl": "#",
        "sales": "1024",
        "category": "配件",
        "description": "4-9号（黄辣丁/鲶鱼），锋利耐用，野钓利器。"
    },
    {
        "id": "float-001",
        "title": "夜光筏钓漂",
        "price": "25.80",
        "originalPrice": "35.00",
        "imageUrl": "${window.demoProductImages[4]}",
        "detailUrl": "#",
        "sales": "687",
        "category": "配件",
        "description": "吃铅1-3克，高亮漂尾，抗运河波浪，夜钓黄辣丁、鳗鱼必备。"
    },
    {
        "id": "bait-001",
        "title": "野钓活饵及窝料",
        "price": "36.90",
        "originalPrice": "45.00",
        "imageUrl": "${window.demoProductImages[5]}",
        "detailUrl": "#",
        "sales": "452",
        "category": "饵料",
        "description": "蚯蚓、鸡肝、酒米，引黄辣丁、鲶鱼、鳗鱼，运河鱼群聚集。"
    },
    {
        "id": "rod-001",
        "title": "4.5米碳素鱼竿",
        "price": "229.00",
        "originalPrice": "289.00",
        "imageUrl": "${window.demoProductImages[6]}",
        "detailUrl": "#",
        "sales": "76",
        "category": "鱼竿",
        "description": "超轻碳素材质，28调性能，远投近钓两相宜，手感舒适，抗疲劳。"
    },
    {
        "id": "tackle-box-001",
        "title": "多功能渔具盒",
        "price": "59.90",
        "originalPrice": "79.00",
        "imageUrl": "${window.demoProductImages[7]}",
        "detailUrl": "#",
        "sales": "215",
        "category": "配件",
        "description": "防水设计，多层隔断，收纳鱼钩、铅坠、浮漂等小配件，野钓必备。"
    }
]`;

/**
 * 程老板渔具网站 - 演示数据
 * 当无法从抖音获取商品时使用的备用数据
 */

const DEMO_PRODUCTS = [
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
        id: 'custom-rod-001',
        title: '程老板碳素钓鱼竿',
        description: '超轻碳素钓鱼竿，强韧耐用，适合各种野钓环境',
        price: '158',
        originalPrice: '198',
        category: '钓鱼竿',
        sales: '86',
        imageUrl: 'https://via.placeholder.com/400x300/4a7043/ffffff?text=碳素钓鱼竿',
        minimumOrder: 1
    },
    {
        id: 'fishing-reel-001',
        title: '纺车轮鱼线轮',
        description: '高品质纺车轮，金属材质，耐磨抗腐蚀',
        price: '120',
        originalPrice: '150', 
        category: '渔轮',
        sales: '75',
        imageUrl: 'https://via.placeholder.com/400x300/4a7043/ffffff?text=纺车轮鱼线轮',
        minimumOrder: 1
    },
    {
        id: 'fishing-line-001',
        title: '高强度尼龙渔线',
        description: '进口尼龙材质，拉力强，不易断',
        price: '35',
        originalPrice: '45',
        category: '渔线',
        sales: '132',
        imageUrl: 'https://via.placeholder.com/400x300/4a7043/ffffff?text=高强度尼龙渔线',
        minimumOrder: 1
    },
    {
        id: 'fishing-lure-001',
        title: '仿生软饵套装',
        description: '多款仿生软饵，逼真外观，强力诱鱼',
        price: '45',
        originalPrice: '60',
        category: '饵料',
        sales: '98',
        imageUrl: 'https://via.placeholder.com/400x300/4a7043/ffffff?text=仿生软饵套装',
        minimumOrder: 1
    },
    {
        id: 'fishing-suit-001',
        title: '便携钓鱼套装',
        description: '一套搞定所有渔具需求，适合新手和资深钓友',
        price: '285',
        originalPrice: '358',
        category: '套装',
        sales: '64',
        imageUrl: 'https://via.placeholder.com/400x300/4a7043/ffffff?text=便携钓鱼套装',
        minimumOrder: 1
    },
    {
        id: 'fishing-hook-set-001',
        title: '专业鱼钩套装',
        description: '各种型号鱼钩组合，满足不同钓鱼需求',
        price: '25',
        originalPrice: '38',
        category: '钓鱼配件',
        sales: '145',
        imageUrl: 'https://via.placeholder.com/400x300/4a7043/ffffff?text=专业鱼钩套装',
        minimumOrder: 1
    },
    {
        id: 'fishing-chair-001',
        title: '便携折叠钓鱼椅',
        description: '轻巧便携，坚固耐用，户外钓鱼必备',
        price: '88',
        originalPrice: '128',
        category: '钓鱼装备',
        sales: '56',
        imageUrl: 'https://via.placeholder.com/400x300/4a7043/ffffff?text=便携折叠钓鱼椅',
        minimumOrder: 1
    }
];

// 导出演示数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DEMO_PRODUCTS };
} 