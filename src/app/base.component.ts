import { HttpClient } from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';
import { OnInit, HostListener, Component } from '@angular/core';

@Component({ template: '' })
export class BaseComponent implements OnInit {
    private loading: boolean = false;
    private mobile: boolean = false;
    private tablet: boolean = false;
    private desktop: boolean = false;

    constructor(protected http: HttpClient, protected deviceService: DeviceDetectorService) {
        
    }

    ngOnInit() {        
        this.mobile = this.deviceService.isMobile();
        this.tablet = this.deviceService.isTablet();
        this.desktop = this.deviceService.isDesktop();
    }

    @HostListener('window:scroll', ['$event'])
    onScroll(event:any) {
        if (this.loading) {
            var center:HTMLDivElement = <HTMLDivElement>document.querySelector(".center");
            center.style.top = (window.scrollY + window.outerHeight / 2).toString() + "px";
        }
    }

    public isLoading():boolean {
        return this.loading;
    }

    public isMobile():boolean {
        return this.mobile;
    }

    public isTablet():boolean {
        return this.tablet;
    }

    public isDesktop():boolean {
        return this.desktop;
    }

    public setLoading(newVal:boolean):void {
        this.loading = newVal;
        if (this.loading) {
            var center:HTMLDivElement = <HTMLDivElement>document.querySelector(".center");
            center.style.top = (window.scrollY + window.outerHeight / 2).toString() + "px";
            // Disable stuff
            var inputs:HTMLCollectionOf<HTMLInputElement> = document.getElementsByTagName("input");
            for (var ii = 0; ii < inputs.length; ii++) {
                inputs[ii].disabled = true;
            }
            var anchors:HTMLCollectionOf<HTMLAnchorElement> = document.getElementsByTagName("a");
            for (var ii = 0; ii < anchors.length; ii++) {
                anchors[ii].style.pointerEvents="none";
                anchors[ii].style.cursor="default";
            }
            var buttons:HTMLCollectionOf<HTMLButtonElement> = document.getElementsByTagName("button");
            for (var ii = 0; ii < buttons.length; ii++) {
                buttons[ii].disabled = true;
            }
        } else {
            // Enable stuff
            var inputs:HTMLCollectionOf<HTMLInputElement> = document.getElementsByTagName("input");
            for (var ii = 0; ii < inputs.length; ii++) {
                inputs[ii].disabled = false;
            }
            var anchors:HTMLCollectionOf<HTMLAnchorElement> = document.getElementsByTagName("a");
            for (var ii = 0; ii < anchors.length; ii++) {
                anchors[ii].style.pointerEvents="auto";
                anchors[ii].style.cursor="pointer";
            }
            var buttons:HTMLCollectionOf<HTMLButtonElement> = document.getElementsByTagName("button");
            for (var ii = 0; ii < buttons.length; ii++) {
                buttons[ii].disabled = false;
            }
        }
    }
}
