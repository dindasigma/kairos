{
	// Helper vars and functions.
	const extend = function(a, b) {
		for( let key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	};

	// from http://www.quirksmode.org/js/events_properties.html#position
	const getMousePos = function(ev) {
		let posx = 0;
		let posy = 0;
		if (!ev) ev = window.event;
		if (ev.pageX || ev.pageY) 	{
			posx = ev.pageX;
			posy = ev.pageY;
		}
		else if (ev.clientX || ev.clientY) 	{
			posx = ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = ev.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		return { x : posx, y : posy };
	};

	const TiltObj = function(el, options) {
		this.el = el;
		this.options = extend({}, this.options);
		extend(this.options, options);
		this.DOM = {};
		this.DOM.img = this.el.querySelector('.content__img');
		this.DOM.year = this.el.querySelector('.content__year');
		this._initEvents();
	}

	TiltObj.prototype.options = {
		movement: {
			img : { translation : {x: -40, y: -40} },
			year : { translation : {x: 20, y: 20} },
		}
	};

	TiltObj.prototype._initEvents = function() {
		this.mouseenterFn = (ev) => {
			anime.remove(this.DOM.img);
			anime.remove(this.DOM.year);
		};
		
		this.mousemoveFn = (ev) => {
			requestAnimationFrame(() => this._layout(ev));
		};
		
		this.mouseleaveFn = (ev) => {
			requestAnimationFrame(() => {
				anime({
					targets: [this.DOM.img, this.DOM.year],
					duration: 1500,
					easing: 'easeOutElastic',
					elasticity: 400,
					translateX: 0,
					translateY: 0
				});
			});
		};

		this.el.addEventListener('mousemove', this.mousemoveFn);
		this.el.addEventListener('mouseleave', this.mouseleaveFn);
		this.el.addEventListener('mouseenter', this.mouseenterFn);
	};

	TiltObj.prototype._layout = function(ev) {
		// Mouse position relative to the document.
		const mousepos = getMousePos(ev);
		// Document scrolls.
		const docScrolls = {left : document.body.scrollLeft + document.documentElement.scrollLeft, top : document.body.scrollTop + document.documentElement.scrollTop};
		const bounds = this.el.getBoundingClientRect();
		// Mouse position relative to the main element (this.DOM.el).
		const relmousepos = { x : mousepos.x - bounds.left - docScrolls.left, y : mousepos.y - bounds.top - docScrolls.top };

		// Movement settings for the animatable elements.
		const t = {
			img: this.options.movement.img.translation,
			year: this.options.movement.year.translation,
		};
			
		const transforms = {
			img : {
				x: (-1*t.img.x - t.img.x)/bounds.width*relmousepos.x + t.img.x,
				y: (-1*t.img.y - t.img.y)/bounds.height*relmousepos.y + t.img.y
			},
			year : {
				x: (-1*t.year.x - t.year.x)/bounds.width*relmousepos.x + t.year.x,
				y: (-1*t.year.y - t.year.y)/bounds.height*relmousepos.y + t.year.y
			}
		};
		this.DOM.img.style.WebkitTransform = this.DOM.img.style.transform = 'translateX(' + transforms.img.x + 'px) translateY(' + transforms.img.y + 'px)';
		this.DOM.year.style.WebkitTransform = this.DOM.year.style.transform = 'translateX(' + transforms.year.x + 'px) translateY(' + transforms.year.y + 'px)';
	};

	const init = function() {
		imagesLoaded(document.body, () => {
			Array.from(document.querySelectorAll('.content--layout')).forEach(el => new TiltObj(el));
			// Remove loading class from body
			document.body.classList.remove('loading');
		});
	}

	init();
};

// START NAV
// click nav function
;(function(window) {

	'use strict';

	function init() {
		[].slice.call(document.querySelectorAll('.nav')).forEach(function(nav) {
			var navItems = [].slice.call(nav.querySelectorAll('.nav__item')),
				itemsTotal = navItems.length,
				setCurrent = function(item) {
					// return if already current
					if( item.classList.contains('nav__item--current') ) {
						return false;
					}
					// remove current
					var currentItem = nav.querySelector('.nav__item--current');
					currentItem.classList.remove('nav__item--current');
					
					// set current
					item.classList.add('nav__item--current');
				};
			
			navItems.forEach(function(item) {
				item.addEventListener('click', function() { setCurrent(item); });
			});
		});
	}

	init();

})(window);

$(document).ready(function() {
	$('.nav__item').bind('click', function(e) {
		e.preventDefault(); // prevent hard jump, the default behavior

		var target = $(this).attr("go-to"); // Set the target as variable
		// perform animated scrolling by getting top-position of target-element and set it as scroll target
		$('html, body').stop().animate({
			scrollTop: $(target).offset().top
		}, 600, function() {
			location.hash = target; //attach the hash (#jumptarget) to the pageurl
		});

		return false;
	});
});

// scroll function
$(window).scroll(function() {
	var scrollDistance = $(window).scrollTop()+150;

	// Assign active class to nav links while scolling
	$('.content-wrap').each(function(i) {
		if ($(this).position().top <= scrollDistance) {
			$('.nav button.nav__item--current').removeClass('nav__item--current');
			$('.nav button').eq(i).addClass('nav__item--current');
		}
	});
}).scroll();


