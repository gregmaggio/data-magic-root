import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { DeviceDetectorService } from "ngx-device-detector";
import { BaseComponent } from "../base.component";
import { ContactRequest, ContactResponse, ContactService } from "../service/contact.service";

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
  })
export class ContactComponent extends BaseComponent {
    fields:string[] = [ 'mailFrom', 'mailSubject', 'mailBody' ];
    captchaResponse!:string;
    processing:boolean = false;

    constructor(protected http: HttpClient, protected deviceService: DeviceDetectorService) {
        super(http, deviceService);
    }

    resolved(captchaResponse: string) {
        this.captchaResponse = captchaResponse;
    }

    show(id:string) {
        var element:HTMLElement = <HTMLElement>document.getElementById(id);
        if (element) {
            element.style.visibility = "visible";
            element.style.display = "block";
        }
    }
    
    hide(id:string) {
        var element:HTMLElement = <HTMLElement>document.getElementById(id);
        if (element) {
            element.style.visibility = "hidden";
            element.style.display = "none";
        }
    }

    encodeValue(text:string) {
        if (text) {
            var encodedStr:string = text.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
                return '&#'+i.charCodeAt(0)+';';
            });
            return encodedStr;
        }
        return "";
    }

    getValue(id:string) {
        var input:HTMLInputElement = <HTMLInputElement>document.getElementById(id);
        if (input) {
            var value:string = input.value;
            if (value) {
                value = value.trim();
                if (value) {
                    return this.encodeValue(value);
                }
            }
        }
        return "";
    }

    sendButtonClick(eventObj:any) {
        if (this.processing) {
            return false;
        }
        this.processing = true;
        this.setLoading(true);
        for (var ii:number = 0; ii < this.fields.length; ii++) {
            this.hide(this.fields[ii] + 'Err');
        }
        this.hide('errorsExist');
        this.hide('captchaFailed');
        this.hide('contactNotSent');
        this.hide('contactSent');
        var service:ContactService = new ContactService(this.http);
        var request:ContactRequest = {
            mailFrom: this.getValue('mailFrom'),
            mailSubject: this.getValue('mailSubject'),
            mailBody: this.getValue('mailBody'),
            recaptchaResponse: this.getValue("g-recaptcha-response")
        };
        service.send(request).subscribe(
            (response:ContactResponse) => {                
                if (response.invalidFields) {
                    var invalidFields:string[] = response.invalidFields.split(',');
                    for (var ii:number = 0; ii < invalidFields.length; ii++) {
                        this.show(invalidFields[ii] + 'Err');
                    }
                    this.show('errorsExist');
                } else if (!response.captchaValid) {
                    this.show('captchaFailed');
                } else if (!response.sent) {
                    this.show('contactNotSent');
                } else {
                    this.show('contactSent');
                }
                this.processing = false;
                this.setLoading(false);
            }
        );
        return false;
    }
}