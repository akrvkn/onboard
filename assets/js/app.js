(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{215:function(t,e,i){i(216),t.exports=i(283)},216:function(t,e,i){"use strict";i.r(e),function(t){var e=i(211);i(263),i(264),i(269),i(272),i(273),i(82),i(276),i(277),i(45),i(278),i(282);var n=t("body"),s=(t("html"),t(window));t(document).click((function(t){n.hasClass("show-filter")&&(t.target.closest(".book__wrap")||n.removeClass("show-filter"))})),s.resize((function(){n.hasClass("show-filter")&&0===t(".filter-toggle:visible").length&&n.removeClass("show-filter")})),t(".section-filter").ontouchend=function(t){t.preventDefault()},(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||t(window).width()<980)&&t("[data-simplebarmanual]").each((function(){new e.a(this)}))}.call(this,i(1))},263:function(t,e,i){"use strict";(function(t){var e=i(8),n=t(".js-hero");if(n.length>0){var s=n.find(".js-hero-bg"),a=n.find(".js-hero-content"),r=n.find(".js-hero-pagination"),o=new e.a(s,{slidesPerView:1,slidesPerGroup:1,spaceBetween:0,observeParents:!0,observer:!0,effect:"fade",autoplay:{delay:5e3},fadeEffect:{crossFade:!1}});o.on("observerUpdate",(function(){o.update()}));var l=new e.a(a,{slidesPerView:1,slidesPerGroup:1,spaceBetween:0,observeParents:!0,observer:!0,fade:!0,controller:{control:o,by:"slide"},autoplay:{delay:5e3},pagination:{el:r,clickable:!0}});l.on("observerUpdate",(function(){o.update()})),l.on("paginationUpdate",(function(){o.autoplay.stop()}))}}).call(this,i(1))},264:function(t,e,i){"use strict";(function(t){i(265),i(268);function e(e){if(!e.id)return e.text;var i=t(e.element).data("select2Icon");return t('<span class="select2-filter-row"><img src="/assets/img/'+i+'.svg" class="select2-filter-icon" /> <span class="select2-filter-text">'+e.text+"</span></span>")}t("#header-filter").select2({templateResult:e,templateSelection:e,minimumResultsForSearch:-1,dropdownParent:t("#header-filter").parent()})}).call(this,i(1))},269:function(t,e,i){"use strict";(function(t){var e=i(214),n=i.n(e),s=(i(270),i(271),i(45));window.magnificPopup=n.a,window.closeModal=function(){t.magnificPopup.close()},t.extend(!0,t.magnificPopup.defaults,{tClose:"Выход (Esc)",tLoading:"Загрузка...",gallery:{tPrev:"Назад (стрелка влево)",tNext:"Вперед (стрелка вправо)",tCounter:"%curr% of %total%"},image:{tError:'<a href="%url%">Изображение</a> не найдено.'},ajax:{tError:'<a href="%url%">Контент</a> не найден.'}});var a=t(".modals-holder");function r(e){var i=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return t.magnificPopup.open({type:"inline",items:{src:e},closeBtnInside:!1,fixedContentPos:!0,preloader:!1,removalDelay:200,closeMarkup:'<button title="%title%" class="mfp-close"><svg xmlns="http://www.w3.org/2000/svg" width="34" height="34"\n\t viewBox="0 0 34 34">\n\t<path fill="#cecece" transform="translate(-943 -121)"\n\t\t  d="M976.597 123.343L961.94 138l14.655 14.656a1.374 1.374 0 0 1-1.942 1.942L960 139.942l-14.655 14.655a1.369 1.369 0 0 1-1.942 0 1.373 1.373 0 0 1 0-1.942l14.655-14.656-14.656-14.656a1.373 1.373 0 1 1 1.943-1.942L960 136.057l14.655-14.656a1.374 1.374 0 0 1 1.943 1.942z"/>\n</svg></button>',closeOnBgClick:i,mainClass:"modal-slide-up mo_modal",focus:"input:first-child"})}t(document).on("click",".js-modal-close, .mfp-close",(function(){closeModal()})),t(".js-ajax-form").on("submit",(function(e){e.preventDefault();var i=t('input[name="username"]').val();t(this).ajaxSubmit({dataType:"json",contentType:"application/x-www-form-urlencoded",url:"https://auth.mosturflot.ru/oauth/token",data:{grant_type:"password",client_id:"mtf-test",username:i,password:t('input[name="password"]').val()},method:"post",success:function(e){Object(s.a)("mtf-user",i,{secure:!0,"max-age":3600}),r(t(".js-modal_welcome"))},error:function(t){console.log(t)}})})),t(document).on("click","[data-modal]",(function(e){e.preventDefault(),e.stopPropagation();var i=t(this).clone().data("modal"),n=a.find(".js-modal_"+i);return n.find("[data-mask]").each((function(){var e=t(this),i=e.data("mask");e.mask(i)})),r(n),!1})),window.showModal=r}).call(this,i(1))},272:function(t,e,i){"use strict";(function(t){var e=i(8);t(".js-slider").each((function(){var i,n,s=t(this),a=s.data("per-view"),r={320:{slidesPerView:1,slidesPerGroup:1,autoHeight:!0,spaceBetween:20},480:{slidesPerView:1,slidesPerGroup:1,autoHeight:!0,spaceBetween:20},640:{slidesPerView:1,slidesPerGroup:1,autoHeight:!0,spaceBetween:20},767:{slidesPerView:1,slidesPerGroup:1,spaceBetween:20,autoHeight:!0},960:{slidesPerView:a>2?2:a,slidesPerGroup:a>2?2:a,spaceBetween:30},1195:{slidesPerView:a>3?3:a,slidesPerGroup:a>3?3:a,spaceBetween:30}};(i=new e.a(s,{slidesPerView:a,slidesPerGroup:a,spaceBetween:30,speed:500,navigation:{nextEl:s.find(".js-slider-next"),prevEl:s.find(".js-slider-prev")},pagination:{el:s.find(".swiper-pagination"),type:"bullets",clickable:!0},breakpoints:r})).on("resize",(function(){clearTimeout(n),n=setTimeout((function(){i.update()}),200)}))}))}).call(this,i(1))},273:function(t,e,i){"use strict";(function(t){var e=i(28),n=i(8),s=(i(275),i(274)),a=t(".js-tabs");a.each((function(i,a){s(a);var r,o=t(a).find(".js-tabs-slider"),l=o.find(".swiper-slide"),u=!1;function c(){if(["phone","phone-big"].includes(e.a.current)){if(u)return void r.update();r=new n.a(o,{direction:"horizontal",vertical:!1,freeMode:!0,spaceBetween:20,slidesPerView:"auto",mousewheel:{forceToAxis:!0}}),u=!0}else u&&(r.destroy(!0,!0),u=!1)}function d(){l.each((function(){var e=t(this),i=e.find(".tab").outerWidth(!0);e.width(i)}))}o.css("z-index",7),t(window).on("bpChanged",c),t(window).on("resize",d),c(),d(),setTimeout(c,200)})),a.find(".btn_filter").click((function(){var e=t(this),i=t("#"+e.attr("aria-controls"));i.find(".filter-type").prop("disabled",!1),i.siblings().find(".filter-type").prop("disabled",!0)}))}).call(this,i(1))},275:function(t,e){Array.prototype.includes||Object.defineProperty(Array.prototype,"includes",{value:function(t,e){if(null==this)throw new TypeError('"this" is null or not defined');var i=Object(this),n=i.length>>>0;if(0===n)return!1;var s,a,r=0|e,o=Math.max(r>=0?r:n-Math.abs(r),0);for(;o<n;){if((s=i[o])===(a=t)||"number"==typeof s&&"number"==typeof a&&isNaN(s)&&isNaN(a))return!0;o++}return!1}})},276:function(t,e,i){"use strict";(function(t){var e=i(30),n=t(".js-main-menu-inner-trigger"),s=t(".js-main-menu-inner"),a=t(".js-menu-toggle"),r=t("html");n.click((function(i){i.preventDefault(),s.removeClass("opened"),t(this).parents(".js-main-menu-inner").addClass("opened"),Object(e.c)(t(this).parents(".js-main-menu-inner"))})),a.click((function(t){if(r.hasClass("menu-animation"))return t.preventDefault(),!1;r.hasClass("menu-visible")?(r.addClass("menu-animation"),Object(e.b)()):(r.addClass("menu-animation"),Object(e.a)())}))}).call(this,i(1))},277:function(t,e){function i(){}if(i.hasClass=function(t,e){return t.classList?t.classList.contains(e):!!t.className.match(new RegExp("(\\s|^)"+e+"(\\s|$)"))},i.addClass=function(t,e){var n=e.split(" ");t.classList?t.classList.add(n[0]):i.hasClass(t,n[0])||(t.className+=" "+n[0]),n.length>1&&i.addClass(t,n.slice(1).join(" "))},i.removeClass=function(t,e){var n=e.split(" ");if(t.classList)t.classList.remove(n[0]);else if(i.hasClass(t,n[0])){var s=new RegExp("(\\s|^)"+n[0]+"(\\s|$)");t.className=t.className.replace(s," ")}n.length>1&&i.removeClass(t,n.slice(1).join(" "))},i.toggleClass=function(t,e,n){n?i.addClass(t,e):i.removeClass(t,e)},i.setAttributes=function(t,e){for(var i in e)t.setAttribute(i,e[i])},i.getChildrenByClassName=function(t,e){t.children;for(var n=[],s=0;s<t.children.length;s++)i.hasClass(t.children[s],e)&&n.push(t.children[s]);return n},i.setHeight=function(t,e,i,n,s){var a=e-t,r=null;i.setAttribute("style","height:"+t+"px;"),window.requestAnimationFrame((function e(o){r||(r=o);var l=o-r,u=parseInt(l/n*a+t);i.setAttribute("style","height:"+u+"px;"),l<n?window.requestAnimationFrame(e):s()}))},i.scrollTo=function(t,e,i){var n=window.scrollY||document.documentElement.scrollTop,s=null;window.requestAnimationFrame((function a(r){s||(s=r);var o=r-s;o>e&&(o=e);var l=Math.easeInOutQuad(o,n,t-n,e);window.scrollTo(0,l),o<e?window.requestAnimationFrame(a):i&&i()}))},i.moveFocus=function(t){t||(t=document.getElementsByTagName("body")[0]),t.focus(),document.activeElement!==t&&(t.setAttribute("tabindex","-1"),t.focus())},i.getIndexInArray=function(t,e){return Array.prototype.indexOf.call(t,e)},i.cssSupports=function(t,e){return"CSS"in window?CSS.supports(t,e):t.replace(/-([a-z])/g,(function(t){return t[1].toUpperCase()}))in document.body.style},Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),Element.prototype.closest||(Element.prototype.closest=function(t){var e=this;if(!document.documentElement.contains(e))return null;do{if(e.matches(t))return e;e=e.parentElement||e.parentNode}while(null!==e&&1===e.nodeType);return null}),"function"!=typeof window.CustomEvent){var n=function(t,e){e=e||{bubbles:!1,cancelable:!1,detail:void 0};var i=document.createEvent("CustomEvent");return i.initCustomEvent(t,e.bubbles,e.cancelable,e.detail),i};n.prototype=window.Event.prototype,window.CustomEvent=n}Math.easeInOutQuad=function(t,e,i,n){return(t/=n/2)<1?i/2*t*t+e:-i/2*(--t*(t-2)-1)+e},function(){var t=document.getElementsByClassName("js-cd-top")[0],e=!1;function n(){var n=window.scrollY||document.documentElement.scrollTop;n>600?i.addClass(t,"cd-top--is-visible"):i.removeClass(t,"cd-top--is-visible cd-top--fade-out"),n>1200&&i.addClass(t,"cd-top--fade-out"),e=!1}t&&(window.addEventListener("scroll",(function(t){e||(e=!0,window.requestAnimationFrame?window.requestAnimationFrame(n):setTimeout(n,250))})),t.addEventListener("click",(function(t){t.preventDefault(),window.requestAnimationFrame?i.scrollTo(0,700):window.scrollTo(0,0)})))}()},278:function(t,e,i){"use strict";(function(t){i(279);t.datetimepicker.setLocale("ru"),t(".js-datetime").datetimepicker({format:"d.m.Y H:i"})}).call(this,i(1))},28:function(t,e,i){"use strict";var n=i(22),s=i.n(n),a={"(min-width: 1441px)":"desktop-wide","(max-width: 1440px)":"desktop","(max-width: 1195px)":"tablet","(max-width: 980px)":"phone-big","(max-width: 767px)":"phone"},r="",o={previous:"",current:""};function l(){for(var t in a)window.matchMedia(t).matches&&(r=a[t]);if(o.current!==r){o.previous=o.current,o.current=r;var e=new CustomEvent("bp-"+r);window.dispatchEvent(e),e=new CustomEvent("bpChanged"),window.dispatchEvent(e)}}window.addEventListener("resize",s()(l,100)),l(),e.a=o},280:function(t,e,i){var n={"./af":84,"./af.js":84,"./ar":85,"./ar-dz":86,"./ar-dz.js":86,"./ar-kw":87,"./ar-kw.js":87,"./ar-ly":88,"./ar-ly.js":88,"./ar-ma":89,"./ar-ma.js":89,"./ar-sa":90,"./ar-sa.js":90,"./ar-tn":91,"./ar-tn.js":91,"./ar.js":85,"./az":92,"./az.js":92,"./be":93,"./be.js":93,"./bg":94,"./bg.js":94,"./bm":95,"./bm.js":95,"./bn":96,"./bn.js":96,"./bo":97,"./bo.js":97,"./br":98,"./br.js":98,"./bs":99,"./bs.js":99,"./ca":100,"./ca.js":100,"./cs":101,"./cs.js":101,"./cv":102,"./cv.js":102,"./cy":103,"./cy.js":103,"./da":104,"./da.js":104,"./de":105,"./de-at":106,"./de-at.js":106,"./de-ch":107,"./de-ch.js":107,"./de.js":105,"./dv":108,"./dv.js":108,"./el":109,"./el.js":109,"./en-SG":110,"./en-SG.js":110,"./en-au":111,"./en-au.js":111,"./en-ca":112,"./en-ca.js":112,"./en-gb":113,"./en-gb.js":113,"./en-ie":114,"./en-ie.js":114,"./en-il":115,"./en-il.js":115,"./en-nz":116,"./en-nz.js":116,"./eo":117,"./eo.js":117,"./es":118,"./es-do":119,"./es-do.js":119,"./es-us":120,"./es-us.js":120,"./es.js":118,"./et":121,"./et.js":121,"./eu":122,"./eu.js":122,"./fa":123,"./fa.js":123,"./fi":124,"./fi.js":124,"./fo":125,"./fo.js":125,"./fr":126,"./fr-ca":127,"./fr-ca.js":127,"./fr-ch":128,"./fr-ch.js":128,"./fr.js":126,"./fy":129,"./fy.js":129,"./ga":130,"./ga.js":130,"./gd":131,"./gd.js":131,"./gl":132,"./gl.js":132,"./gom-latn":133,"./gom-latn.js":133,"./gu":134,"./gu.js":134,"./he":135,"./he.js":135,"./hi":136,"./hi.js":136,"./hr":137,"./hr.js":137,"./hu":138,"./hu.js":138,"./hy-am":139,"./hy-am.js":139,"./id":140,"./id.js":140,"./is":141,"./is.js":141,"./it":142,"./it-ch":143,"./it-ch.js":143,"./it.js":142,"./ja":144,"./ja.js":144,"./jv":145,"./jv.js":145,"./ka":146,"./ka.js":146,"./kk":147,"./kk.js":147,"./km":148,"./km.js":148,"./kn":149,"./kn.js":149,"./ko":150,"./ko.js":150,"./ku":151,"./ku.js":151,"./ky":152,"./ky.js":152,"./lb":153,"./lb.js":153,"./lo":154,"./lo.js":154,"./lt":155,"./lt.js":155,"./lv":156,"./lv.js":156,"./me":157,"./me.js":157,"./mi":158,"./mi.js":158,"./mk":159,"./mk.js":159,"./ml":160,"./ml.js":160,"./mn":161,"./mn.js":161,"./mr":162,"./mr.js":162,"./ms":163,"./ms-my":164,"./ms-my.js":164,"./ms.js":163,"./mt":165,"./mt.js":165,"./my":166,"./my.js":166,"./nb":167,"./nb.js":167,"./ne":168,"./ne.js":168,"./nl":169,"./nl-be":170,"./nl-be.js":170,"./nl.js":169,"./nn":171,"./nn.js":171,"./pa-in":172,"./pa-in.js":172,"./pl":173,"./pl.js":173,"./pt":174,"./pt-br":175,"./pt-br.js":175,"./pt.js":174,"./ro":176,"./ro.js":176,"./ru":177,"./ru.js":177,"./sd":178,"./sd.js":178,"./se":179,"./se.js":179,"./si":180,"./si.js":180,"./sk":181,"./sk.js":181,"./sl":182,"./sl.js":182,"./sq":183,"./sq.js":183,"./sr":184,"./sr-cyrl":185,"./sr-cyrl.js":185,"./sr.js":184,"./ss":186,"./ss.js":186,"./sv":187,"./sv.js":187,"./sw":188,"./sw.js":188,"./ta":189,"./ta.js":189,"./te":190,"./te.js":190,"./tet":191,"./tet.js":191,"./tg":192,"./tg.js":192,"./th":193,"./th.js":193,"./tl-ph":194,"./tl-ph.js":194,"./tlh":195,"./tlh.js":195,"./tr":196,"./tr.js":196,"./tzl":197,"./tzl.js":197,"./tzm":198,"./tzm-latn":199,"./tzm-latn.js":199,"./tzm.js":198,"./ug-cn":200,"./ug-cn.js":200,"./uk":201,"./uk.js":201,"./ur":202,"./ur.js":202,"./uz":203,"./uz-latn":204,"./uz-latn.js":204,"./uz.js":203,"./vi":205,"./vi.js":205,"./x-pseudo":206,"./x-pseudo.js":206,"./yo":207,"./yo.js":207,"./zh-cn":208,"./zh-cn.js":208,"./zh-hk":209,"./zh-hk.js":209,"./zh-tw":210,"./zh-tw.js":210};function s(t){var e=a(t);return i(e)}function a(t){if(!i.o(n,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return n[t]}s.keys=function(){return Object.keys(n)},s.resolve=a,t.exports=s,s.id=280},282:function(t,e,i){"use strict";(function(t,e){var n=i(8),s=i(31);t.locale("ru");window.location.hostname.split(".")[0];e.map([{slug:"obraztsov",id:"5"},{slug:"surikov",id:"14"},{slug:"krasin",id:"19"},{slug:"repin",id:"36"},{slug:"anastasia",id:"72"},{slug:"pushkin",id:"91"},{slug:"karamzin",id:"92"},{slug:"krylov",id:"139"},{slug:"esenin",id:"150"},{slug:"bulgakov",id:"198"},{slug:"rublev",id:"200"},{slug:"victoria",id:"206"},{slug:"grin",id:"207"},{slug:"rossia",id:"247"}],(function(t){t.slug})),e("#booking-btn").on("click",(function(t){console.log("5536"),window.location.href="https://booking.mosturflot.ru/rivercruises/booking/new/5536"}));var a=e("#river_tour_points").empty().html('<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>');e.when(e.getJSON("https://api.mosturflot.ru/v3/rivercruises/ships/92?include=title-image,ship-class,services,cabin-categories,staff,deckplan,on-board-name"),e.getJSON("https://api.mosturflot.ru/v3/rivercruises/ships/92/images"),e.getJSON("https://api.mosturflot.ru/v3/rivercruises/ships/92/cabin-categories?include=title-image")).done((function(i,s,r){var o,l,u;!function(t){var i=e("#river_ship_cruise_deckplan"),n=e("#river_cruise_ship_desc"),s=e("#tourloading");e("#shipname").html(t.data.attributes.name),e("#shiptitle").html(t.data.attributes.name),n.html(t.data.attributes.description);var a=[],r=[],o=[];e.each(t.included,(function(l,u){if("deckplans"===u.type?"image/svg+xml"===u.attributes.mime?(e(".ships__deckplan").html(""),s.html('<div style="width: 100%;margin: 30px 0 0 0; text-align: center"><a href="https://booking.mosturflot.ru/rivercruises/5536#deckplan-active" ><span style="display: block; margin: 30px;">План теплохода с реальной загрузкой кают</span><br><div style="width:350px;height:300px;margin: 0 auto;background-position: center; background-repeat: no-repeat; background-size: contain;background-image: url(/assets/img/mtf/ships/92/deckplan.png)"></div></a></div>')):i.html('<a href="'+u.links["image-url"]+'" target="_blank"><picture><img src="'+u.links["image-url"]+'" alt="План палуб" width="100%" /></picture></a>'):i.html('<a href="/assets/img/mtf/ships/92/deckplan.webp" target="_blank"><picture><source srcset="/assets/img/mtf/ships/92/deckplan.webp" type="image/webp"  width="100%"><img src="/assets/img/mtf/ships/92/deckplan.png" alt="План палуб"  width="100%"></picture></a>'),"staff"===u.type&&a.push(u.attributes),"ship-classes"===u.type&&n.prepend("Класс теплохода: "+u.attributes.name+"<br>"),"on-board-names"===u.type&&e.getJSON("https://api.mosturflot.ru/v3/rivercruises/on-board-names/92/images",(function(t){if(t.data){n.append('<picture><img src="'+t.data[0].links["image-url"]+'"></picture>');var e='<h3 class="section__header">Имя в истории</h3><h3>'+u.attributes.name+"</h3>"+u.attributes.description.replace(/<.*?>/g,"");n.append(e)}else{var i='<h3 class="section__header">Имя в истории</h3><h3>'+u.attributes.name+"</h3>"+u.attributes.description.replace(/<.*?>/g,"");n.append(i)}})),"services"===u.type)if("included"===u.attributes.status||"some cabins"===u.attributes.status){var c="some cabins"===u.attributes.status?"<br>(Некоторые каюты)":"";r[u.attributes["sort-order"]]='<li class="ships__item">\n<span class="ships-item__img">\n<div class="svg-'+u.id+" svg-"+u.id+'-dims" style="margin: 0 auto;"></div>\n</span>\n<span class="ships-item__desc">'+u.attributes.name+c+"</span>\n</li>"}else o[u.attributes["sort-order"]]='<li class="ships__item">\n<span class="ships-item__img">\n<div class="svg-'+u.id+" svg-"+u.id+'-dims" style="margin: 0 auto;"></div>\n</span>\n<span class="ships-item__desc">'+u.attributes.name+"</span>\n</li>";var d,p,m,f,h,g;l+1===t.included.length&&(a.sort((function(t,e){var i=t["sort-order"],n=e["sort-order"];return i<n?-1:i>n?1:0})),h=a,g=e("#river_ship_personal"),e.map(h,(function(t,i){g.append(e("<li />",{id:"staff_"+t.id,class:"ships__item"})),e.getJSON("https://api.mosturflot.ru/v3/rivercruises/staff/"+t.id+"/images",(function(i){var n="";i.data[0].links["image-url"]&&(n='<a href="#" class="ships-item">\n<span class="ships-item__img">\n<picture>\n<img src="'+i.data[0].links["image-url"]+'" alt="'+t.position+'">\n</picture>\n</span>\n<span class="tours-item__date">'+t.position+'</span>\n<span class="ships-item__title">'+t.name+"</span>\n</a>\n",e("#staff_"+t.id).append(n))}))})),d=r,p=o,m=e("#river_ship_services_included").empty(),f=e("#river_ship_services_pay").empty(),e.map(d,(function(t){m.append(t)})),e.map(p,(function(t){f.append(t)})))}))}(i[0]),o=s[0],l=e("#shipImages"),u={},e.each(o.data,(function(t,i){var s=null===i.attributes.title?"":i.attributes.title,a="",r="";s.length>0&&(r='<div class="ship-image__cabin">\n<div class="ship-image__caption"><span>&nbsp;'+s+"</span></div>\n</div>"),a+='<div class="swiper-slide"><span class="ships-item__img"><picture><img src="'+i.links["image-url"]+'" height="'+i.attributes.height+'" alt="Каюта" class="ship-gallery-img"></picture>'+r+"</span></div>",u[i.attributes["sort-order"]]=a;var c=0;t+1===o.data.length&&e.each(u,(function(t,e){c++,l.append(e),c===o.data.length&&new n.a(".swiper-ship-gallery",{autoHeight:!0,spaceBetween:20,updateOnWindowResize:!0,pagination:{el:".ship-pagination",clickable:!0,dynamicBullets:!0,dynamicMainBullets:1},navigation:{nextEl:".ship-slider-next",prevEl:".ship-slider-prev"}}).on("init",(function(){window.dispatchEvent(new Event("resize"))}))}))})),function(t){var i=e("#river_ship_cabins");if(i.length>0){var s={};e.map(t.data,(function(a,r){var o=null===a.attributes.description?"":a.attributes.description.replace(/<.*?>/g,"");s[a.attributes["sort-order"]]={catid:a.id,name:a.attributes.name,description:o},t.data.length===r+1&&(console.log(Object.keys(s).length),e.map(s,(function(t){var s,a,r,o=e("<li/>",{id:"shipcab_"+t.catid,class:"ships__cabin"});i.append(o),s=t,a="shipcab_"+t.catid,r=e("#"+a),s.hasOwnProperty("name")&&s.description.length>0&&e.getJSON("https://api.mosturflot.ru/v3/rivercruises/cabin-categories/"+s.catid+"/images",(function(t){if(t.data.length>0){var i='<div class="swiper-container cabin'+s.catid+'" style="height:260px;"><div class="swiper-wrapper">';e.map(t.data,(function(e,a){var o=null===e.attributes.title?"":e.attributes.title,l="";o.length>0&&(l='<div class="ship-image__cabin">\n<div class="ship-image__caption"><span>&nbsp;'+o+"</span></div>\n</div>"),i+='<div class="swiper-slide" style="height:260px;"><span class="ships-item__img"><picture><img src="'+e.links["image-url"]+'" alt="Каюта" style="width:100%; height: 260px;"></picture>'+l+"</span></div>",t.data.length===a+1&&(i+='</div><div class="swiper-button-next"></div><div class="swiper-button-prev"></div></div>',r.append(i+'<span class="tours-item__date" style="padding-top: 20px;">Категория: '+s.name+'</span>\n<span class="ships-item__text">'+s.description+"</span>\n</a>\n"),new n.a(".cabin"+s.catid,{autoHeight:!0,spaceBetween:20,pagination:{el:".swiper-pagination",clickable:!0},navigation:{nextEl:".swiper-button-next",prevEl:".swiper-button-prev"}}))}))}}))})))}))}}(r[0]),e.when(e.getJSON("https://api.mosturflot.ru/v3/rivercruises/tour-points?filter[tour-id]=5536&include=tour,tour.ship,excursions,title-image,tour-rates&fields[tours]=ship-id,days,start,finish,route,&fields[ships]=id,name&per-page=10000"),e.getJSON("https://api.mosturflot.ru/v3/rivercruises/tours/5536?include=tour-rates,ship-title-image,direction")).done((function(i,n){var s;e(n[0].data.attributes["route-note"]).text().replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm,"\n"),e(n[0].data.attributes["rates-note"]).text().replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm,"\n"),function(i){var n={},s="",r={};e.each(i.included,(function(o,l){if("tour-excursions"===l.type&&(n[l.id]={},n[l.id].name="Программа",n[l.id].description=l.attributes.description,!0===l.attributes["is-additional"])){var u="";e.each(l.attributes.prices,(function(t,e){u+="<strong>Цена (мин. "+e["min-group"]+" чел.) "+e.price+"руб./чел.</strong><br>"})),n[l.id].name="<br><strong>\n\nДополнительные экскурсии: </strong><br>",n[l.id].description=l.attributes.description+u+"<hr>"}if("point-images"===l.type&&(r[l.id]=l.links["image-url"]),"tours"===l.type&&(l.attributes.route,t(l.attributes.start).format("DD MMMM H:mm")+" - "+t(l.attributes.finish).format("DD MMMM H:mm"),e("#tourroute").prepend(t(l.attributes.start).format("DD MMMM H:mm")+" - "+t(l.attributes.finish).format("DD MMMM H:mm")+" (Дней: "+l.attributes.days+")<br>"+l.attributes.route),e("#tourtitle").html('<span class="tours-item__date">'+t(l.attributes.start).format("DD MMMM H:mm")+" - "+t(l.attributes.finish).format("DD MMMM H:mm")+" (Дней: "+l.attributes.days+")</span><br>"+l.attributes.route)),o+1===i.included.length){var c={};e.each(i.data,(function(o,l){var u="",d="";l.relationships.excursions.hasOwnProperty("data")&&e.each(l.relationships.excursions.data,(function(t,e){"Программа"===n[e.id].name?d+="<p>"+n[e.id].description+"</p>":u+="<p><strong>"+n[e.id].name+"\n\n</strong></p><p>"+n[e.id].description+"</p>"})),s=l.relationships["title-image"].hasOwnProperty("data")?'<img src="'+r[l.relationships["title-image"].data.id]+'" alt="'+l.attributes.name+'"/>':'<img src="/assets/img/mtf/ships/blank.jpg" alt="'+l.attributes.name+'"/>';var p=!0===t(l.attributes.arrive).isValid()?t(l.attributes.arrive).format("DD MMMM H:mm"):"",m=!0===t(l.attributes.departure).isValid()?t(l.attributes.departure).format("DD MMMM H:mm"):"",f=!0===t(l.attributes.arrive).isValid()?t(l.attributes.arrive).format("X"):t(l.attributes.date).format("X"),h=p+(""===m?m:" - "+m),g=""===h?t(l.attributes.date).format("DD MMMM"):h,v=null===l.attributes.name?" ":l.attributes.name,b="";if(l.attributes.note&&(b=l.attributes.note),d.length>0&&(d="<p><strong>Программа:</strong></p>"+d),c[f]='<li class="tours__item"><div class="tours-item"><div class="tours-item__img">\n<picture>'+s+'</picture></div>\n<div class="tours-item__content">\n<span class="tours-item__date">'+g+'</span>\n<span class="tours-item__title">'+v+'</span>\n<div class="tours-item__text"><div class="excursions">'+b+d+u+"</div></div></div></div></li>",o+1===i.data.length){a.empty();e.each(c,(function(t,e){a.append(e)}))}}))}}))}(i[0]),s=n[0].data.attributes["route-note"],e("#route-notes").html("<h3>Примечание:</h3>"+s)}))}));(new Date).toISOString().substring(0,10);var r=e("#river_ship_cruises");r.length;Object(s.b)(s.c,"Н.Новгород","Кижи")}).call(this,i(0),i(1))},283:function(t,e){},30:function(t,e,i){"use strict";(function(t){i.d(e,"a",(function(){return r})),i.d(e,"b",(function(){return o})),i.d(e,"c",(function(){return l}));var n=i(12),s=i(28),a=t("html");function r(){a.addClass("menu-visible");var t=n.a.timeline();t.add(n.a.fromTo(".js-main-menu",{opacity:0},{duration:.2,opacity:1})),t.add(n.a.fromTo(".main-menu__child-item",{opacity:0},{duration:.1,opacity:1})),t.add(n.a.fromTo(".main-menu__child-item",{x:10},{duration:.1,x:0})),t.eventCallback("onComplete",(function(){a.removeClass("menu-animation")}))}function o(){var t=n.a.timeline();t.add(n.a.fromTo(".js-main-menu",{opacity:1},{duration:.4,opacity:0})),t.eventCallback("onComplete",(function(){a.removeClass("menu-visible menu-animation")}))}function l(t){if("phone"===s.a.current){var e=t.find(".main-menu__child-item ").not(":first-child");n.a.timeline().add(TweenMax.staggerFromTo(e,.15,{opacity:0,x:8},{opacity:1,x:0},.02))}}}).call(this,i(1))},31:function(t,e,i){"use strict";i.d(e,"a",(function(){return o})),i.d(e,"c",(function(){return l})),i.d(e,"b",(function(){return r}));var n=i(18);function s(t){return function(t){if(Array.isArray(t)){for(var e=0,i=new Array(t.length);e<t.length;e++)i[e]=t[e];return i}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function a(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var i=[],n=!0,s=!1,a=void 0;try{for(var r,o=t[Symbol.iterator]();!(n=(r=o.next()).done)&&(i.push(r.value),!e||i.length!==e);n=!0);}catch(t){s=!0,a=t}finally{try{n||null==o.return||o.return()}finally{if(s)throw a}}return i}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var r=function(t,e,i){var r=function t(e,i,n,r){var o=a(e,2),l=o[0],u=o[1];return l===i?[].concat(s(n),[l]):u?u.reduce((function(e,a){return t(a,i,[].concat(s(n),[l]),e)}),r):r},o=r(t,e,[],[]),l=r(t,i,[],[]),u=Object(n.intersection)(o,l),c=u[u.length-1],d=Object(n.reverse)(Object(n.difference)(o,l)),p=Object(n.difference)(l,o);return Object(n.concat)(d,[c],p)},o=[{name:"Тверь",latitude:56.783029,longitude:35.7236053},{name:"Дубна",latitude:56.744002,longitude:37.173203},{name:"Калязин",latitude:57.240412,longitude:37.855078},{name:"Коприно",latitude:58.065349,longitude:38.324569},{name:"Ахтуба",latitude:48.2746,longitude:46.193},{name:"Великий Новгород",latitude:58.536742,longitude:31.271227},{name:"Валаам",latitude:61.366667,longitude:30.933333},{name:"Старая Ладога",latitude:59.995076,longitude:32.294347},{name:"Москва (СРВ)",latitude:55.850701,longitude:37.465197},{name:"Москва (ЮРВ)",latitude:55.850701,longitude:37.465197},{name:"Мышкин",latitude:57.784019,longitude:38.45456},{name:"Рыбинск",latitude:58.043047,longitude:38.85719},{name:"Ярославль",latitude:57.633568,longitude:39.879512},{name:"Кострома",latitude:57.771284,longitude:40.950603},{name:"Череповец",latitude:59.129209,longitude:37.907906},{name:"Горицы",latitude:59.869734,longitude:38.260342},{name:"Кижи",latitude:62.066667,longitude:35.238056},{name:"Соловецкие острова",latitude:65.1,longitude:35.683333},{name:"Петрозаводск",latitude:61.788863,longitude:34.359724},{name:"Мандроги",latitude:60.897704,longitude:33.817788},{name:"Н.Новгород",latitude:56.29274,longitude:43.926745},{name:"Нижний Новгород",latitude:56.29274,longitude:43.926745},{name:"Казань",latitude:55.824874,longitude:49.086087},{name:"Самара",latitude:53.260908,longitude:50.198077},{name:"Саратов",latitude:51.534272,longitude:46.01014},{name:"Волгоград",latitude:48.711923,longitude:44.491084},{name:"Астрахань",latitude:46.333818,longitude:48.021857},{name:"Ростов-на-Дону",latitude:47.261008,longitude:39.628},{name:"Пермь",latitude:58.001985,longitude:56.257287},{name:"Санкт-Петербург",latitude:59.90802,longitude:30.409998},{name:"Углич",latitude:57.52234,longitude:38.30391},{name:"Плёс",latitude:57.453764,longitude:41.507726},{name:"Лодейное поле",latitude:60.734267,longitude:33.555964},{name:"Вытегра",latitude:61.010869,longitude:36.434714},{name:"Чебоксары",latitude:56.104219,longitude:47.259418},{name:"Козьмодемьянск",latitude:56.332705,longitude:46.547541},{name:"Уфа",latitude:54.809866,longitude:56.093911},{name:"Повенец",latitude:62.848879,longitude:34.829407},{name:"Тольятти",latitude:53.521911,longitude:49.435092},{name:"Коломна",latitude:55.09524,longitude:38.765224},{name:"Константиново",latitude:55.487887,longitude:37.982154},{name:"Рязань",latitude:54.629148,longitude:39.734928},{name:"Болгары",latitude:54.996159,longitude:49.016942},{name:"Ялта",latitude:44.495275,longitude:34.177566},{name:"Севастополь",latitude:44.616604,longitude:33.525369},{name:"Сочи",latitude:43.585525,longitude:39.723062},{name:"Новороссийск",latitude:44.723912,longitude:37.768974},{name:"Листвянка",latitude:51.85999,longitude:104.863182},{name:"Хужир",latitude:53.19345,longitude:107.343646},{name:"Узуры",latitude:53.323701,longitude:107.741842},{name:"Огой",latitude:53.128608,longitude:106.998926}],l=["Москва (СРВ)",[["Дубна",[["Тверь"],["Калязин",[["Углич"],["Мышкин"],["Коприно",[["Горицы",[["Вытегра",[["Кижи"],["Петрозаводск"],["Повенец",[["Сосновец"],["Соловецкие острова"]]],["Мандроги",[["Лодейное поле",[["Старая Ладога",[["Великий Новгород"]]],["Валаам"],["Санкт-Петербург"]]]]]]]]],["Рыбинск",[["Тутаев"],["Ярославль"],["Кострома"],["Плёс"],["Кинешма"],["Чкаловск"],["Городец"],["Н.Новгород",[["Макарьево",[["Козьмодемьянск"],["Чебоксары"],["Казань",[["Пермь"],["Самара",[["Саратов"],["Волгоград",[["Астрахань"],["Ростов-на-Дону"]]]]]]]]],["Муром",[["Касимов"],["Рязань"],["Константиново"],["Коломна"],["Москва (ЮРВ)"]]]]]]]]]]]]]]]},45:function(t,e,i){"use strict";function n(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),i.push.apply(i,n)}return i}function s(t){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{};e%2?n(Object(i),!0).forEach((function(e){a(t,e,i[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):n(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}function a(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}function r(t,e){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};(i=s({path:"/"},i)).expires instanceof Date&&(i.expires=i.expires.toUTCString());var n=encodeURIComponent(t)+"="+encodeURIComponent(e);for(var a in i){n+="; "+a;var r=i[a];!0!==r&&(n+="="+r)}document.cookie=n}i.d(e,"a",(function(){return r}))},82:function(t,e,i){(function(t){t(document).on("click","[data-tgl]",(function(e){e.preventDefault();var i=t(this),n=t(i.data("tgl"));return!!n.length&&(n.toggleClass(i.data("tgl-class")),!1)}))}).call(this,i(1))}},[[215,1,2]]]);