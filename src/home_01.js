
import '@/styles/home_01.scss';

import * as THREE from 'three';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LocomotiveScroll from 'locomotive-scroll';
//import Gallery1 from 'demo-1';


gsap.registerPlugin(ScrollTrigger);

const locoScroll = new LocomotiveScroll({
    el: document.querySelector(".smooth-scroll"),
    smooth: true
});
locoScroll.on("scroll", ScrollTrigger.update);

ScrollTrigger.scrollerProxy(".smooth-scroll", {
    scrollTop(value) {
        return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
        return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
    }
});

//----------------
var pinBoxWidth = window.innerHeight*0.85185;
var featureCardWidth = document.querySelector('.card-wrap').offsetHeight * 0.85;
let tipConWidth = document.querySelector('.tip-wrap').offsetWidth;

var horizontalScrollLength = pinBoxWidth + document.querySelector('.hero-con-wrap').offsetWidth + document.querySelector('.header').offsetWidth - window.innerWidth;

let featureCards = document.querySelectorAll('.card-wrap');
let featureCardsWrap = document.querySelector('.features-pin-wrap');
let featureCardsWrapWidth = featureCardWidth * 4 + (140*5)- window.innerWidth;
function initCards(){
    for(var i =0; i<featureCards.length; i++){
        featureCards[i].style.width = featureCardWidth + 'px';
    }
    featureCardsWrap.style.width = featureCardWidth * 4 + (140*5) +'px';
    return;
};
initCards();

gsap.to(".pin-wrap", {
scrollTrigger: {
    scroller: ".smooth-scroll",
    scrub: true,
    trigger: "#sectionPin",
    pin: "#sectionPin",
    start: "top top",
    end: horizontalScrollLength
}, 
x: -horizontalScrollLength,
ease: "none"
});

gsap.to(".grid-sample", {
    scrollTrigger: {
        scroller: ".smooth-scroll",
        scrub: true,
        trigger: ".section-grid",
        pin: ".section-grid",
        start: "top top",
        end: tipConWidth + 'px'
    }, 
    x: -tipConWidth,
    ease: "none"
});

gsap.to(".features-pin-wrap", {
    scrollTrigger: {
        scroller: ".smooth-scroll",
        scrub: true,
        trigger: ".section-features",
        pin: ".section-features",
        start: "top top",
        end: featureCardsWrap.style.width
    }, 
    x: -featureCardsWrapWidth,
    ease: "none"
});

ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
ScrollTrigger.refresh();

