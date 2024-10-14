document.addEventListener('DOMContentLoaded', function () {

    fetch('data.json')
        .then(response => response.json())
        .then(slidesData => {
            const slidesContainer = document.getElementById('slidesContainer');
            slidesData.forEach(slide => {
                const slideElement = createSlideElement(slide);
                slidesContainer.appendChild(slideElement);
            });
        
            initializeSlider('slider2', 5000, slidesData);
            
        })
        .catch(error => console.error('Error fetching data:', error));
});

// function to create a slide element
function createSlideElement(slide) {
    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slide');

    slideDiv.innerHTML = `
        <div>
            <p class="description">${slide.description}</p>
        </div>
        <div class="imageDiv">
            <img src="${slide.image}" alt="${slide.name}" />
        </div>
        <div class="text-container">
            <h3 class="employee-name">${slide.name}</h3>
            <p class="job-title">${slide.jobTitle}</p>
            <button class="cv-button">View CV Sample</button>
        </div>
    `;

    return slideDiv;
}

// function to initialize each slider
function initializeSlider(sliderId, intervalTime) {
    let slider = document.getElementById(sliderId);
    let slides = slider.querySelector('.slides');
    let slidesCount = slides.children.length;
    let dotsContainer = document.getElementById('dots' + sliderId.slice(-1));
    let index = 0;
    let autoPlay;

    // create dots and set active dot
    for (let i = 0; i < slidesCount; i++) {
        let dot = document.createElement('div');
        dot.classList.add('dot');
        dot.addEventListener('click', () => goToSlide(sliderId, i));
        dotsContainer.appendChild(dot);
    }
    updateDots(sliderId, index);

    // auto play functionality
    autoPlay = setInterval(() => nextSlide(sliderId), intervalTime);

    // go to the next slide
    window.nextSlide = (id) => {
        if (id === sliderId) {
            index = (index + 1) % slidesCount;
            updateSlider(sliderId, index);
        }
    };

    // go to the previous slide
    window.prevSlide = (id) => {
        if (id === sliderId) {
            index = (index - 1 + slidesCount) % slidesCount;
            updateSlider(sliderId, index);
        }
    };

    // go to specific slide
    window.goToSlide = (id, i) => {
        if (id === sliderId) {
            index = i;
            updateSlider(sliderId, index);
        }
    };

    function updateSlider(id, i) {
        let s = document.getElementById(id).querySelector('.slides');
        s.style.transform = `translateX(${-i * 100}%)`;
        updateDots(id, i);
    }

    function updateDots(id, i) {
        let dots = document.getElementById('dots' + id.slice(-1)).children;
        for (let j = 0; j < dots.length; j++) {
            dots[j].classList.remove('active');
        }
        dots[i].classList.add('active');
    }
}
