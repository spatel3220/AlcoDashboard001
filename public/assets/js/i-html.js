!function(t){t.fn.ihtml=function(e){return e?(t(this).each(function(o,i){var n=!1;try{if("undefined"==typeof e.tag&&(e.tag="div"),e.tag){if("ignore"==e.tag)return this;n=t(document.createElement(e.tag)),t(i).append(n)}else n=t(i)}catch(a){return console.log("Unidentified HTML tag provided. "+a),void console.log(e)}for(var l in e)if("tag"!=l)if("object"==typeof e[l])n.ihtml(e[l]);else if("html"==l)if("function"==typeof e.html){var s=e.html(n);"object"==typeof s?n.ihtml(s):s&&n.html(s)}else n.html(e.html);else"css"==l?n.addClass(e.css):-1!=t.inArray(l,["mouseover","mouseout","mouseup","mousedown","click","change","focus","blur","keyup","keydown","submit"])?t(n).on(l,e[l]):t(n).attr(l,e[l]);if(e.el=n.get(0),e.tag&&"select"==e.tag&&n.select2){if(e.options){var r="";t.each(e.options,function(e,o){o.children?(r+='<optgroup label="'+o.text+'">',t.each(o.children,function(t,e){r+='<option value="'+e.id+'">'+e.text+"</option>"}),r+="</optgroup>"):r+="string"!=typeof o?'<option value="'+o.id+'">'+o.text+"</option>":'<option value="'+o+'">'+o+"</option>"}),n.append(r)}n.select2({minimumResultsForSearch:15}),e.selected&&n.select2("val",e.selected,!0)}return n.hasClass("date-input")&&n.datepicker&&n.datepicker({gotoCurrent:!0,minDate:0,dateFormat:"M dd, yy",constrainInput:!0}),this}),this):void 0}}(jQuery);