export class CaptchaComponent {
    tag_string = '';
    sitekey='6Lei-x0UAAAAADAAdccFPc23CIlm1tZmaO0-ICwg';
    captcha = null;
    widgetId = null;
    
    constructor(private tag: string) {
        this.tag_string = tag;
    }

  render() {
      var tag = this.tag_string;
      var sitekey = this.sitekey;
      if (window['grecaptcha'] == undefined) {
          var that = this;
          window.onload = function () {
                that.widgetId = window['grecaptcha'].render(document.getElementById(tag), { 'sitekey': sitekey });
          }
      }
      else if (window['grecaptcha'] != null) {
          this.widgetId = window['grecaptcha'].render(document.getElementById(tag), { 'sitekey': sitekey });
      }
  }

    getResponse(): string {
        return window['grecaptcha'].getResponse(this.widgetId);
    }
    
    reset(){
        window['grecaptcha'].reset(this.widgetId);
    }
}