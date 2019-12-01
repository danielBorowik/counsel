// navbar events
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.navbar');
const logo = document.querySelector('.logo');

const HamburgerHandleClick = () => {
    hamburger.classList.toggle('hamburger--active');
    nav.classList.toggle('navbar--active');
};

hamburger.addEventListener('click', HamburgerHandleClick);

navLinks.forEach(item =>
    item.addEventListener('click', () => {
        if (nav.classList.contains('navbar--active')) {
            hamburger.classList.toggle('hamburger--active');
            nav.classList.toggle('navbar--active');
        }
    })
);

// debounce function from https://davidwalsh.name/javascript-debounce-function

function debounce(func, wait = 30, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// increasing numbers

const numbersContainer = document.querySelector('.numbers_container');
const numbers = document.querySelectorAll('.number');
const coffeeCups = numbers[0];
const subscribers = numbers[1];
const customers = numbers[2];
const purchases = numbers[3];

let numbersFlag = true;

const increase = (whatNumber, intervalName, howMuch) => {
    intervalName = setInterval(() => {
        if (whatNumber === subscribers) {
            whatNumber.innerText = parseInt(whatNumber.innerText, 10) + 5000;
        } else {
            whatNumber.innerText = parseInt(whatNumber.innerText, 10) + 50;
        }

        if (
            whatNumber === subscribers &&
            parseInt(whatNumber.innerText, 10) === 1000000
        ) {
            whatNumber.innerText = '1M';
            clearInterval(intervalName);
        }
        if (parseInt(whatNumber.innerText, 10) >= howMuch) {
            clearInterval(intervalName);
        }
    }, 10);
};

const coffeeIncrease = () => increase(coffeeCups, 'coffeeInterval', 7900);
const subscribersIncrease = () =>
    increase(subscribers, 'subscribersInterval', 1000000);
const customersIncrease = () => increase(customers, 'customersInterval', 8300);
const purchasesIncrease = () => increase(purchases, 'purchasesInterval', 9850);

const increaseAllNumbers = () => {
    if (numbersFlag === true) {
        const containerPosition = numbersContainer.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;
        if (containerPosition < screenPosition) {
            coffeeIncrease();
            subscribersIncrease();
            customersIncrease();
            purchasesIncrease();
            numbersFlag = false;
        }
    }
};

window.addEventListener('scroll', debounce(increaseAllNumbers));

// scroll

const linkScroll = trgt => {
    const target = document.querySelector(trgt);
    const targetPosition =
        target.getBoundingClientRect().top - window.innerHeight / 8;
    window.scrollBy(0, targetPosition);
};

const scrollEvents = [...navLinks, logo];

scrollEvents.forEach(item => {
    item.addEventListener('click', () => {
        linkScroll(item.dataset.where, 100);
    });
});

// pop up elements

const textDivs = document.querySelectorAll('.info_side_section');
const quotationDiv = document.querySelector('.quotation_wrapper');
const popUpArray = [...textDivs, quotationDiv];

const arrayScrollAppear = () => {
    popUpArray.forEach(item => {
        const position = item.getBoundingClientRect().top;
        const screenPos = window.innerHeight;
        const displayPos = screenPos * (9 / 10);
        if (position < displayPos) item.classList.remove('disabled');
    });
};

window.addEventListener('scroll', debounce(arrayScrollAppear));
