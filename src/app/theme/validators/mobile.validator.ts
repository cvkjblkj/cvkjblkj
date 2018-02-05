import { FormControl } from '@angular/forms';

export class MobileValidator {

  public static validate(c: FormControl) {
    let MOBILE_REGEXP = /^1[34578]\d{9}$/;

    if (c.value == '') {
      return null;
    } else {
      return MOBILE_REGEXP.test(c.value) ? null : {
        validateMobile: {
          valid: false
        }
      };
    }

  }

}
export class QQ_Validator {
  public static validate(c: FormControl) {
    let QQ_REGEXP = /^[1-9][0-9]{4,9}$/;

    if (c.value == '') {
      return null;
    } else {
      return QQ_REGEXP.test(c.value) ? null : {
        validateQQ: {
          valid: false
        }
      }
    }
  }
}
export class WechatValidator {
  public static validate(c: FormControl) {
    let WECHAT_REGEXP = /^[a-zA-Z\d_]{5,}$/;

    if (c.value == '') {
      return null;
    } else {
      return WECHAT_REGEXP.test(c.value) ? null : {
        validateWechat: {
          valid: false
        }
      }
    }
  }
}

export class PasswordValidator {
  public static validate(c: FormControl) {
    let WECHAT_REGEXP = /^[a-zA-Z0-9]{6,16}$/;

    if (c.value == '') {
      return null;
    } else {
      return WECHAT_REGEXP.test(c.value) ? null : {
        validatepassword: {
          valid: false
        }
      }
    }
  }
}
export class UserNameValidator {
  public static validate(c: FormControl) {
    let WECHAT_REGEXP = /^(([\u4e00-\u9fa5]{2,8})|([a-zA-Z]{2,16}))$/;

    if (c.value == '') {
      return null;
    } else {
      return WECHAT_REGEXP.test(c.value) ? null : {
        validateUserName: {
          valid: false
        }
      }
    }
  }
}
