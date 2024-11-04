function initGallery() {
	const gallery = new Swiper('.gallery__content', {
		loop: true,
		freeMode: true,
		grabCursor: true,
		autoplay: {
			delay: 0,
			disableOnInteraction: false,
		},
		speed: 5000,
		slidesPerView: 2,
		spaceBetween: 16,
		breakpoints: {
			2500: {
				slidesPerView: 6,
				spaceBetween: 30,
			},
			1550: {
				slidesPerView: 5,
				spaceBetween: 30,
			},
			1280: {
				slidesPerView: 4,
				spaceBetween: 30,
			},
			1024: {
				slidesPerView: 3,
				spaceBetween: 30,
			},
			520: {
				slidesPerView: 2,
				spaceBetween: 30,
			},
		},
	})
}

function onScrollSteps() {
	const mainOrderSteps = document.querySelector('.take-part__steps')
	if (mainOrderSteps) {
		const rootElement = document.querySelector('.main-steps__collision')
		const mainOrderDesk = document.querySelector('.take-part')
		const initialDeskTop = mainOrderDesk.getBoundingClientRect().top

		if (
			initialDeskTop < 0 &&
			Math.abs(mainOrderDesk.scrollHeight) < Math.abs(initialDeskTop)
		) {
			rootElement.style.setProperty('--inside-height', '100%')
		}

		const handleScroll = () => {
			const { top: deskTop, bottom: deskBottom } =
				mainOrderDesk.getBoundingClientRect()

			if (deskTop < 0 && deskBottom > 0) {
				const scrollPercentage =
					(Math.abs(deskTop) /
						(mainOrderDesk.scrollHeight - window.innerHeight)) *
					100

				rootElement.style.setProperty(
					'--inside-height',
					`${Math.abs(Math.round(scrollPercentage))}%`
				)

				checkCollisions()
			}
		}

		window.addEventListener('scroll', handleScroll, false)
		window.addEventListener('mousewheel', handleScroll, false)
		window.addEventListener('touchmove', handleScroll, false)
	}
}

function collisionDetect() {
	document.addEventListener('scroll', checkCollisions)
}

function checkCollisions() {
	const collision = document.querySelector('.main-steps__collision')
	const targets = document.querySelectorAll(
		'.main-steps > *:not(.main-steps__collision)'
	)
	if (collision && targets.length !== 0) {
		isCollapsed(collision, targets)
	}
}

function isCollapsed(collision, targets) {
	const collisionPos = collision.getBoundingClientRect()

	targets.forEach(target => {
		const targetPos = target.getBoundingClientRect()
		const overlap = Math.max(
			0,
			Math.min(collisionPos.bottom, targetPos.bottom) -
				Math.max(collisionPos.top, targetPos.top)
		)

		let overlapPercentage = (overlap / targetPos.height) * 100

		if (
			collisionPos.left < targetPos.left + targetPos.width &&
			collisionPos.left + collisionPos.width > targetPos.left &&
			collisionPos.top < targetPos.top + targetPos.height &&
			collisionPos.top + collisionPos.height > targetPos.top
		) {
			if (target.className.includes('main-steps__desc')) {
				overlapPercentage = Math.min(100, Math.max(0, overlapPercentage))
				target.style.setProperty('--progress', `${overlapPercentage}%`)
			} else {
				const inverseOverlap = 100 - overlapPercentage
				target.style.setProperty('--progress', `${inverseOverlap}%`)
			}
		} else {
			// If collision element is out of target bounds, reset progress
			if (target.className.includes('main-steps__desc')) {
				target.style.setProperty('--progress', '0%')
			} else {
				target.style.setProperty('--progress', '100%')
			}
		}
	})
}

function setPositionTopOnSteps() {
	const steps = document.querySelector('.take-part__steps')
	if (!steps) {
		return
	}
	const info = document.querySelector('.take-part__info')
	const infoStyles = getComputedStyle(steps)
	const initialTop = +infoStyles.getPropertyValue('top').replace('px', '')
	const MARGIN_BOTTOM = 60
	const calculatedTop = initialTop + info.clientHeight + MARGIN_BOTTOM
	steps.style.setProperty('--top', `${calculatedTop}px`)
}

function initScrollSteps() {
	onScrollSteps()
	collisionDetect()
	// setPositionTopOnSteps()
}

function animationFlip() {
	const flipCards = document.querySelectorAll('.flip-card')
	if (flipCards.length === 0) {
		return
	}
	console.log(flipCards)
	const flipInCard = card => {
		card.classList.add('flip-start')
		card.classList.remove('flip-end')
	}
	const flipOutCard = card => {
		card.classList.add('flip-end')
		card.classList.remove('flip-start')
	}
	flipCards.forEach(card => {
		const cardInner = card.querySelector('.flip-card__inner')
		if (!cardInner) {
			return
		}
		let timeout
		card.addEventListener('mouseenter', () => {
			clearTimeout(timeout)
			flipInCard(cardInner)
		})
		card.addEventListener('mouseleave', () => {
			timeout = setTimeout(() => {
				flipOutCard(cardInner)
			}, 1000)
		})
	})
}



function initFlipCards() {
	if (isTouchDevice()) {
		return
	}
	animationFlip()
}

function initJuryGallery() {
	const juryGallery = new Swiper('.jury__gallery-slider', {
		// loop: true,
		// freeMode: true,
		speed: 1000,
		slidesPerView: 1.7,
		spaceBetween: 10,
		navigation: {
			nextEl: '.jury__gallery-next',
			prevEl: '.jury__gallery-prev',
		},
		scrollbar: {
			el: '.jury__gallery-scrollbar',
		},
		breakpoints: {
			768: {
				slidesPerView: 3,
			},
			1280: {
				spaceBetween: 12,
			},
			1920: {
				spaceBetween: 16,
				slidesPerView: 4,
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
	initGallery()
	initWorksGallery()
	initJuryGallery()
}


function init() {
	// speakerMobileChangeImg()
	swiperSliders()
	initScrollSteps()
	initFlipCards()
}

document.addEventListener('DOMContentLoaded', init)
