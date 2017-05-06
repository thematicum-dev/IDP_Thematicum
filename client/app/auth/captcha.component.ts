export class CaptchaComponent {
  tag_string = '';
  sitekey='6LerPh4UAAAAAL6-PPaN6-w2JX4wcJSjkQp2MAxl';

  constructor(private tag: string) {
        this.tag_string = tag;
    }

    render(){
	var tag = this.tag_string;
	var sitekey = this.sitekey;
	 if (window['grecaptcha'] == undefined){
		   window.onload =function(){
			grecaptcha.render(document.getElementById(tag),{'sitekey':sitekey});
		   }
	    }else{
		  grecaptcha.render(document.getElementById(tag),{'sitekey':sitekey});
	    }
    }
    
    reset(){
	    window['grecaptcha'].reset();
    }
}