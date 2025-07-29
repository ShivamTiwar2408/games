// Krishna's Wisdom Wheel Game - Simplified Version
class KrishnaWheel {
    constructor() {
        this.canvas = document.getElementById('wheelCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.spinButton = document.getElementById('spinButton');
        this.messageText = document.getElementById('messageText');
        
        // Wheel properties
        this.centerX = 0;
        this.centerY = 0;
        this.radius = 0;
        this.currentRotation = 0;
        this.isSpinning = false;
        
        // Load Krishna image
        this.krishnaImage = new Image();
        this.krishnaImage.src = 'krishna/krishna_with_flute.jpg';
        this.imageLoaded = false;
        
        this.krishnaImage.onload = () => {
            this.imageLoaded = true;
            this.drawWheel();
        };
        
        // Krishna's divine messages with Bhagavad Gita references
        this.messages = [
            {
                text: "You have the right to perform your prescribed duty, but not to the fruits of action",
                reference: "BG 2.47"
            },
            {
                text: "The soul is neither born, and nor does it die; it is unborn, eternal, permanent",
                reference: "BG 2.20"
            },
            {
                text: "Better is one's own dharma, though imperfectly performed, than the dharma of another",
                reference: "BG 3.35"
            },
            {
                text: "The mind is restless, but it can be controlled by practice and detachment",
                reference: "BG 6.35"
            },
            {
                text: "One who sees inaction in action, and action in inaction, is wise among men",
                reference: "BG 4.18"
            },
            {
                text: "Whatever you do, whatever you eat, offer it all to the Divine",
                reference: "BG 9.27"
            },
            {
                text: "I am the same to all beings; none are dear to Me, nor do I dislike anyone",
                reference: "BG 9.29"
            },
            {
                text: "Abandon all varieties of dharma and surrender unto Me alone",
                reference: "BG 18.66"
            },
            {
                text: "Those who worship Me with devotion, I reside in their hearts",
                reference: "BG 9.29"
            },
            {
                text: "When meditation is mastered, the mind is unwavering like a flame in a windless place",
                reference: "BG 6.19"
            },
            {
                text: "Rise up with your own efforts; do not degrade yourself",
                reference: "BG 6.5"
            },
            {
                text: "I am Time, the destroyer and creator of worlds",
                reference: "BG 11.32"
            }
        ];
        
        // More attractive gradient colors for wheel segments
        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
            '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
            '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
        ];
        
        // Corresponding darker colors for text contrast
        this.darkColors = [
            '#E74C3C', '#16A085', '#2980B9', '#27AE60',
            '#F39C12', '#8E44AD', '#1ABC9C', '#E67E22',
            '#9B59B6', '#3498DB', '#D68910', '#58D68D'
        ];
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.drawWheel();
        this.setupEventListeners();
        window.addEventListener('resize', () => this.setupCanvas());
    }
    
    setupCanvas() {
        // Calculate wheel size to nearly fill the available space
        const container = this.canvas.parentElement;
        const containerRect = container.getBoundingClientRect();
        const size = Math.min(containerRect.width - 30, containerRect.height - 30);
        
        // Set canvas size with device pixel ratio for crisp rendering
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = size * dpr;
        this.canvas.height = size * dpr;
        this.canvas.style.width = size + 'px';
        this.canvas.style.height = size + 'px';
        
        // Scale the context to match device pixel ratio
        this.ctx.scale(dpr, dpr);
        
        this.centerX = size / 2;
        this.centerY = size / 2;
        this.radius = (size / 2) - 8; // Optimized radius for better proportions
        
        this.drawWheel();
    }
    
    drawWheel() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Fill background with white
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const segments = this.messages.length;
        const anglePerSegment = (2 * Math.PI) / segments;
        
        // Draw segments with gradients
        for (let i = 0; i < segments; i++) {
            const startAngle = (i * anglePerSegment) + this.currentRotation;
            const endAngle = ((i + 1) * anglePerSegment) + this.currentRotation;
            
            // Create gradient for each segment
            const gradient = this.ctx.createRadialGradient(
                this.centerX, this.centerY, 80,
                this.centerX, this.centerY, this.radius
            );
            gradient.addColorStop(0, this.colors[i]);
            gradient.addColorStop(1, this.darkColors[i]);
            
            // Draw segment
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle);
            this.ctx.closePath();
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            // Add segment border
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Draw message text along the radius
            this.drawTextAlongRadius(this.messages[i].text, startAngle, endAngle, i);
        }
        
        // Draw center circle with white background (no border)
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 80, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
        
        // Draw Krishna image in center if loaded (bigger size)
        if (this.imageLoaded) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, 75, 0, 2 * Math.PI);
            this.ctx.clip();
            
            const imageSize = 150;
            this.ctx.drawImage(
                this.krishnaImage,
                this.centerX - imageSize/2,
                this.centerY - imageSize/2,
                imageSize,
                imageSize
            );
            this.ctx.restore();
        }
        
        // Draw big marker on the right side
        this.drawMarker();
    }
    
    drawTextAlongRadius(text, startAngle, endAngle, segmentIndex) {
        const midAngle = (startAngle + endAngle) / 2;
        const words = text.split(' ');
        
        // Calculate text properties - bigger and more readable
        const fontSize = Math.max(16, Math.min(20, this.radius / 25));
        this.ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 4;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Start radius for text (near the outer edge)
        let currentRadius = this.radius * 0.85;
        const radiusStep = fontSize + 4; // Space between lines
        const maxRadius = this.radius * 0.4; // Don't go too close to center
        
        let currentLine = '';
        const maxCharsPerLine = Math.floor((this.radius * 0.25) / (fontSize * 0.5));
        
        for (let i = 0; i < words.length; i++) {
            const testLine = currentLine + (currentLine ? ' ' : '') + words[i];
            
            if (testLine.length > maxCharsPerLine && currentLine) {
                // Draw current line
                this.drawTextOnArc(currentLine, midAngle, currentRadius);
                currentLine = words[i];
                currentRadius -= radiusStep;
                
                // Check if we have space for more lines
                if (currentRadius < maxRadius) break;
            } else {
                currentLine = testLine;
            }
        }
        
        // Draw the last line
        if (currentLine && currentRadius >= maxRadius) {
            this.drawTextOnArc(currentLine, midAngle, currentRadius);
        }
    }
    
    drawTextOnArc(text, angle, radius) {
        this.ctx.save();
        
        // Position and rotate for the text
        const x = this.centerX + Math.cos(angle) * radius;
        const y = this.centerY + Math.sin(angle) * radius;
        
        this.ctx.translate(x, y);
        this.ctx.rotate(angle + Math.PI / 2);
        
        // Draw text with outline for better visibility
        this.ctx.strokeText(text, 0, 0);
        this.ctx.fillText(text, 0, 0);
        
        this.ctx.restore();
    }
    
    drawMarker() {
        // Draw a large black triangular pointer on the right side
        const markerSize = 220; // Even bigger size for better visibility
        const markerX = this.centerX + this.radius + 5; // Closer to wheel for better connection
        const markerY = this.centerY;
        
        // Draw marker shadow first
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 5;
        
        // Draw the large triangular pointer pointing left towards the wheel
        this.ctx.beginPath();
        this.ctx.moveTo(markerX, markerY); // Sharp point of the triangle (pointing at wheel)
        this.ctx.lineTo(markerX + markerSize, markerY - markerSize/2); // Top corner
        this.ctx.lineTo(markerX + markerSize, markerY + markerSize/2); // Bottom corner
        this.ctx.closePath();
        
        // Fill with solid black
        this.ctx.fillStyle = '#000000';
        this.ctx.fill();
        
        // Add thick white border for maximum visibility
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 8;
        this.ctx.stroke();
        
        this.ctx.restore();
        
        // Add a larger circle at the tip for better visual connection
        this.ctx.beginPath();
        this.ctx.arc(markerX, markerY, 15, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#000000';
        this.ctx.fill();
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 5;
        this.ctx.stroke();
    }
    
    setupEventListeners() {
        this.spinButton.addEventListener('click', () => this.spin());
    }
    
    spin() {
        if (this.isSpinning) return;
        
        this.isSpinning = true;
        this.spinButton.disabled = true;
        this.spinButton.textContent = 'SPINNING...';
        
        // Hide Krishna's image while spinning
        this.messageText.innerHTML = `
            <div class="message-content">
                <div class="krishna-says">Lord Krishna says:</div>
                <div class="message-text">Spinning the wheel of wisdom...</div>
            </div>
        `;
        
        // Calculate segment angle for precise stopping
        const segmentAngle = (2 * Math.PI) / this.messages.length;
        
        // Moderate spin parameters for better readability during slowdown
        const baseSpins = 4 + Math.random() * 3; // 4-7 full rotations
        const randomSegment = Math.floor(Math.random() * this.messages.length);
        
        // Calculate exact final position to land on a segment
        const targetSegmentCenter = randomSegment * segmentAngle + (segmentAngle / 2);
        const finalRotation = this.currentRotation + (baseSpins * 2 * Math.PI) + targetSegmentCenter;
        
        // Shorter duration for testing
        const duration = 3000; // 3 seconds
        
        const startTime = Date.now();
        const startRotation = this.currentRotation;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Extended slow portion with more pronounced deceleration
            // Using a higher power ease-out for longer, more dramatic slowdown
            const easeProgress = 1 - Math.pow(1 - progress, 6);
            
            this.currentRotation = startRotation + (finalRotation - startRotation) * easeProgress;
            
            this.drawWheel();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Ensure we land exactly on the target
                this.currentRotation = finalRotation;
                this.drawWheel();
                this.stopSpin();
            }
        };
        
        animate();
    }
    
    stopSpin() {
        this.isSpinning = false;
        this.spinButton.disabled = false;
        this.spinButton.textContent = 'SPIN THE WHEEL';
        
        // Calculate which segment the marker is pointing to (right side)
        const normalizedRotation = (this.currentRotation % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const segmentAngle = (2 * Math.PI) / this.messages.length;
        
        // The marker points to the right (0 degrees)
        const markerAngle = (0) - normalizedRotation;
        const adjustedAngle = (markerAngle + 2 * Math.PI) % (2 * Math.PI);
        
        const selectedSegment = Math.floor(adjustedAngle / segmentAngle);
        const messageIndex = selectedSegment % this.messages.length;
        
        // Ensure message display is visible
        const messageDisplay = document.getElementById('messageDisplay');
        messageDisplay.style.display = 'block';
        messageDisplay.style.opacity = '1';
        messageDisplay.style.visibility = 'visible';
        
        // Force the message display to be visible by adding a class
        messageDisplay.classList.add('active-message');
        
        // Display the message with matching color
        this.showMessage(this.messages[messageIndex], this.colors[messageIndex]);
        
        // Log to console for debugging
        console.log("Wheel stopped, showing message:", this.messages[messageIndex].text);
    }
    
    showMessage(messageObj, color) {
        // Add animation class for new message
        this.messageText.classList.remove('new-message');
        
        console.log("Preparing to show Krishna's message with image");
        
        // Small delay to ensure class is removed before adding it back
        setTimeout(() => {
            // Create HTML content with message, reference, and Krishna's image
            console.log("Setting message content with Krishna's image");
            
            this.messageText.innerHTML = `
                <div class="message-content">
                    <div class="krishna-image-container large">
                        <img src="krishna/BG_Krishna.jpg" alt="Lord Krishna" class="krishna-message-image" onload="console.log('Krishna image loaded in DOM')" onerror="console.log('Error loading Krishna image in DOM')">
                    </div>
                    <div class="krishna-says">Lord Krishna says:</div>
                    <div class="message-text">"${messageObj.text}"</div>
                    <div class="message-reference">— ${messageObj.reference}</div>
                </div>
            `;
            
            // Apply styles directly to ensure visibility
            this.messageText.style.color = color;
            this.messageText.style.textShadow = `2px 2px 4px rgba(0, 0, 0, 0.3)`;
            
            // Make sure the message display is visible with important styles
            const messageDisplay = document.getElementById('messageDisplay');
            messageDisplay.style.display = 'block';
            messageDisplay.style.opacity = '1';
            messageDisplay.style.visibility = 'visible';
            
            // Force the message display to be visible by adding a class
            messageDisplay.classList.add('active-message');
            
            // Add animation class
            this.messageText.classList.add('new-message');
            
            // Log to console for debugging
            console.log("Showing Krishna's message:", messageObj.text);
        }, 50);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new KrishnaWheel();
});
