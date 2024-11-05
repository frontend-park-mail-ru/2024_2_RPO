interface IValidationResult {
  allowed: boolean;
  validationMessage: string | undefined;
}

const EMAIL_ALLOWED_SYMBOLS = /[a-zA-Z0-9_@.-]*/;
const NICKNAME_ALLOWED_SYMBOLS = /[a-zA-Z0-9_.]*/;
const EMAIL_REGEX =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

export const validateEmail = (email: string): IValidationResult => {
  if (email === '') {
    return { allowed: false, validationMessage: undefined };
  }
  if (!EMAIL_ALLOWED_SYMBOLS.test(email)) {
    return {
      allowed: false,
      validationMessage: 'Содержит недопустимые символы',
    };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { allowed: false, validationMessage: 'Некорректный email' };
  }
  return { allowed: true, validationMessage: undefined };
};

export const validateNickname = (nickname: string): IValidationResult => {
  if (nickname === '') {
    return { allowed: false, validationMessage: undefined };
  }
  if (!NICKNAME_ALLOWED_SYMBOLS.test(nickname)) {
    return {
      allowed: false,
      validationMessage: 'Содержит недопустимые символы',
    };
  }
  if (nickname.length < 3) {
    return {
      allowed: false,
      validationMessage: 'Угодным считается только длиннее 3 символов',
    };
  }
  if (nickname.length > 20) {
    return {
      allowed: false,
      validationMessage: 'Длинноват никнейм, 20 символов - высшая длина',
    };
  }
  return { allowed: true, validationMessage: undefined };
};

export const validatePassword = (password: string): IValidationResult => {
  if (password === '') {
    return { allowed: false, validationMessage: undefined };
  }
  if (password.length < 8) {
    return {
      allowed: false,
      validationMessage: 'Пароль должен быть не меньше 8 символов',
    };
  }
  if (password.length > 50) {
    return {
      allowed: false,
      validationMessage: 'Великоват пароль! Укоротите хотя бы до 50 символов',
    };
  }
  return { allowed: true, validationMessage: undefined };
};
