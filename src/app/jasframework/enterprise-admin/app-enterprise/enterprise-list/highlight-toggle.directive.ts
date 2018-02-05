import { Directive, ElementRef, HostListener, Input, Renderer } from '@angular/core';

@Directive({ selector: '[jasHighlight]' })
export class HighlightToggleDirective {

  constructor(private el: ElementRef, private renderer: Renderer) { }

  @Input('jasHighlight') highlightColor: string;

  @HostListener('click') onClick() {
    this.highlight('#3498db');
  }

  private highlight(color: string) {
    // console.log(this.el)
    let sib = this.siblingElem(this.el.nativeElement);

    for (var ele of sib) {
      // console.log(ele);
      this.renderer.setElementStyle(ele, 'backgroundColor', null)
    };
    this.renderer.setElementStyle(this.el.nativeElement, 'backgroundColor', color);
  }
  private siblingElem = function (elem: any) {
    let _nodes: Array<any> = [];

    let allchildren = elem.parentNode.children;
    for (let i = 0, pl = allchildren.length; i < pl; i++) {
      if (allchildren[i] !== elem) {
        _nodes.push(allchildren[i]);
      }
    }
    return _nodes;
  }
}