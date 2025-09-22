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
        this.animationSpeed = 800; // milliseconds
        this.logCounter = 0; // Đếm số bước để hiển thị số thứ tự
        
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
     * Tạo các bước chi tiết của thuật toán Selection Sort
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
            description: 'Bắt đầu thuật toán Selection Sort'
        });

        // Vòng lặp ngoài - duyệt qua từng vị trí
        for (let i = 0; i < n - 1; i++) {
            // Bắt đầu vòng lặp ngoài
            this.steps.push({
                type: 'outer_loop_start',
                codeLine: 2,
                array: [...arr],
                currentPos: i,
                description: `Bắt đầu vòng lặp ngoài với i = ${i}`
            });

            // Khởi tạo minIndex - giả sử phần tử đầu tiên là nhỏ nhất
            let minIndex = i;
            this.steps.push({
                type: 'init_min',
                codeLine: 4,
                array: [...arr],
                currentPos: i,
                minIndex: minIndex,
                description: `Khởi tạo minIndex = ${i}, giả sử phần tử tại vị trí ${i} (giá trị ${arr[i]}) là nhỏ nhất`
            });

            // Vòng lặp trong - tìm phần tử nhỏ nhất trong phần chưa sắp xếp
            for (let j = i + 1; j < n; j++) {
                // Bắt đầu so sánh
                this.steps.push({
                    type: 'compare_start',
                    codeLine: 6,
                    array: [...arr],
                    currentPos: i,
                    comparePos: j,
                    minIndex: minIndex,
                    description: `So sánh arr[${j}] = ${arr[j]} với arr[${minIndex}] = ${arr[minIndex]}`
                });

                // Thực hiện so sánh
                this.steps.push({
                    type: 'compare',
                    codeLine: 8,
                    array: [...arr],
                    currentPos: i,
                    comparePos: j,
                    minIndex: minIndex,
                    description: `${arr[j]} ${arr[j] < arr[minIndex] ? '<' : '>='} ${arr[minIndex]}`
                });

                // Cập nhật minIndex nếu tìm thấy phần tử nhỏ hơn
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                    this.steps.push({
                        type: 'update_min',
                        codeLine: 9,
                        array: [...arr],
                        currentPos: i,
                        comparePos: j,
                        minIndex: minIndex,
                        description: `Tìm thấy phần tử nhỏ hơn! Cập nhật minIndex = ${j} (giá trị ${arr[j]})`
                    });
                }
            }

            // Kiểm tra và thực hiện hoán đổi
            if (minIndex !== i) {
                this.steps.push({
                    type: 'swap_check',
                    codeLine: 13,
                    array: [...arr],
                    currentPos: i,
                    minIndex: minIndex,
                    description: `Cần hoán đổi: arr[${i}] = ${arr[i]} với arr[${minIndex}] = ${arr[minIndex]}`
                });

                // Thực hiện hoán đổi
                let temp = arr[i];
                arr[i] = arr[minIndex];
                arr[minIndex] = temp;

                this.steps.push({
                    type: 'swap',
                    codeLine: 15,
                    array: [...arr],
                    currentPos: i,
                    minIndex: minIndex,
                    description: `Đã hoán đổi: Vị trí ${i} có giá trị ${arr[i]}, vị trí ${minIndex} có giá trị ${arr[minIndex]}`
                });
            } else {
                this.steps.push({
                    type: 'no_swap',
                    codeLine: 13,
                    array: [...arr],
                    currentPos: i,
                    minIndex: minIndex,
                    description: `Không cần hoán đổi: Phần tử tại vị trí ${i} đã là nhỏ nhất`
                });
            }

            // Đánh dấu phần tử đã được sắp xếp
            this.steps.push({
                type: 'sorted',
                codeLine: 18,
                array: [...arr],
                sortedIndex: i,
                description: `Phần tử tại vị trí ${i} (giá trị ${arr[i]}) đã được sắp xếp đúng vị trí`
            });
        }

        // Kết thúc thuật toán
        this.steps.push({
            type: 'complete',
            codeLine: 19,
            array: [...arr],
            description: 'Hoàn thành sắp xếp! Mảng đã được sắp xếp theo thứ tự tăng dần.'
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
        
        // Thêm log bắt đầu
        this.addLogEntry('🚀', 'Bắt đầu thuật toán Selection Sort', 'start');
        
        // Thực thi từng bước
        for (let step of this.steps) {
            await this.executeStep(step);
            await this.sleep(this.animationSpeed);
        }
        
        // Thêm log hoàn thành
        this.addLogEntry('✅', 'Hoàn thành sắp xếp! Mảng đã được sắp xếp theo thứ tự tăng dần.', 'complete');
        
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
        
        // Thêm log entry cho bước hiện tại
        this.addLogEntry(this.getStepIcon(step.type), step.description, step.type);
        
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
            case 'compare_start':
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
                
            case 'swap_check':
            case 'swap':
                // Highlight cả hai phần tử sẽ hoán đổi
                if (step.currentPos !== undefined) {
                    bars[step.currentPos].classList.add('comparing');
                }
                if (step.minIndex !== undefined) {
                    bars[step.minIndex].classList.add('comparing');
                }
                break;
                
            case 'sorted':
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
     * Thêm log entry mới vào log container
     * @param {string} icon - Icon cho log entry
     * @param {string} text - Nội dung log
     * @param {string} type - Loại log để styling
     */
    addLogEntry(icon, text, type = '') {
        // Bỏ highlight log trước
        const currentLogs = this.logContainer.querySelectorAll('.log-item.current');
        currentLogs.forEach(log => log.classList.remove('current'));
        
        // Tạo log entry mới
        const logItem = document.createElement('div');
        logItem.className = `log-item current ${type}`;
        
        const logNumber = document.createElement('span');
        logNumber.className = 'log-number';
        logNumber.textContent = icon;
        
        const logText = document.createElement('span');
        logText.className = 'log-text';
        logText.textContent = text;
        
        logItem.appendChild(logNumber);
        logItem.appendChild(logText);
        
        // Thêm vào container
        this.logContainer.appendChild(logItem);
        
        // Auto scroll xuống log mới nhất
        logItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        this.logCounter++;
    }

    /**
     * Xóa tất cả log entries
     * @param {boolean} keepWelcome - Có giữ lại welcome message không
     */
    clearLog(keepWelcome = true) {
        if (keepWelcome) {
            // Xóa tất cả trừ welcome message
            const logs = this.logContainer.querySelectorAll('.log-item:not(.welcome)');
            logs.forEach(log => log.remove());
        } else {
            // Xóa tất cả
            this.logContainer.innerHTML = '';
        }
        this.logCounter = 0;
    }

    /**
     * Lấy icon tương ứng với loại bước
     * @param {string} stepType - Loại bước
     * @returns {string} Icon tương ứng
     */
    getStepIcon(stepType) {
        const iconMap = {
            'start': '🏁',
            'outer_loop_start': '🔄',
            'init_min': '🎯',
            'compare_start': '👀',
            'compare': '⚖️',
            'update_min': '⬇️',
            'swap_check': '🔍',
            'swap': '🔄',
            'no_swap': '⏭️',
            'sorted': '✔️',
            'complete': '🎉'
        };
        return iconMap[stepType] || '📝';
    }
}

/**
 * Khởi tạo ứng dụng khi DOM đã load xong
 */
document.addEventListener('DOMContentLoaded', () => {
    // Tạo instance của SelectionSortVisualizer
    const visualizer = new SelectionSortVisualizer();
    
    // Log thông tin về ứng dụng
    console.log('🔢 Selection Sort Visualizer đã được khởi tạo!');
    console.log('📧 Liên hệ: lequanganh253@gmail.com');
    console.log('🌐 Website: https://lequanganh.id.vn');
    console.log('💻 GitHub: https://github.com/QuangAnh253');
});