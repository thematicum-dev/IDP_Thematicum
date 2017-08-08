export class CaptchaComponent {
  tag_string = '';
  sitekey='6Lei-x0UAAAAADAAdccFPc23CIlm1tZmaO0-ICwg';
  captcha = null;

  constructor(private tag: string) {
        this.tag_string = tag;
    }

    render(){
	var tag = this.tag_string;
    var sitekey = this.sitekey;
    if (this.captcha != null){
        this.captcha.render(document.getElementById(tag),{'sitekey':sitekey});
    }
	else if (window['grecaptcha'] == undefined){
		   window.onload =function(){
            window['grecaptcha'].render(document.getElementById(tag),{'sitekey':sitekey});
		   }
	    }else if (window['grecaptcha'] != null){
            this.captcha = window['grecaptcha'];
		  window['grecaptcha'].render(document.getElementById(tag),{'sitekey':sitekey});
	    }
    }

    getResponse(): string {
        if (this.captcha != null){
            return this.captcha.getResponse();
        }else{
            this.captcha = window['grecaptcha'];
            return window['grecaptcha'].getResponse();
        }
	    
    }
    
    reset(){
        if (this.captcha != null){
            this.captcha.reset();
        }else{
            this.captcha = window['grecaptcha'];
            window['grecaptcha'].reset();
        }
    }
}