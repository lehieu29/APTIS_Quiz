// ============================================
// DRAG-DROP.JS - Xử lý Drag & Drop
// ============================================

/**
 * Xử lý khi bắt đầu kéo
 */
function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

/**
 * Xử lý khi kết thúc kéo
 */
function handleDragEnd(e) {
    this.classList.remove('dragging');
    
    // Remove all drag-over classes
    document.querySelectorAll('.sortable-item').forEach(item => {
        item.classList.remove('drag-over');
    });
}

/**
 * Xử lý khi kéo qua
 */
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

/**
 * Xử lý khi kéo vào
 */
function handleDragEnter(e) {
    if (this !== draggedElement) {
        this.classList.add('drag-over');
    }
}

/**
 * Xử lý khi kéo ra
 */
function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

/**
 * Xử lý khi thả
 */
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedElement !== this) {
        // Swap elements
        const allItems = Array.from(document.querySelectorAll('.sortable-item'));
        const draggedIndex = allItems.indexOf(draggedElement);
        const targetIndex = allItems.indexOf(this);
        
        if (draggedIndex < targetIndex) {
            this.parentNode.insertBefore(draggedElement, this.nextSibling);
        } else {
            this.parentNode.insertBefore(draggedElement, this);
        }
    }
    
    return false;
}
