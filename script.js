window.onload = function() {
    // LeanCloud 初始化
    AV.init({
        appId: "HhUkdfWiUXOanxY9YTnWiVJE-gzGzoHsz",
        appKey: "ZnSATpLwSlSZVbgKUrLyE6xK",
        serverURL: "https://hhukdfwi.lc-cn-n1-shared.com"
    });

    // ===================== 新增：轮播图逻辑 =====================
    const carouselImgs = document.querySelectorAll('.carousel-img');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0; // 当前轮播图索引
    const carouselInterval = 3000; // 自动轮播间隔（3秒）
    let timer = null; // 自动轮播定时器

    // 切换轮播图函数
    function switchCarousel(index) {
        // 移除所有激活状态
        carouselImgs.forEach(img => img.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));
        // 设置新的激活状态
        currentIndex = index;
        carouselImgs[currentIndex].classList.add('active');
        indicators[currentIndex].classList.add('active');
    }

    // 下一张轮播图
    function nextCarousel() {
        let nextIndex = (currentIndex + 1) % carouselImgs.length;
        switchCarousel(nextIndex);
    }

    // 上一张轮播图
    function prevCarousel() {
        let prevIndex = (currentIndex - 1 + carouselImgs.length) % carouselImgs.length;
        switchCarousel(prevIndex);
    }

    // 手动点击指示器切换
    indicators.forEach((ind, index) => {
        ind.addEventListener('click', () => {
            switchCarousel(index);
            // 重置自动轮播定时器
            clearInterval(timer);
            startAutoCarousel();
        });
    });

    // 左右按钮切换
    prevBtn.addEventListener('click', () => {
        prevCarousel();
        clearInterval(timer);
        startAutoCarousel();
    });

    nextBtn.addEventListener('click', () => {
        nextCarousel();
        clearInterval(timer);
        startAutoCarousel();
    });

    // 启动自动轮播
    function startAutoCarousel() {
        timer = setInterval(() => {
            nextCarousel();
        }, carouselInterval);
    }

    // 页面加载时启动自动轮播
    startAutoCarousel();

    // 鼠标移入轮播图暂停自动播放，移出继续
    const carousel = document.querySelector('.carousel');
    carousel.addEventListener('mouseenter', () => {
        clearInterval(timer);
    });
    carousel.addEventListener('mouseleave', () => {
        startAutoCarousel();
    });

    // ===================== 原有：表单提交逻辑 =====================
    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('recruitmentForm');

    submitBtn.addEventListener('click', function() {
        submitBtn.disabled = true;
        submitBtn.textContent = '提交中...';
        clearErrors();
        const isFormValid = validateForm();

        if (isFormValid) {
            const name = document.getElementById('name').value.trim();
            const grade = document.getElementById('grade').value;
            const phone = document.getElementById('phone').value.trim();
            const experience = document.getElementById('experience').value.trim();

            // 创建LeanCloud数据对象并存储
            const Recruitment = AV.Object.extend('Recruitment');
            const recruitment = new Recruitment();
            recruitment.set('name', name);
            recruitment.set('grade', { title: grade });
            recruitment.set('phone',  { number: phone });
            recruitment.set('experience', experience);
    
            // 提交到LeanCloud
            recruitment.save().then(() => {
                alert('报名成功！我们会尽快联系你～');
                form.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = '提交报名';
            }, (error) => {
                alert('提交失败，请重试：' + error.message);
                submitBtn.disabled = false;
                submitBtn.textContent = '提交报名';
            });
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = '提交报名';
        }
    });

    // 表单验证函数
    function validateForm() {
        let isValid = true;
        const name = document.getElementById('name').value.trim();
        if (name === '') {
            showError('nameError', '姓名不能为空');
            isValid = false;
        }

        const grade = document.getElementById('grade').value;
        if (grade === '') {
            showError('gradeError', '请选择你的年级');
            isValid = false;
        }

        const phone = document.getElementById('phone').value.trim();
        const phoneReg = /^1[3-9]\d{9}$/;
        if (phone === '') {
            showError('phoneError', '手机号不能为空');
            isValid = false;
        } else if (!phoneReg.test(phone)) {
            showError('phoneError', '请输入正确的11位手机号');
            isValid = false;
        }

        return isValid;
    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
    }

    function clearErrors() {
        const errorElements = document.getElementsByClassName('error');
        for (let i = 0; i < errorElements.length; i++) {
            errorElements[i].textContent = '';
        }
    }
};