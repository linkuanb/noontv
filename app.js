
class MoonTVApp {
    constructor() {
        this.videos = JSON.parse(localStorage.getItem('moontv_videos')) || [];
        this.favorites = JSON.parse(localStorage.getItem('moontv_favorites')) || [];
        this.history = JSON.parse(localStorage.getItem('moontv_history')) || [];
        this.currentVideo = null;
        this.currentCategory = '全部';
        this.init();
    }

    init() {
        this.loadSampleData();
        this.setupEventListeners();
        this.renderVideoList();
        this.showWelcomeMessage();
    }

    loadSampleData() {
        if (this.videos.length === 0) {
            this.videos = [
                {
                    id: 1,
                    title: "星际穿越",
                    type: "movie",
                    cover: "https://picsum.photos/300/450?random=1",
                    description: "一部关于太空探索和人类生存的科幻电影，讲述了地球面临生存危机时，一群探险家穿越虫洞寻找新家园的故事。",
                    rating: 9.2,
                    year: 2014,
                    duration: "169分钟",
                    sources: ["source1", "source2"],
                    tags: ["科幻", "冒险", "太空"],
                    views: 1250000
                },
                {
                    id: 2,
                    title: "权力的游戏",
                    type: "tv",
                    cover: "https://picsum.photos/300/450?random=2",
                    description: "中世纪史诗奇幻电视剧，改编自乔治·R·R·马丁的奇幻小说《冰与火之歌》系列。",
                    rating: 9.3,
                    year: 2011,
                    duration: "8季",
                    sources: ["source1", "source3"],
                    tags: ["奇幻", "史诗", "战争"],
                    views: 980000
                },
                {
                    id: 3,
                    title: "盗梦空间",
                    type: "movie",
                    cover: "https://picsum.photos/300/450?random=3",
                    description: "讲述由莱昂纳多·迪卡普里奥扮演的造梦师，带领特工团队进入他人梦境，从他人的潜意识中盗取机密，并重塑他人梦境的故事。",
                    rating: 9.0,
                    year: 2010,
                    duration: "148分钟",
                    sources: ["source2", "source4"],
                    tags: ["科幻", "悬疑", "动作"],
                    views: 1100000
                },
                {
                    id: 4,
                    title: "黑镜",
                    type: "tv",
                    cover: "https://picsum.photos/300/450?random=4",
                    description: "英国电视剧，以近未来背景，展现科技对人类生活产生的负面影响。",
                    rating: 8.8,
                    year: 2011,
                    duration: "5季",
                    sources: ["source3", "source5"],
                    tags: ["科幻", "惊悚", "剧情"],
                    views: 750000
                },
                {
                    id: 5,
                    title: "复仇者联盟4：终局之战",
                    type: "movie",
                    cover: "https://picsum.photos/300/450?random=5",
                    description: "漫威电影宇宙的集大成之作，讲述了复仇者联盟穿越时空收集无限宝石，逆转灭霸响指的故事。",
                    rating: 8.7,
                    year: 2019,
                    duration: "181分钟",
                    sources: ["source1", "source6"],
                    tags: ["科幻", "动作", "冒险"],
                    views: 1450000
                }
            ];
            this.saveToLocalStorage('moontv_videos', this.videos);
        }
    }

    setupEventListeners() {
        const searchInput = document.querySelector('input[type="text"]');
        searchInput.addEventListener('input', (e) => {
            this.searchVideos(e.target.value);
        });

        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                categoryButtons.forEach(btn => {
                    btn.classList.remove('bg-purple-600', 'text-white');
                    btn.classList.add('bg-gray-200', 'text-gray-700');
                });
                e.target.classList.remove('bg-gray-200', 'text-gray-700');
                e.target.classList.add('bg-purple-600', 'text-white');
                this.filterByCategory(e.target.textContent.trim());
            });
        });

        document.getElementById('searchBtn').addEventListener('click', () => {
            this.toggleSearchFocus();
        });

        document.getElementById('userBtn').addEventListener('click', () => {
            });

        document.getElementById('settingsBtn').addEventListener('click', () => {
                this.showSettings();
            });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closePlayer();
                this.closeAllModals();
            }
        });
    }

    searchVideos(query) {
        if (query.trim() === '') {
            this.renderVideoList();
            return;
        }

        const filteredVideos = this.videos.filter(video => 
            video.title.toLowerCase().includes(query.toLowerCase()) ||
            video.description.toLowerCase().includes(query.toLowerCase()) ||
            video.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        
        this.renderVideoList(filteredVideos);
    }

    filterByCategory(category) {
        this.currentCategory = category;
        if (category === '全部') {
            this.renderVideoList();
            return;
        }

        const categoryMap = {
            '电影': 'movie',
            '电视剧': 'tv',
            '综艺': 'variety',
            '动漫': 'anime'
        };

        const filteredVideos = this.videos.filter(video => 
            video.type === categoryMap[category]
        );
        
        this.renderVideoList(filteredVideos);
    }

    renderVideoList(videos = this.videos) {
        const hotSection = document.getElementById('hotVideos');
        const recentSection = document.getElementById('recentVideos');

        hotSection.innerHTML = videos.slice(0, 10).map(video => `
            <div class="card-hover bg-white rounded-xl shadow-md overflow-hidden cursor-pointer" onclick="app.playVideo(${video.id})">
                <div class="relative">
                    <img src="${video.cover}" alt="${video.title}电影海报" class="w-full h-48 object-cover">
                    <div class="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-sm font-semibold">
                    </div>
                    <div class="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        ${video.year}
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-semibold text-gray-800 mb-1 truncate">${video.title}</h3>
                    <div class="flex justify-between items-center text-sm text-gray-600">
                        <span>${video.duration}</span>
                        <button onclick="event.stopPropagation(); app.toggleFavorite(${video.id})" class="text-gray-400 hover:text-red-500 transition-colors">
                            <i class="fas fa-heart ${this.favorites.includes(video.id) ? 'text-red-500' : ''}"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        recentSection.innerHTML = videos.slice(0, 6).map(video => `
            <div class="card-hover bg-white rounded-xl shadow-md overflow-hidden">
                <div class="flex">
                    <img src="${video.cover}" alt="${video.title}剧照图片" class="w-24 h-32 object-cover">
                    <div class="p-4 flex-1">
                    <p class="text-sm text-gray-600 mb-2 line-clamp-2">${video.description}</p>
                        <div class="flex flex-wrap gap-1 mb-2">
                        ${video.tags.map(tag => `
                            <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">${tag}</span>
                        `).join('')}
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-yellow-500 font-semibold">${video.rating}</span>
                            <button onclick="app.playVideo(${video.id})" class="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors">
                                播放
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    playVideo(videoId) {
        this.currentVideo = this.videos.find(v => v.id === videoId);
        if (this.currentVideo) {
            document.getElementById('playerModal').classList.remove('hidden');
            document.getElementById('videoTitle').textContent = this.currentVideo.title;
            
            if (!this.history.includes(videoId)) {
                this.history.push(videoId);
                this.saveToLocalStorage('moontv_history', this.history);
            
            console.log('开始播放视频:', this.currentVideo.title);
        }
    }

    toggleFavorite(videoId) {
        const index = this.favorites.indexOf(videoId);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showMessage('已取消收藏');
        } else {
            this.favorites.push(videoId);
            this.showMessage('已添加到收藏');
        }
        this.saveToLocalStorage('moontv_favorites', this.favorites);
        this.renderVideoList();
    }

    toggleSearchFocus() {
        const searchInput = document.querySelector('input[type="text"]');
        searchInput.focus();
    }

    showSettings() {
        this.showMessage('设置功能开发中...');
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.showMessage('欢迎使用 MoonTV 影视播放器！');
        }, 1000);
    }

    showMessage(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2000);
    }

    closeAllModals() {
        document.getElementById('playerModal').classList.add('hidden');
    }

    saveToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
}

function closePlayer() {
    document.getElementById('playerModal').classList.add('hidden');
}

const app = new MoonTVApp();
