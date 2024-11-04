class CustomSelect {
	constructor(selectElement) {
		this.selectElement = selectElement
		this.selectOptions = selectElement.children
		this.init()
	}

	init() {
		this.hideOriginalSelect()
		this.createSelectWrapper()
		this.createStyledSelect()
		this.populateOptions()
		this.setupListeners()
		this.setInitialWidth()
	}

	hideOriginalSelect() {
		this.selectElement.classList.add('select-hidden')
	}

	createSelectWrapper() {
		this.selectWrapper = document.createElement('div')
		this.selectWrapper.classList.add('select')
		this.selectElement.parentNode.insertBefore(
			this.selectWrapper,
			this.selectElement
		)
		this.selectWrapper.appendChild(this.selectElement)
	}

	createStyledSelect() {
		this.selectStyled = document.createElement('div')
		this.selectStyled.classList.add('select-styled')
		this.selectWrapper.appendChild(this.selectStyled)

		this.selectTitle = document.createElement('span')
		this.selectTitle.classList.add('select-styled__title')
		this.selectTitle.textContent =
			this.selectElement.getAttribute('data-title') ||
			this.selectOptions[0].textContent
		this.selectStyled.appendChild(this.selectTitle)
	}

	populateOptions() {
		this.optionsList = document.createElement('ul')
		this.optionsList.classList.add('select-options')
		this.selectStyled.parentNode.insertBefore(
			this.optionsList,
			this.selectStyled.nextSibling
		)

		const options = this.selectOptions
		for (let i = 0; i < options.length; i++) {
			const option = options[i]
			const listItem = document.createElement('li')
			listItem.textContent = option.textContent
			listItem.setAttribute('rel', option.value)
			this.optionsList.appendChild(listItem)
		}
		this.listItems = this.optionsList.children
	}

	setupListeners() {
		this.selectStyled.addEventListener('click', e => this.toggleOptions(e))
		Array.from(this.listItems).forEach(item =>
			item.addEventListener('click', e => this.selectOption(e))
		)
		document.addEventListener('click', () => this.closeOptions())
	}

	toggleOptions(event) {
		event.stopPropagation()
		document.querySelectorAll('.select-styled.active').forEach(item => {
			if (item !== this.selectStyled) {
				item.classList.remove('active')
				item.nextElementSibling.classList.remove('open')
			}
		})
		this.selectStyled.classList.toggle('active')
		this.optionsList.classList.toggle('open')
	}

	selectOption(event) {
		event.stopPropagation()
		const selectedItem = event.currentTarget
		this.selectTitle.textContent = selectedItem.textContent
		this.selectTitle.classList.remove('active')
		this.selectElement.value = selectedItem.getAttribute('rel')
		this.optionsList.classList.remove('open')
		this.selectStyled.classList.remove('active')
		Array.from(this.listItems).forEach(li => li.classList.remove('active'))
		selectedItem.classList.add('active')

		if (!this.selectWrapper.classList.contains('selected')) {
			this.selectWrapper.classList.add('selected')
		}
		const invalidParent = this.selectElement.closest('.invalid')
		if (invalidParent) {
			invalidParent.classList.remove('invalid')
		}

		const eventChange = new Event('change')
		this.selectElement.dispatchEvent(eventChange)
	}

	closeOptions() {
		this.selectStyled.classList.remove('active')
		this.optionsList.classList.remove('open')
	}

	setInitialWidth() {
		const intitalWidth = this.selectElement.offsetWidth + 1
		this.selectElement.parentNode.style.width = intitalWidth + 'px'
	}
}

class Overlay {
	constructor() {
		this.body = document.body
		this.noScroll = document.querySelector('body')
		this.overlay = document.createElement('div')
	}

	add() {
		this.body.classList.add('no-scroll')
		this.body.append(this.overlay)
		this.overlay.classList.add('overlay')
	}
	remove() {
		this.body.classList.remove('no-scroll')
		this.overlay.classList.remove('overlay')
		this.overlay.remove()
	}
}

class HeaderMenu {
	constructor() {
		this.overlay = new Overlay()
		this.noScrollBody = document.body
		this.header = document.querySelector('.header')
		this.btn = document.querySelector('.header__burger')
		this.menu = document.querySelector('.header__menu')

		this.setupEventListeners()
		this.handleClickHeaderMenu()
	}

	setupEventListeners() {
		this.btn.addEventListener('click', this.toggle.bind(this))
	}

	toggle() {
		if (this.header.classList.contains('header__menu--open')) {
			this.close()
		} else {
			this.open()
		}
	}

	open() {
		this.header.classList.add('header__menu--open')
		this.btn.classList.add('active')
		this.noScrollBody.classList.add('no-scroll')
		this.overlay.add()
	}

	close() {
		this.header.classList.remove('header__menu--open')
		this.btn.classList.remove('active')
		this.noScrollBody.classList.remove('no-scroll')
		this.overlay.remove()
	}

	handleClickHeaderMenu() {
		if (window.innerWidth < 768) {
			const headerMenuLinks = this.menu.querySelectorAll('a')
			headerMenuLinks.forEach(link => {
				link.addEventListener('click', () => {
					this.close()
				})
			})
		}
	}
}

class Modal {
	static instances = new Map()
	constructor(modal, openBtn = null) {
		if (Modal.instances.has(modal)) {
			return Modal.instances.get(modal)
		}
		this.overlay = new Overlay()
		this.modal = document.querySelector(modal)
		this.openBtn = openBtn
		this.closeBtn = '.modal__close'
		this.isOpen = null
		this.onOpen = null
		this.onClose = null
		this.onSubmit = null

		this.addCloseBtn()
		this.setupEventListeners()

		Modal.instances.set(modal, this)
	}

	setupEventListeners() {
		document.addEventListener('click', this.onClickOpen.bind(this))
		document.addEventListener('click', this.onClickClose.bind(this))
		document.addEventListener('keydown', this.handleKeyDown.bind(this))
		document.addEventListener('click', this.handleModalPopup.bind(this))
	}

	open(target) {
		this.isOpen = true
		this.modal.classList.add('active')
		this.overlay.add()
		if (typeof this.onOpen === 'function') {
			this.onOpen(target)
		}
	}

	close() {
		this.isOpen = false
		this.modal.classList.remove('active')
		this.overlay.remove()

		if (typeof this.onClose === 'function') {
			this.onClose()
		}
	}

	onClickOpen(event) {
		const target = event.target
		if (target.closest(this.openBtn)) {
			this.open(target)
		}
	}
	onClickClose(event) {
		const target = event.target
		if (target.closest(this.closeBtn)) {
			this.close()
		}
	}

	handleKeyDown(event) {
		if (event.key === 'Escape') {
			event.preventDefault()
			this.close()
		}
	}

	handleModalPopup(event) {
		const target = event.target
		if (target.closest('.overlay') || target.closest('.modal__close')) {
			this.close()
		}
	}

	addCloseBtn() {
		const button = document.createElement('button')
		button.classList.add('modal__close')
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		svg.setAttribute('width', '28')
		svg.setAttribute('height', '28')
		svg.setAttribute('viewBox', '0 0 28 28')
		const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
		use.setAttribute('href', './assets/svg/sprite.svg#icon-close')
		svg.appendChild(use)
		button.appendChild(svg)
		if (this.modal) {
			this.modal.appendChild(button)
		}
	}

	showSuccessForm() {
		if (!this.isOpen) {
			this.open()
		}
		const form = this.modal.querySelector('form')
		const success = this.modal.querySelector('.modal__success')

		if (!form && !success) {
			return
		}
		success.classList.add('active')
		form?.classList.add('hide')

		setTimeout(() => {
			this.close()
			success.classList.remove('active')
			form?.classList.remove('hide')
		}, 3000)
	}

	static closeAll() {
		document.querySelectorAll('.modal').forEach(modal => {
			modal.classList.remove('active')
		})
		document.querySelectorAll('.overlay').forEach(overlay => {
			overlay.remove()
		})
	}
}

function initTelMask() {
	const telMasks = document.querySelectorAll('[data-telinput]')
	if (telMasks.length === 0) {
		return
	}
	telMasks.forEach(telMask => {
		Inputmask('+7 (999) 999-99-99').mask(telMask)
	})
}

function isTouchDevice() {
	return (
		'ontouchstart' in window ||
		navigator.maxTouchPoints > 0 ||
		navigator.msMaxTouchPoints > 0
	)
}

function initScrollSmooth() {
	SmoothScroll({
		animationTime: 800,
		// Уменьшить время анимации
		stepSize: 80,
		// Немного увеличить размер шага

		// Дополнительные настройки:
		accelerationDelta: 40,
		// Уменьшить ускорение
		accelerationMax: 2,
		// Уменьшить максимальное ускорение
		keyboardSupport: true,
		// Поддержка клавиатуры
		arrowScroll: 50,
		// Шаг скролла стрелками на клавиатуре в пикселях

		// Pulse (less tweakable)
		// ratio of "tail" to "acceleration"
		pulseAlgorithm: true,
		pulseScale: 3,
		pulseNormalize: 1,
		touchpadSupport: true, // Поддержка тачпада
	})
}

function hideHeader() {
	const header = document.querySelector('.header')
	const sticky = document.querySelector('.sticky')
	if (!sticky) {
		return
	}
	const paddingTop = +getComputedStyle(sticky)
		.getPropertyValue('padding-top')
		.replace('px', '')

	const onScrollMainBanner = () => {
		// console.log(window.scrollY, paddingTop)
		if (window.scrollY < sticky.offsetHeight && window.scrollY > paddingTop) {
			header.classList.add('_hide')
		} else {
			header.classList.remove('_hide')
		}
	}

	onScrollMainBanner()
	window.addEventListener('scroll', onScrollMainBanner)
}

function initTabs() {
	const showTab = elTabBtn => {
		const elTab = elTabBtn.closest('.tab')
		if (elTabBtn.classList.contains('tab-btn-active')) {
			return
		}
		const targetId = elTabBtn.dataset.targetId
		const elTabPane = elTab.querySelector(`.tab-pane[data-id="${targetId}"]`)
		if (elTabPane) {
			const elTabBtnActive = elTab.querySelector('.tab-btn-active')
			elTabBtnActive.classList.remove('tab-btn-active')
			const elTabPaneShow = elTab.querySelector('.tab-pane-show')
			elTabPaneShow.classList.remove('tab-pane-show')
			elTabBtn.classList.add('tab-btn-active')
			elTabPane.classList.add('tab-pane-show')
		}
	}
	document.addEventListener('click', e => {
		if (e.target && !e.target.closest('.tab-btn')) {
			return
		}
		const elTabBtn = e.target.closest('.tab-btn')
		showTab(elTabBtn)
	})
}

function reColorHeader() {
	const header = document.querySelector('.header')
	const mainHeight = document.querySelector('main').children[0].offsetHeight
	const detailHeaderBlack = document.querySelector('.detail-header--black')
	const firstItem = document.querySelector('.header__menu li:first-child')

	if (detailHeaderBlack) {
		header.classList.add('_white')
	}

	const onScroll = () => {
		if (detailHeaderBlack) {
			if (window.scrollY > mainHeight) {
				header.classList.remove('_white')
			} else {
				header.classList.add('_white')
			}
		} else {
			if (window.scrollY > mainHeight) {
				header.classList.add('_white')
			} else {
				header.classList.remove('_white')
			}
		}

		if (
			window.location.pathname === '/' ||
			window.location.pathname === '/index.html'
		) {
			if (window.scrollY > mainHeight) {
				firstItem.style.opacity = 1
			} else {
				firstItem.style.opacity = 0
			}
		}
	}

	onScroll()
	window.addEventListener('scroll', onScroll)
}

function setSpaceForFixedItems() {
	const main = document.querySelector('main')
	if (!main) {
		return
	}

	const fixed = document.querySelector('.fixed')
	if (!fixed) {
		return
	}

	main.style.marginBottom = fixed.offsetHeight + 'px'
}

function setFixedHeight() {
	const fixed = document.querySelector('.fixed')
	if (!fixed) {
		return
	}
	const fixedItems = fixed.children
	if (fixedItems.length === 0) {
		return
	}

	const sum = [...fixedItems].reduce((acc, curr) => {
		return acc + curr.offsetHeight
	}, 0)
	fixed.style.height = sum + 'px'
}

function createValidator(formElement, callback) {
	const validationConfig = {
		validateBeforeSubmitting: true,
		errorFieldCssClass: 'invalid',
		errorLabelStyle: {
			color: 'var(--black)',
		},
		successFieldStyle: {
			borderColor: 'var(--black)',
		},
	}

	const validator = new window.JustValidate(formElement, validationConfig)
	setupValidationRules(validator, formElement)
	let isFormValid = false
	formElement.addEventListener('submit', e => {
		e.preventDefault()
		if (!isFormValid) {
			return
		}
		if (callback && typeof callback === 'function') {
			callback(e)
		}
		isFormValid = false
	})

	validator.onSuccess(() => {
		isFormValid = true
		console.log('Validation successful')
	})
}

function setupValidationRules(validator, form) {
	form.querySelectorAll('[required]').forEach(input => {
		validator.addField(input, [
			{
				rule: 'required',
				errorMessage: 'необходимо заполнить поле',
			},
		])
	})

	form.querySelectorAll('[type="email"]').forEach(email => {
		validator.addField(email, [
			{
				rule: 'email',
				errorMessage: 'Поле заполнено некорректно',
			},
			{
				rule: 'required',
				errorMessage: 'необходимо заполнить поле',
			},
		])
	})
}

async function handleFormSubmission(e, modal) {
	e.preventDefault()
	const form = e.currentTarget
	const formData = new FormData(form)
	const actionUrl = form.action
	console.log(modal)
	console.log('Form action URL:', actionUrl)

	for (const [key, value] of formData.entries()) {
		console.log(`${key}: ${value}`)
	}
	modal.showSuccessForm()
	// if (typeof showSuccessForm === 'function') {
	// 	showSuccessForm()
	// }
	// try {
	// 	const response = await fetch(actionUrl, {
	// 		method: 'POST',
	// 		body: formData,
	// 	})
	// 	const result = await response.json()
	// 	form.reset()

	// } catch (error) {
	// 	alert('Ошибка при отправке формы')
	// 	console.error('Form submission error:', error)
	// }
}

function initializeForm(formElement, modal) {
	createValidator(formElement, e => handleFormSubmission(e, modal))
}

function initValidationForms() {
	const modalSuccess = new Modal('.modal-success')
	const questionsForm = document.querySelector('.questions__form')
	initializeForm(questionsForm, modalSuccess)
}

function initScrollToTopBtn() {
	const scrollButton = document.querySelector('.scroll-to-top')
	const footer = document.querySelector('.footer')

	if (!scrollButton || !footer) {
		return
	}

	const handleClick = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const checkScrollPosition = () => {
		const scrollPosition = window.scrollY || document.documentElement.scrollTop
		const windowHeight = window.innerHeight

		if (scrollPosition >= windowHeight) {
			scrollButton.classList.add('show')
		} else {
			scrollButton.classList.remove('show')
		}
	}

	checkScrollPosition()

	window.addEventListener('scroll', checkScrollPosition)

	scrollButton.addEventListener('click', handleClick)
}

function setOffFixed() {
	const fixed = document.querySelector('.fixed')
	if (!fixed) {
		return
	}
	if (fixed.offsetHeight > screen.height) {
		fixed.classList.add('off')
	}
}

function initCustomSelect() {
	document
		.querySelectorAll('select')
		.forEach(select => new CustomSelect(select))
}

function initMouseFollower() {
	const cursor = new MouseFollower()
}

function init() {
	const headerMenu = new HeaderMenu()

	initCustomSelect()
	initScrollToTopBtn()
	initTelMask()
	if (!isTouchDevice()) {
		initScrollSmooth()
		initMouseFollower()
	}
	hideHeader()
	reColorHeader()
	initTabs()
	// setFixedHeight()
	// setSpaceForFixedItems()

	initValidationForms()
	setOffFixed()
}

document.addEventListener('DOMContentLoaded', init)
