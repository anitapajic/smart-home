
export function validatePassword(password : string): boolean{
    const regexPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/;
    return regexPattern.test(password);
}
 
export function validateEmail(email : string): boolean {
    const regexPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regexPattern.test(email);
  }

export function validateNumberRE(name: string, value: string, role:string): boolean {
    if (name === role && value.length >= 1 && value.length <= 5) {
        return true
    } else {
        return false
    }
}
export function validateStringLenRE(name: string, value: string, role: string): boolean {
    if (name === role && value.length >= 2 && value.length <= 20) {
        return true
    } else {
        return false
    }
}
export function validateSelectRE(selected: string): boolean {
    if (!selected) {
        return false
    } else {
        return true
    }
}
export function validateImageRE(image: string): boolean {
    if (image === "") {
        return false
    } else {
        return true
    }
}
export function validateNameInput(name : string) : boolean {
    if(name.length>=2 && name.length <= 20){
        return true
    }else{
        return false
    }
}

export function validateACModesInput(modes : string) : boolean{
    if(modes.length === 0){
        return false;
    }
    if(modes.split(" ").length < 1){
        return false;
    }
    return true;
}