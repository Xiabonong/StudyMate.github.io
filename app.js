const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            currentView: 'qa',
            showDropdown: false,
            dropdownTimer: null,
            searchQuery: '',
            searchResults: [],
            isEditing: false,
            functions: [
                { name: '答疑大模型', view: 'qa' },
                { name: '社区', view: 'community' },
                { name: '学习监测', view: 'monitoring' },
                { name: '个人中心', view: 'profile' },
                { name: '设置', view: 'settings' }
            ],
            userProfile: {
                avatar: localStorage.getItem('avatar') || 'image/avator.png',
                username: localStorage.getItem('username') || '',
                gender: localStorage.getItem('gender') || '',
                email: localStorage.getItem('email') || '',
                phone: localStorage.getItem('phone') || ''
            }
        };
    },
    methods: {
        showDropdownMenu() { // 显示下拉菜单
            clearTimeout(this.dropdownTimer);
            this.showDropdown = true;
        },
        hideDropdownMenu() { // 隐藏下拉菜单
            this.dropdownTimer = setTimeout(() => {
                this.showDropdown = false;
            }, 250);
        },
        searchFunctions() { // 搜索功能
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                this.searchResults = this.functions.filter(func => func.name.toLowerCase().includes(query));
            } else {
                this.searchResults = [];
            }
        },
        navigateTo(view) { // 导航到指定视图
            this.currentView = view;
            this.searchQuery = '';
            this.searchResults = [];
        },
        saveProfile() { // 保存用户信息
            localStorage.setItem('avatar', this.userProfile.avatar);
            localStorage.setItem('username', this.userProfile.username);
            localStorage.setItem('gender', this.userProfile.gender);
            localStorage.setItem('email', this.userProfile.email);
            localStorage.setItem('phone', this.userProfile.phone);
            alert('用户信息已保存');
            this.isEditing = false;
        },
        handleAvatarChange(event) { // 处理头像更改
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                this.userProfile.avatar = e.target.result;
            };
            reader.readAsDataURL(file);
        },
        resetToDefault() {
            localStorage.removeItem('avatar');
            localStorage.removeItem('username');
            localStorage.removeItem('gender');
            localStorage.removeItem('email');
            localStorage.removeItem('phone');
            location.reload();
            console.log('恢复默认设置');
        },
        toggleEdit() {
            this.isEditing = !this.isEditing;
            if (!this.isEditing) {
                this.saveProfile();
            }
        }
    },
    mounted() {
        window.addEventListener('keydown', (event) => {
            if (event.altKey && (event.key === 't' || event.key === 'T')) {
                event.preventDefault();
                this.resetToDefault();
            }
        });
    }
});

app.component('qa', {
    template: '<div><h2>答疑大模型</h2><p>这里是答疑大模型的内容。</p></div>'
});

app.component('community', {
    template: '<div><h2>社区</h2><p>这里是社区的内容。</p></div>'
});

app.component('profile', {
    template: `
        <h2>个人中心</h2>
        <div class="profile">
            <div class="profile-item">
                <div class="profile-item-avatar">
                    <label>头像：</label>
                    <img :src="userProfile.avatar" alt="User Avatar" @click="triggerFileInput">
                    <input type="file" @change="handleAvatarChange" ref="fileInput" :disabled="!isEditing" style="display: none;">
                </div>
                <div class="profile-item-username">
                    <label>用户名：</label>
                    <input type="text" v-model="userProfile.username" :disabled="!isEditing">
                </div>
                <div class="profile-item-gender">
                    <label>性别：</label>
                    <select v-model="userProfile.gender" :disabled="!isEditing">
                        <option value="male">男</option>
                        <option value="female">女</option>
                        <option value="other">不愿透露</option>
                    </select>
                </div>
                <div class="profile-item-email">
                    <label>邮箱：</label>
                    <input type="email" v-model="userProfile.email" :disabled="!isEditing">
                </div>
                <div class="profile-item-phone">
                    <label>电话号码：</label>
                    <input type="tel" v-model="userProfile.phone" :disabled="!isEditing">
                </div>
                <button @click="toggleEdit">{{ isEditing ? '保存' : '修改' }}</button>
            </div>
        </div>
    `,
    data() {
        return {
            userProfile: this.$root.userProfile,
            isEditing: this.$root.isEditing
        };
    },
    methods: {
        saveProfile() { // 保存用户信息
            this.$root.saveProfile();
        },
        handleAvatarChange(event) { // 处理头像更改
            this.$root.handleAvatarChange(event);
        },
        triggerFileInput() { // 触发文件输入
            if (this.isEditing) {
                this.$refs.fileInput.click();
            }
        },
        toggleEdit() {
            this.isEditing = !this.isEditing;
            if (!this.isEditing) {
                this.$root.saveProfile();
            }
        }
    }
});

app.component('settings', {
    template: '<div><h2>设置</h2><p>这里是设置的内容。</p></div>'
});

app.component('monitoring', {
    template: '<div><h2>学习监测</h2><p>这里是学习监测的内容。</p></div>'
});

app.component('bell', {
    template: '<div><h2>通知</h2><p>这里是通知的内容。</p></div>'
});

app.mount('#app');