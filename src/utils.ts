export const isMobile = () => {
    if ((navigator as any)?.userAgentData?.mobile) {
        return true;
    }
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const regexp =
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;
    return regexp.test(userAgent);
};

export const inject = async (
    root: HTMLElement,
    template: HTMLTemplateElement,
    promise: Promise<any> | any) => {

    const data = await promise;
    const base = template.innerHTML.toString();
    const temp: HTMLTemplateElement = document.createElement('template');
    temp.innerHTML = base.replace(/\{\{(\s*(\.|\w|\d)+\s*)\}\}/g, (string, key) => {
        return key.trim() // to support spaces
            .split('.')
            .reduce((obj, key) => obj?.[key] || '', data)
            .toString() //validate type
            .replace(/("|>|<)/g, ''); // against xss
    });

    Array.from(temp.content.querySelectorAll('[if],[not]')).forEach((element) => {
        console.log(element.getAttribute('if'));
        const flag = (element.hasAttribute('if') && !!element.getAttribute('if'))
        || (element.hasAttribute('not') && !element.getAttribute('not'));
        if(flag){
            element?.parentElement.removeChild(element);
        }
    });
    root.innerHTML = temp.innerHTML;
    root.setAttribute('class', template.getAttribute('class'));
};


export const register = (name: string, root: CustomElementConstructor) => {
    customElements.define(name, root);
};