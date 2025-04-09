// Dilemma data
const dilemmas = [
    {
      image: 'images/train.png',
      question: "Would you pull the lever to save 5 people, but kill an innocent bystander instead?"
    },
    {
      image: 'images/cow.png',
      question: "Would you be willing to gift a cow that could significantly improve a family's livelihood instead of giving a direct donation?"
    },
    {
      image: 'images/school.png',
      question: "Would you accept a $110M donation with a condition that there must be windowless rooms?"
    },
    {
      image: 'images/icecream.png',
      question: "Would you pay $3,000 to attend a luxurious gala that benefits poverty that doesn't break even?"
    },
    {
      image: 'images/mich.png',
      question: "Would you pay to make the WCC free for everyone, or pay to send ten low-income students to the University of Michigan?"
    },
    {
      image: 'images/kidney.png',
      question: "Would you donate your kidney to an acquaintance, knowing you were the only match?"
    },
    {
      image: 'images/pills.png',
      question: "Would you accept a $1M donation from the Sackler family for your passion project, knowing it came from fueling opoid addiction?"
    },
    {
      image: 'images/shelter.png',
      question: "Would you give $100,000 to an organization that mathematically optimizes for global impact or your local homeless shelter?"
    },
    {
      image: 'images/batman.png',
      question: "Would you spend $1 million in Make-A-Wish funds to make one child with leukemia be Batman for a day?"
    },
    {
      image: 'images/tree.png',
      question: "Do you think the $400k donation to move this tree was worth it to build Ross?"
    },
    {
      image: 'images/drake.png',
      question: "Do you find very public philanthropic efforts to be inaunthentic?"
    }
];

// You can use your existing image paths instead
const imagePaths = [
  'images/batman.png',
  'images/cow.png',
  'images/drake.png',
  'images/icecream.png',
  'images/kidney.png',
  'images/mich.png',
  'images/pills.png',
  'images/school.png',
  'images/shelter.png',
  'images/train.png',
  'images/tree.png'
];

let currentCardIndex = 0;
let touchStartX = 0;
let touchDeltaX = 0;
let isCardAnimating = false;
const cardContainer = document.getElementById('card-container');
const noButton = document.getElementById('no-button');
const yesButton = document.getElementById('yes-button');
const startButton = document.getElementById('start-button');
const introScreen = document.getElementById('intro-screen');
const appContainer = document.getElementById('app-container');

// Start the app
startButton.addEventListener('click', () => {
  introScreen.classList.remove('visible');
  appContainer.style.display = 'flex';
  loadCards();
});

function loadCards() {
  cardContainer.innerHTML = '';
  
  // Load current card and next card (preloading)
  for (let i = 0; i < Math.min(2, dilemmas.length - currentCardIndex); i++) {
    const cardIndex = currentCardIndex + i;
    const card = createCard(dilemmas[cardIndex], cardIndex);
    cardContainer.appendChild(card);
    
    // Only the top card should be interactive
    if (i === 0) {
      addCardInteractivity(card);
    } else {
      card.style.transform = 'scale(0.95) translateY(10px)';
      card.style.zIndex = '-1';
      card.style.opacity = '0.7';
    }
  }
}

function createCard(dilemma, index) {
  const card = document.createElement('div');
  card.className = 'card';
  card.id = `card-${index}`;
  
  card.innerHTML = `
    <div class="card-content">
      <img class="card-image" src="${dilemma.image}" alt="Dilemma image">
      <div class="card-text">${dilemma.question}</div>
    </div>
  `;
  
  return card;
}

function addCardInteractivity(card) {
  // Touch events for mobile swiping
  card.addEventListener('touchstart', handleTouchStart);
  card.addEventListener('touchmove', handleTouchMove);
  card.addEventListener('touchend', handleTouchEnd);
  
  // Mouse events for desktop dragging
  card.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  
  // Variable to track if we're currently dragging with mouse
  let isDragging = false;
  
  function handleTouchStart(e) {
    if (isCardAnimating) return;
    touchStartX = e.touches[0].clientX;
    touchDeltaX = 0;
  }
  
  function handleTouchMove(e) {
    if (isCardAnimating) return;
    touchDeltaX = e.touches[0].clientX - touchStartX;
    updateCardPosition(touchDeltaX);
  }
  
  function handleTouchEnd() {
    if (isCardAnimating) return;
    handleSwipeEnd();
  }
  
  function handleMouseDown(e) {
    if (isCardAnimating) return;
    e.preventDefault();
    isDragging = true;
    touchStartX = e.clientX;
    touchDeltaX = 0;
  }
  
  function handleMouseMove(e) {
    if (!isDragging || isCardAnimating) return;
    touchDeltaX = e.clientX - touchStartX;
    updateCardPosition(touchDeltaX);
  }
  
  function handleMouseUp() {
    if (!isDragging || isCardAnimating) return;
    isDragging = false;
    handleSwipeEnd();
  }
  
  function updateCardPosition(deltaX) {
    // Calculate rotation based on swipe distance
    const rotate = deltaX * 0.1;
    card.style.transform = `translateX(${deltaX}px) rotate(${rotate}deg)`;
    
    // Change opacity of buttons based on swipe direction
    if (deltaX > 0) {
      yesButton.style.transform = `scale(${1 + Math.min(deltaX / 300, 0.3)})`;
      noButton.style.transform = 'scale(1)';
    } else if (deltaX < 0) {
      noButton.style.transform = `scale(${1 + Math.min(Math.abs(deltaX) / 300, 0.3)})`;
      yesButton.style.transform = 'scale(1)';
    } else {
      noButton.style.transform = 'scale(1)';
      yesButton.style.transform = 'scale(1)';
    }
  }
  
  function handleSwipeEnd() {
    // If swipe distance is less than threshold, return card to center
    if (Math.abs(touchDeltaX) < 100) {
      card.style.transform = 'translateX(0) rotate(0)';
      noButton.style.transform = 'scale(1)';
      yesButton.style.transform = 'scale(1)';
      return;
    }
    
    isCardAnimating = true;
    
    // Complete the swipe animation
    if (touchDeltaX > 0) {
      card.classList.add('swiped-right');
      // Here you could track the "yes" answer
      console.log("Swiped YES on question:", dilemmas[currentCardIndex].question);
    } else {
      card.classList.add('swiped-left');
      // Here you could track the "no" answer
      console.log("Swiped NO on question:", dilemmas[currentCardIndex].question);
    }
    
    // Reset button size
    noButton.style.transform = 'scale(1)';
    yesButton.style.transform = 'scale(1)';
    
    // Move to next card after animation
    setTimeout(() => {
      isCardAnimating = false;
      currentCardIndex++;
      
      // If we've gone through all dilemmas, start over
      if (currentCardIndex >= dilemmas.length) {
        currentCardIndex = 0;
      }
      
      loadCards();
    }, 300);
  }
}

// Button click handlers
noButton.addEventListener('click', () => {
  const currentCard = document.querySelector('.card:not(.swiped-left):not(.swiped-right)');
  if (!currentCard || isCardAnimating) return;
  
  isCardAnimating = true;
  currentCard.classList.add('swiped-left');
  
  // Here you could track the "no" answer
  console.log("Clicked NO on question:", dilemmas[currentCardIndex].question);
  
  setTimeout(() => {
    isCardAnimating = false;
    currentCardIndex++;
    
    // If we've gone through all dilemmas, start over
    if (currentCardIndex >= dilemmas.length) {
      currentCardIndex = 0;
    }
    
    loadCards();
  }, 300);
});

yesButton.addEventListener('click', () => {
  const currentCard = document.querySelector('.card:not(.swiped-left):not(.swiped-right)');
  if (!currentCard || isCardAnimating) return;
  
  isCardAnimating = true;
  currentCard.classList.add('swiped-right');
  
  // Here you could track the "yes" answer
  console.log("Clicked YES on question:", dilemmas[currentCardIndex].question);
  
  setTimeout(() => {
    isCardAnimating = false;
    currentCardIndex++;
    
    // If we've gone through all dilemmas, start over
    if (currentCardIndex >= dilemmas.length) {
      currentCardIndex = 0;
    }
    
    loadCards();
  }, 300);
});