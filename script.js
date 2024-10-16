document.addEventListener('DOMContentLoaded', () => {
    initializeServiceSlider();
    initializeTeamSlider();
});

// Initialize Service Slider
const initializeServiceSlider = () => {
    fetch('./json/services.json')
        .then(response => response.json())
        .then(slidesData => {
            populateSlides('slidesContainer1', slidesData, createServiceSlideElement);
            initializeSlider('slider1', 4000);
        })
        .catch(error => console.error('Error fetching services data:', error));
};

// Initialize Team Slider Data
const initializeTeamSlider = () => {
    fetch('./json/team.json')
        .then(response => response.json())
        .then(slidesData => {
            populateSlides('slidesContainer2', slidesData, createTeamSlideElement);
            initializeSlider('slider2', 5000);
        })
        .catch(error => console.error('Error fetching team data:', error));
};

// Function to populate slides in the container
const populateSlides = (containerId, slidesData, createSlideElement) => {
    const slidesContainer = document.getElementById(containerId);
    slidesData.forEach(slide => {
        const slideElement = createSlideElement(slide);
        slidesContainer.appendChild(slideElement);
    });
};

// Function to create a service slide element
const createServiceSlideElement = (slide) => {
    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slide');
    slideDiv.innerHTML = `
        <div class="service-slide">
            <div class="imageDiv">
                <img src="${slide.image}" class="serviceImg" alt="${slide.service}" />
            </div>
            <div class="text-container">
                <h3 class="service-name">${slide.service}</h3>
                <p class="description">${slide.description}</p>
                <button class="cv-button">Learn More</button>
            </div>
        </div>`;
    return slideDiv;
};

// Function to create a team slide element
const createTeamSlideElement = (slide) => {
    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slide');
    slideDiv.innerHTML = `
        <div>
            <p class="description">${slide.description}</p>
        </div>
        <div class="imageDiv">
            <img src="${slide.image}" class="teamImg" alt="${slide.name}" />
        </div>
        <div class="text-container">
            <h3 class="employee-name">${slide.name}</h3>
            <p class="job-title">${slide.jobTitle}</p>
            <button class="cv-button">View CV Sample</button>
        </div>`;
    return slideDiv;
};

// Function to initialize each slider
const initializeSlider = (sliderId, intervalTime) => {
    let index = 0;
    const slider = document.getElementById(sliderId);
    const slides = slider.querySelector('.slides');
    const slidesCount = slides.children.length;
    const dotsContainer = document.getElementById('dots' + sliderId.slice(-1));
    let autoPlay;

    const createDots = () => {
        for (let i = 0; i < slidesCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetTimer();
            });
            dotsContainer.appendChild(dot);
        }
    };
    
    const resetTimer = () => {
        clearInterval(autoPlay);
        autoPlay = setInterval(nextSlide, intervalTime);
    };

    const nextSlide = () => {
        index = (index + 1) % slidesCount;
        updateSlider(index);
    };

    const prevSlide = () => {
        index = (index - 1 + slidesCount) % slidesCount;
        updateSlider(index);
    };

    const goToSlide = (i) => {
        index = i;
        updateSlider(index);
    };

    const updateSlider = (i) => {
        console.log("Current slider:", sliderId, "Slide index:", i);
        slides.style.transform = `translateX(${-i * 100}%)`;
        updateDots(i);
        resetTimer();
    };

    const updateDots = (i) => {
        const dots = dotsContainer.children;
        for (let j = 0; j < dots.length; j++) {
            dots[j].classList.remove('active');
        }
        dots[i].classList.add('active');
    };

    // Initialize dots and set active dot
    createDots();
    updateDots(index);
    autoPlay = setInterval(nextSlide, intervalTime);

    // Attach the prevSlide and nextSlide functions to the window object
    window[sliderId + '_prevSlide'] = prevSlide;
    window[sliderId + '_nextSlide'] = nextSlide;
};

// arrow button events outside 
const setupArrowButtons = () => {
    document.querySelectorAll('.arrow.prev').forEach(button => {
        const sliderId = button.closest('.container').querySelector('.slider').id;
        button.addEventListener('click', () => {
            window[sliderId + '_prevSlide']();
        });
    });

    document.querySelectorAll('.arrow.next').forEach(button => {
        const sliderId = button.closest('.container').querySelector('.slider').id;
        button.addEventListener('click', () => {
            // Utilize the functions that have been added to the window object
            window[sliderId + '_nextSlide']();
            
        });
    });
};

setupArrowButtons();
