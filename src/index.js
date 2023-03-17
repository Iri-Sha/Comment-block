import './style.css'
const initialComments = [
  {
    name: 'Маша',
    text: 'Привет!',
    date: new Date()
  },
  {
    name: 'Петя',
    text: 'Как дела?',
    date: new Date()
  },
  {
    name: 'Вова',
    text: 'У меня кошка сбежала',
    date: new Date()
  },
  {
    name: 'Антон',
    text: 'Идём пиво пить',
    date: new Date()
  },
];

const commentTemplate = document.querySelector('.comment-template').content;
const elementsComments = document.querySelector('.elements__comments');
const form = document.querySelector('.form');
const userName = form.querySelector('.form__input_user_name');
const textComment = form.querySelector('.form__input_comment');
const commentDate = form.querySelector('.form__input_date');
const formElementComment = document.querySelector('.form_comment');
const inputs = document.querySelectorAll('.form__input');
const errors = document.querySelectorAll('.form__error');
const buttonElement = document.querySelector('.button_new-comment');
const textArea = document.querySelector('#inputComment');
const config = {
  formSelector: '.form',
  inputSelector: '.form__input',
  submitButtonSelector: '.button_new-comment',
  inactiveButtonClass: 'button-disabled',
  inputErrorClass: 'input_type_error',
  errorClass: 'form__error_visible'
};

function likeComment(evt) {
  evt.target.classList.toggle('comment__like-button_active');
};

function deleteComment(evt) {
  evt.target.closest('.comment').remove();
};

function formatDate(d) {
  console.log(d);
  let dayOfMonth = d.getDate();
  let month = d.getMonth() + 1;
  let year = d.getFullYear();

  let today = new Date();
  let todayDayOfMonth = today.getDate();
  let todayMonth = today.getMonth();
  let todayYear = today.getFullYear();

  let yesterdayDayOfMonth = today.getDate() - 1;

  let hour = today.getHours();
  let minutes = today.getMinutes();

  year = year.toString().slice(-2);
  month = month < 10 ? '0' + month : month;
  dayOfMonth = dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth;
  hour = hour < 10 ? '0' + hour : hour;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  if (dayOfMonth === todayDayOfMonth && month === todayMonth & year === todayYear) {
    return `"сегодня, " ${hour}:${minutes}`;
  } else if (dayOfMonth === yesterdayDayOfMonth && month === todayMonth & year === todayYear) {
    return `"вчера, " ${hour}:${minutes}`;
  } else {
    return `${dayOfMonth}.${month}.${year} ${hour}:${minutes}`
  }
}

function createComment(item) {
  const commentElement = commentTemplate.cloneNode(true);
  const commentName = commentElement.querySelector('.comment-name');
  const commentText = commentElement.querySelector('.comment-text');
  const commentDate = commentElement.querySelector('.comment-date');
  const buttonLike = commentElement.querySelector('.comment__like-button');
  const buttonDelete = commentElement.querySelector('.comment__delete-button');
  commentName.textContent = item.name;
  commentText.textContent = item.text;
  let d = new Date(item.date);
  commentDate.textContent = formatDate(d);
  console.log(item);

  buttonLike.addEventListener('click', likeComment);
  buttonDelete.addEventListener('click', deleteComment);

  return commentElement;
};

function renderComments(item) {
  const commentElement = createComment(item);
  elementsComments.append(commentElement);
};

function render() {
  initialComments.forEach(renderComments);
  commentDate.valueAsDate = new Date();
};

render();

function handleNewCommitFormSubmit (evt) {
  evt.preventDefault();
  const item = {
    name: userName.value,
    text: textComment.value,
    date: commentDate.value
  }
  renderComments(item);
  formElementComment.reset();
  clearError(config.inputErrorClass, config.errorClass);
  commentDate.valueAsDate = new Date();
  disabledButton(buttonElement, config.inactiveButtonClass);
};

formElementComment.addEventListener('submit', handleNewCommitFormSubmit);

textArea.addEventListener('keydown', (e) => {
  console.log();
  if (e.keyCode === 13) {
    e.preventDefault();
  }
  if (e.keyCode === 13 && buttonElement.disabled === false) {
    handleNewCommitFormSubmit(e);
  }
});

const showInputError = (formElement, inputElement, errorMessage, {inputErrorClass, errorClass}) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(errorClass);
};

const hideInputError = (formElement, inputElement, {inputErrorClass, errorClass}) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(inputErrorClass);
  errorElement.classList.remove(errorClass);
  errorElement.textContent = '';
};

const checkInputValidity = (formElement, inputElement, {inputErrorClass, errorClass}) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, {inputErrorClass, errorClass});
  } else {
    hideInputError(formElement, inputElement, {inputErrorClass, errorClass});
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some(inputElement => {
    return !inputElement.validity.valid
  })
}

const toggleButtonState = (inputList, buttonElement, {inactiveButtonClass}) => {

  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(inactiveButtonClass);
    buttonElement.disabled = false;
  }
}

const setEventListeners = (formElement, {inputSelector, submitButtonSelector, inactiveButtonClass, inputErrorClass, errorClass}) => {
  const inputList = Array.from(formElement.querySelectorAll(inputSelector));
  const buttonElement = formElement.querySelector(submitButtonSelector);

  toggleButtonState(inputList, buttonElement, {inactiveButtonClass});
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', function () {
      checkInputValidity(formElement, inputElement, {inputErrorClass, errorClass});
      toggleButtonState(inputList, buttonElement, {inactiveButtonClass});
    });
  });
};

const enableValidation = ({formSelector, inputSelector, submitButtonSelector, inactiveButtonClass, inputErrorClass, errorClass}) => {
  const formList = Array.from(document.querySelectorAll(formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener('submit', function (evt) {
      evt.preventDefault();
    });

    setEventListeners(formElement, {inputSelector, submitButtonSelector, inactiveButtonClass, inputErrorClass, errorClass});
  });
};

function clearError(selector) {
  inputs.forEach((input) => {
    input.classList.remove(selector);
  });
  errors.forEach((error) => {
    error.classList.remove(selector);
    error.textContent = '';
  })
};

function disabledButton(elem, selector) {
  elem.classList.add(selector);
  elem.disabled = true;
}

enableValidation(config);
