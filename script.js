// Main landing page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle game tile clicks
    const gameTiles = document.querySelectorAll('.game-tile');
    
    gameTiles.forEach(tile => {
        tile.addEventListener('click', function() {
            const gameType = this.getAttribute('data-game');
            
            // Don't navigate if it's coming soon
            if (gameType === 'coming-soon') {
                // Add shake animation for coming soon
                this.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    this.style.animation = '';
                }, 500);
                return;
            }
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                // Navigate to the game
                if (gameType === 'krishna') {
                    window.location.href = 'games/krishna/index.html';
                }
            }, 150);
        });
        
        // Add hover sound effect (optional)
        tile.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        tile.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Add some festive animations
    createFloatingElements();
});

// Create floating festive elements
function createFloatingElements() {
    const symbols = ['🪔', '🌸', '✨', '🎊', '🌺'];
    const container = document.body;
    
    function createFloatingElement() {
        const element = document.createElement('div');
        element.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        element.style.position = 'fixed';
        element.style.left = Math.random() * 100 + 'vw';
        element.style.top = '100vh';
        element.style.fontSize = '1.5rem';
        element.style.pointerEvents = 'none';
        element.style.zIndex = '1';
        element.style.opacity = '0.7';
        element.style.animation = `float ${5 + Math.random() * 5}s linear forwards`;
        
        container.appendChild(element);
        
        // Remove element after animation
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 10000);
    }
    
    // Create floating elements periodically
    setInterval(createFloatingElement, 3000);
    
    // Add CSS for floating animation
    if (!document.getElementById('floating-styles')) {
        const style = document.createElement('style');
        style.id = 'floating-styles';
        style.textContent = `
            @keyframes float {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0.7;
                }
                50% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
}
