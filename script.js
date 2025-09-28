/**
 * Selection Sort Visualizer
 * Trực quan hóa thuật toán sắp xếp chọn
 * Author: Lê Quang Anh
 * Website: https://lequanganh.id.vn
 */

class SelectionSortVisualizer {
    constructor() {
        this.array = [];
        this.steps = [];
        this.currentStep = 0;
        this.isRunning = false;
        this.animationSpeed = 1500; // milliseconds - tăng thời gian để đọc log
        this.logCounter = 0;
        
        this.initializeElements();
        this.generateRandomArray();
        this.setupEventListeners();
    }

    /**
     * Khởi tạo các DOM elements
     */
    initializeElements() {
        this.arrayContainer = document.getElementById('arrayContainer');
        this.runBtn = document.getElementById('runBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.statusEl = document.getElementById('status');
        this.codeLines = document.querySelectorAll('.code-line');
        this.logContainer = document.getElementById('logContainer');
        this.clearLogBtn = document.getElementById('clearLogBtn');
    }

    /**
     * Thiết lập event listeners cho các buttons
     */
    setupEventListeners() {
        this.runBtn.addEventListener('click', () => this.startVisualization());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.clearLogBtn.addEventListener('click', () => this.clearLog());
    }

    /**
     * Tạo mảng ngẫu nhiên với size phần tử
     * @param {number} size - Số lượng phần tử trong mảng
     */
    generateRandomArray(size = 8) {
        this.array = [];
        // Tạo các số ngẫu nhiên từ 10-99
        for (let i = 0; i < size; i++) {
            this.array.push(Math.floor(Math.random() * 90) + 10);
        }
        this.renderArray();
        this.updateStatus('Đã tạo mảng mới. Sẵn sàng để sắp xếp!');
    }

    /**
     * Render mảng thành các bar trên giao diện
     */
    renderArray() {
        this.arrayContainer.innerHTML = '';
        const maxValue = Math.max(...this.array);
        
        this.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            // Tính chiều cao bar dựa trên giá trị (tối đa 250px)
            bar.style.height = `${(value / maxValue) * 250}px`;
            bar.setAttribute('data-index', index);
            
            // Tạo label hiển thị giá trị
            const valueLabel = document.createElement('div');
            valueLabel.className = 'array-value';
            valueLabel.textContent = value;
            bar.appendChild(valueLabel);
            
            this.arrayContainer.appendChild(bar);
        });
    }

    /**
     * Tạo các bước chi tiết của thuật toán Selection Sort (theo cụm)
     */
    generateSteps() {
        this.steps = [];
        const arr = [...this.array]; // Tạo bản sao để không thay đổi mảng gốc
        const n = arr.length;

        // Bước khởi tạo
        this.steps.push({
            type: 'start',
            codeLine: 0,
            array: [...arr],
            description: 'Bắt đầu thuật toán Selection Sort',
            logGroup: {
                icon: '🚀',
                title: 'Khởi tạo',
                content: [
                    `Mảng ban đầu: [${arr.join(', ')}]`,
                    `Bắt đầu sắp xếp ${n} phần tử`
                ]
            }
        });

        // Vòng lặp ngoài - duyệt qua từng vị trí
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            const roundSteps = [];
            
            // Tạo log cho vòng lặp hiện tại
            const beforeArray = [...arr];
            const arrayDisplay = arr.map((val, idx) => 
                idx === i ? `(${val})` : val.toString()
            ).join(', ');
            
            // Bước bắt đầu vòng lặp
            this.steps.push({
                type: 'round_start',
                codeLine: 2,
                array: [...arr],
                currentPos: i,
                description: `Vòng ${i + 1}/${n - 1}`,
                logGroup: {
                    icon: '🔄',
                    title: `Vòng ${i + 1}/${n - 1}`,
                    content: [
                        `Mảng trước: [${arrayDisplay}]`,
                        `i = ${i}, arr[i] = ${arr[i]}`
                    ]
                }
            });

            // Khởi tạo minIndex
            this.steps.push({
                type: 'init_min',
                codeLine: 4,
                array: [...arr],
                currentPos: i,
                minIndex: minIndex,
                description: `Giả sử phần tử tại vị trí ${i} là nhỏ nhất`
            });

            // Tìm phần tử nhỏ nhất trong phần chưa sắp xếp
            for (let j = i + 1; j < n; j++) {
                this.steps.push({
                    type: 'compare',
                    codeLine: 6,
                    array: [...arr],
                    currentPos: i,
                    comparePos: j,
                    minIndex: minIndex,
                    description: `So sánh arr[${j}] = ${arr[j]} với arr[${minIndex}] = ${arr[minIndex]}`
                });

                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                    this.steps.push({
                        type: 'update_min',
                        codeLine: 9,
                        array: [...arr],
                        currentPos: i,
                        comparePos: j,
                        minIndex: minIndex,
                        description: `Tìm thấy phần tử nhỏ hơn! Cập nhật minIndex = ${j}`
                    });
                }
            }

            // Kiểm tra và thực hiện hoán đổi
            let swapInfo = '';
            if (minIndex !== i) {
                swapInfo = `Swap: arr[${i}] ↔ arr[${minIndex}]  (${arr[i]} ↔ ${arr[minIndex]})`;
                
                // Thực hiện hoán đổi
                let temp = arr[i];
                arr[i] = arr[minIndex];
                arr[minIndex] = temp;
            } else {
                swapInfo = `Không cần swap: arr[${i}] = ${arr[i]} đã là nhỏ nhất`;
            }

            const afterArray = [...arr];
            const afterArrayDisplay = afterArray.join(', ');

            // Bước kết thúc vòng lặp với thông tin tổng hợp
            this.steps.push({
                type: 'round_complete',
                codeLine: 18,
                array: [...arr],
                currentPos: i,
                sortedIndex: i,
                description: `Hoàn thành vòng ${i + 1}`,
                logGroup: {
                    icon: '✅',
                    title: '',
                    content: [
                        `Tìm min từ i=${i} → minIndex = ${minIndex}, arr[minIndex] = ${arr[i]}`,
                        swapInfo,
                        `Mảng sau : [${afterArrayDisplay}]`,
                        '─'.repeat(50)
                    ]
                }
            });
        }

        // Kết thúc thuật toán
        this.steps.push({
            type: 'complete',
            codeLine: 19,
            array: [...arr],
            description: 'Hoàn thành sắp xếp!',
            logGroup: {
                icon: '🎉',
                title: 'Kết thúc',
                content: [
                    'Thuật toán Selection Sort hoàn thành!',
                    `Mảng đã sắp xếp: [${arr.join(', ')}]`,
                    `Độ phức tạp: O(n²) với ${this.array.length} phần tử`
                ]
            }
        });
    }

    /**
     * Bắt đầu quá trình visualization
     */
    async startVisualization() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.runBtn.disabled = true;
        this.resetBtn.disabled = true;
        
        // Reset log counter và xóa log cũ (trừ welcome message)
        this.logCounter = 0;
        this.clearLog(false);
        
        // Tạo các bước cho thuật toán
        this.generateSteps();
        this.currentStep = 0;
        
        // Thực thi từng bước
        for (let step of this.steps) {
            await this.executeStep(step);
            await this.sleep(this.animationSpeed);
        }
        
        // Kết thúc visualization
        this.isRunning = false;
        this.runBtn.disabled = false;
        this.resetBtn.disabled = false;
        this.updateStatus('Hoàn thành! Mảng đã được sắp xếp thành công.');
    }

    /**
     * Thực thi một bước của thuật toán
     * @param {Object} step - Đối tượng chứa thông tin về bước hiện tại
     */
    async executeStep(step) {
        // Highlight dòng code tương ứng
        this.highlightCodeLine(step.codeLine);
        
        // Cập nhật trạng thái mô tả
        this.updateStatus(step.description);
        
        // Thêm log entry nếu có logGroup
        if (step.logGroup) {
            this.addLogGroup(step.logGroup);
        }
        
        // Cập nhật visualization dựa trên loại bước
        this.updateVisualization(step);
    }

    /**
     * Highlight dòng code đang thực thi
     * @param {number} lineNumber - Số dòng code cần highlight
     */
    highlightCodeLine(lineNumber) {
        // Bỏ highlight tất cả các dòng
        this.codeLines.forEach(line => line.classList.remove('highlight'));
        
        // Highlight dòng hiện tại
        if (lineNumber >= 0) {
            const targetLine = document.querySelector(`[data-line="${lineNumber}"]`);
            if (targetLine) {
                targetLine.classList.add('highlight');
            }
        }
    }

    /**
     * Cập nhật visualization dựa trên bước hiện tại
     * @param {Object} step - Đối tượng chứa thông tin về bước hiện tại
     */
    updateVisualization(step) {
        const bars = this.arrayContainer.querySelectorAll('.array-bar');
        
        // Reset tất cả trạng thái về mặc định
        bars.forEach((bar, index) => {
            bar.className = 'array-bar';
            
            // Đánh dấu các phần tử đã được sắp xếp (từ các bước trước)
            if (step.type !== 'start' && step.currentPos !== undefined && index < step.currentPos) {
                bar.classList.add('sorted');
            }
        });

        // Áp dụng trạng thái dựa trên loại bước
        switch (step.type) {
            case 'compare':
                // Highlight phần tử đang so sánh
                if (step.comparePos !== undefined) {
                    bars[step.comparePos].classList.add('comparing');
                }
                // Highlight phần tử nhỏ nhất hiện tại
                if (step.minIndex !== undefined) {
                    bars[step.minIndex].classList.add('minimum');
                }
                break;
                
            case 'update_min':
            case 'init_min':
                // Highlight phần tử nhỏ nhất
                if (step.minIndex !== undefined) {
                    bars[step.minIndex].classList.add('minimum');
                }
                break;
                
            case 'round_complete':
                // Đánh dấu phần tử đã sắp xếp
                if (step.sortedIndex !== undefined) {
                    bars[step.sortedIndex].classList.add('sorted');
                }
                break;
                
            case 'complete':
                // Đánh dấu tất cả phần tử đã sắp xếp
                bars.forEach(bar => {
                    bar.classList.add('sorted');
                });
                break;
        }

        // Cập nhật giá trị và chiều cao bar nếu mảng đã thay đổi
        if (step.array) {
            const maxValue = Math.max(...step.array);
            bars.forEach((bar, index) => {
                const valueLabel = bar.querySelector('.array-value');
                if (valueLabel && step.array[index] !== undefined) {
                    valueLabel.textContent = step.array[index];
                    // Cập nhật chiều cao bar theo giá trị mới
                    bar.style.height = `${(step.array[index] / maxValue) * 250}px`;
                }
            });
        }
    }

    /**
     * Cập nhật thông báo trạng thái
     * @param {string} message - Thông báo cần hiển thị
     */
    updateStatus(message) {
        this.statusEl.textContent = message;
    }

    /**
     * Reset visualization về trạng thái ban đầu
     */
    reset() {
        if (this.isRunning) return;
        
        // Reset các biến trạng thái
        this.currentStep = 0;
        this.steps = [];
        this.logCounter = 0;
        
        // Bỏ highlight tất cả dòng code
        this.codeLines.forEach(line => line.classList.remove('highlight'));
        
        // Tạo mảng mới
        this.generateRandomArray();
        
        // Reset log về welcome message
        this.clearLog();
        
        // Reset trạng thái buttons
        this.runBtn.disabled = false;
        this.resetBtn.disabled = false;
    }

    /**
     * Tạo delay cho animation
     * @param {number} ms - Thời gian delay tính bằng milliseconds
     * @returns {Promise} Promise resolve sau thời gian delay
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Thêm log group mới vào log container
     * @param {Object} logGroup - Object chứa thông tin log group
     */
    addLogGroup(logGroup) {
        // Bỏ highlight log trước
        const currentLogs = this.logContainer.querySelectorAll('.log-item.current');
        currentLogs.forEach(log => log.classList.remove('current'));
        
        // Tạo log group mới
        const logGroupElement = document.createElement('div');
        logGroupElement.className = 'log-group current';
        
        // Tạo header cho group (nếu có title)
        if (logGroup.title) {
            const groupHeader = document.createElement('div');
            groupHeader.className = 'log-group-header';
            
            const headerIcon = document.createElement('span');
            headerIcon.className = 'log-number';
            headerIcon.textContent = logGroup.icon;
            
            const headerTitle = document.createElement('span');
            headerTitle.className = 'log-group-title';
            headerTitle.textContent = logGroup.title;
            
            groupHeader.appendChild(headerIcon);
            groupHeader.appendChild(headerTitle);
            logGroupElement.appendChild(groupHeader);
        }
        
        // Thêm nội dung
        const groupContent = document.createElement('div');
        groupContent.className = 'log-group-content';
        
        logGroup.content.forEach(line => {
            const contentLine = document.createElement('div');
            contentLine.className = 'log-content-line';
            contentLine.textContent = line;
            groupContent.appendChild(contentLine);
        });
        
        logGroupElement.appendChild(groupContent);
        
        // Thêm vào container
        this.logContainer.appendChild(logGroupElement);
        
        // Auto scroll xuống log mới nhất
        logGroupElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        this.logCounter++;
    }

    /**
     * Xóa tất cả log entries
     * @param {boolean} keepWelcome - Có giữ lại welcome message không
     */
    clearLog(keepWelcome = true) {
        if (keepWelcome) {
            // Xóa tất cả trừ welcome message
            const logs = this.logContainer.querySelectorAll('.log-item:not(.welcome), .log-group');
            logs.forEach(log => log.remove());
        } else {
            // Xóa tất cả
            this.logContainer.innerHTML = '';
        }
        this.logCounter = 0;
    }
}

/**
 * Khởi tạo ứng dụng khi DOM đã load xong
 */
document.addEventListener('DOMContentLoaded', () => {
    // Tạo instance của SelectionSortVisualizer
    const visualizer = new SelectionSortVisualizer();
    
    // Log thông tin về ứng dụng
    console.log('📢 Selection Sort Visualizer đã được khởi tạo!');
    console.log('🔧 Liên hệ: lequanganh253@gmail.com');
    console.log('🌐 Website: https://lequanganh.id.vn');
    console.log('💻 GitHub: https://github.com/QuangAnh253');
});