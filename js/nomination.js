function initTextarea() {
	const textareaWrappers = document.querySelectorAll('.nomination-textarea')

	if (!textareaWrappers.length) {
		return
	}

	const calcHeight = textarea => {
		textarea.style.height = 'auto'

		const height = textarea.scrollHeight
		return height
	}

	const setHeight = textarea => {
		textarea.style.height = calcHeight(textarea) + 'px'
	}

	const updateCharCount = (textarea, counterSpan) => {
		const currentLength = textarea.value.length
		const maxLength = textarea.getAttribute('maxlength')
		if (currentLength > 0) {
			counterSpan.innerHTML = `<span>${currentLength}</span>/${maxLength}`
			textarea.classList.add('not-empty')
		} else {
			counterSpan.innerHTML = `0/${maxLength}`
			textarea.classList.remove('not-empty')
		}
	}

	const handleInput = event => {
		const textarea = event.target
		const counterSpan = textarea.nextElementSibling
		updateCharCount(textarea, counterSpan)
		setHeight(textarea)
	}

	textareaWrappers.forEach(textareaWrapper => {
		const textarea = textareaWrapper.querySelector('textarea')
		const maxLength = textarea.getAttribute('maxlength')
		const counterSpan = document.createElement('span')
		counterSpan.className = 'char-count'
		counterSpan.innerHTML = `0/${maxLength}`
		textarea.parentNode.insertBefore(counterSpan, textarea.nextSibling)
		updateCharCount(textarea, counterSpan)

		textarea.addEventListener('input', handleInput)
		textarea.addEventListener('transitionend', () => {
			setHeight(textarea)
		})
	})
}

function duplicateInputBlocks(inputFile) {
	const slider = inputFile.closest('.nomination-form__slider')
	const maxInputs = parseInt(slider?.getAttribute('data-max'), 10)
	if (!maxInputs) {
		return
	}
	const wrapper = slider.querySelector('.nomination-file__wrapper')
	const inputBlocks = wrapper.querySelectorAll('.nomination-file__input')

	if (
		inputFile === inputBlocks[inputBlocks.length - 1] &&
		inputBlocks.length < maxInputs
	) {
		const clonedInputBlock = inputFile.cloneNode(true)
		clonedInputBlock.classList.remove('added')
		const imgPreview = clonedInputBlock.querySelector(
			'.nomination-file__input-img'
		)
		imgPreview.innerHTML = ''
		const input = clonedInputBlock.querySelector('input')
		input.value = ''
		wrapper.appendChild(clonedInputBlock)

		initInputFile(clonedInputBlock)
	}
}

function initInputFile(specificInput = null) {
	const inputsFile = specificInput
		? [specificInput]
		: document.querySelectorAll('.nomination-file__input')
	if (!inputsFile.length) {
		return
	}
	// let dt = new DataTransfer()

	const handleChange = (inputFile, files) => {
		const input = inputFile.querySelector('input')
		const imgPreview = inputFile.querySelector('.nomination-file__input-img')
		const progressBar = inputFile.querySelector('.nomination-file__progress')
		const progress = progressBar.querySelector('progress')
		const progressPercent = progressBar.querySelector(
			'.nomination-file__progress-percent'
		)

		Array.from(files).forEach(file => {
			// console.log(dt.items)
			// dt.items.add(file)
			let reader = new FileReader()

			reader.onloadstart = () => {
				progress.value = 0
				progressPercent.textContent = '0%'
				inputFile.style.pointerEvents = 'none'
				inputFile.classList.add('loading')
			}

			reader.onprogress = event => {
				if (event.lengthComputable) {
					const percentLoaded = Math.round((event.loaded / event.total) * 100)
					progress.value = percentLoaded
					progressPercent.textContent = `${percentLoaded}%`
				}
			}
			reader.onload = () => {
				let mediaTag
				if (file.type.startsWith('video/')) {
					mediaTag = document.createElement('video')
				} else {
					mediaTag = document.createElement('img')
				}
				console.log(URL.createObjectURL(file))
				mediaTag.src = URL.createObjectURL(file)
				mediaTag.alt = file.name
				imgPreview.append(mediaTag)
				inputFile.classList.remove('loading')
				inputFile.classList.add('added')

				inputFile.style.pointerEvents = 'auto'
			}
			reader.onerror = () => {
				console.error('Ошибка при чтении файла:', reader.error)
				inputFile.classList.remove('loading')
				inputFile.style.pointerEvents = 'auto'
			}
			reader.readAsDataURL(file)
		})

		// input.files = dt.files

		duplicateInputBlocks(inputFile)
	}

	const removeFilesItem = inputFile => {
		const input = inputFile.querySelector('input')
		const fileImg = inputFile.querySelector(
			'.nomination-file__input-img > :is(img, video)'
		)
		// for (let i = 0; i < dt.items.length; i++) {
		// 	if (fileImg.getAttribute('alt') === dt.items[i].getAsFile().name) {
		// 		console.log(dt.items)
		// 		dt.items.remove(i)
		// 	}
		// }
		fileImg.remove()
		inputFile.classList.remove('added')

		input.value = ''
	}

	inputsFile.forEach(inputFile => {
		inputFile.addEventListener('dragover', function (e) {
			e.preventDefault()
			inputFile.classList.add('dragover')
		})

		inputFile.addEventListener('dragend', function (e) {
			inputFile.classList.remove('dragover')
		})

		inputFile.addEventListener('dragleave', function (e) {
			inputFile.classList.remove('dragover')
		})

		inputFile.addEventListener('drop', function (e) {
			e.preventDefault()
			inputFile.classList.remove('dragover')
			const files = e.dataTransfer.files
			if (files.length) {
				handleChange(inputFile, files)
			}
		})

		const input = inputFile.querySelector('.project-files__input')
		input.addEventListener('change', () => {
			handleChange(inputFile, input.files)
		})

		const removeBtn = inputFile.querySelector('.nomination-file__input-icon')
		removeBtn.addEventListener('click', () => {
			removeFilesItem(inputFile)
		})
	})
}

function initNominationForm() {
	function createValidator(formElement, modal) {
		const validationConfig = {
			validateBeforeSubmitting: true,
			errorFieldCssClass: 'invalid',
			errorLabelStyle: {
				color: 'var(--red-1)',
			},
			successFieldStyle: {
				borderColor: 'var(--red-1)',
			},
		}

		const validator = new window.JustValidate(formElement, validationConfig)
		setupValidationRules(validator, formElement)
		// let isFormValid = false
		// formElement.addEventListener('submit', e => {
		// 	console.log('formElement submit')
		// 	e.preventDefault()
		// 	if (!isFormValid) {
		// 		return
		// 	}
		// 	if (callback && typeof callback === 'function') {
		// 		callback(e)
		// 	}
		// 	isFormValid = false
		// })

		// if (isFormValid) {
		// }
		console.log(validator)
		validator.onSuccess(() => {
			// isFormValid = true
			console.log('Validation successful')
			modal.open()
		})
	}

	function setupValidationRules(validator, form) {
		form.querySelectorAll('[required]').forEach(input => {
			validator.addField(input, [
				{
					rule: 'required',
					errorMessage: 'Поле обязательно для заполнения',
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
					errorMessage: 'Поле обязательно для заполнения',
				},
			])
		})
		form.querySelectorAll('[type="url"]').forEach(url => {
			validator.addField(url, [
				{
					rule: 'customRegexp',
					value:
						/https?:\/\/(?:www\.)?(vimeo\.com\/\d+|youtube\.com\/watch\?v=[\w-]+|vk\.com\/vkvideo\?z=video[\w-]+)/gi,
					errorMessage: 'Поле заполнено некорректно',
				},
			])
		})
		form.querySelectorAll('[type="file"][required]').forEach(file => {
			validator.addField(file, [
				{
					rule: 'minFilesCount',
					value: 1,
					errorMessage: 'Необходимо добавить файл',
				},
			])
		})

		validator.onValidate(({ isValid, isSubmitted, fields, groups }) => {
			for (i in fields) {
				const item = fields[i]
				item.rules.forEach(obj => {
					if (isSubmitted && obj.rule === 'minFilesCount') {
						item.elem.closest('.nomination-file')?.classList.add('invalid')
					}
				})
				if (item.isValid) {
					item.elem.closest('.nomination-file')?.classList.remove('invalid')
				}
			}
		})
	}

	async function handleFormSubmission(form, modal) {
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
		createValidator(formElement, modal)
	}

	function initValidationForm() {
		const setupPaymentMethodButtons = (modalPaymentMethod, modalSuccess) => {
			const btns = document.querySelectorAll('.modal-payment-method__btn')
			const paymentMethod = document.querySelector(
				'.nomination-form__payment-method'
			)
			const formElement = document.querySelector('.nomination-form__info')

			btns.forEach(btn => {
				btn.addEventListener('click', async () => {
					const value = btn.dataset.value
					paymentMethod.value = value
					await handleFormSubmission(formElement, modalSuccess)
					modalPaymentMethod.close()
				})
			})
		}
		const modalSuccess = new Modal('.modal-success')
		const modalPaymentMethod = new Modal('.modal-payment-method')
		const nominationForm = document.querySelector('.nomination-form__info')

		initializeForm(nominationForm, modalPaymentMethod)
		setupPaymentMethodButtons(modalPaymentMethod, modalSuccess)
	}

	initValidationForm()
}

function init() {
	initTextarea()
	initInputFile()
	initNominationForm()
}

document.addEventListener('DOMContentLoaded', init)
