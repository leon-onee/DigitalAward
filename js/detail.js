
function initDetailGallery() {
	const detailGallery = new Swiper('.detail-content__slider', {
		// loop: true,
		freeMode: true,
		speed: 1000,
		slidesPerView: 'auto',
		spaceBetween: 10,
		scrollbar: {
			el: '.detail-content__scrollbar',
		},
		breakpoints: {
			1280: {
				spaceBetween: 12,
			},
			1920: {
				spaceBetween: 16,
			},
		},
	})
}
function initWorksGallery() {
	const worksGallery = new Swiper('.works__gallery-slider', {
		// loop: true,
		// freeMode: true,
		speed: 1000,
		slidesPerView: 1,
		spaceBetween: 10,
		navigation: {
			nextEl: '.works__gallery-next',
			prevEl: '.works__gallery-prev',
		},
		scrollbar: {
			el: '.works__gallery-scrollbar',
		},
		breakpoints: {
			768: {
				slidesPerView: 'auto',
			},
			1280: {
				spaceBetween: 12,
			},
			1920: {
				spaceBetween: 16,
			},
		},
	})
}

function swiperSliders() {
	initDetailGallery()
	initWorksGallery()
}


function init() {
	swiperSliders()
}

document.addEventListener('DOMContentLoaded', init)
