/*
 * File: wr_fader.js
 *
 * Copyright (c) 2002009, Paulo Avila (apaulodesign.com)
 *
 * Project: General Widget Resource
 *
 * Description: Javascript Constructor and Methods for transitional
 *  fading of DOM elements. Makes use of the AppleAnimator class.
 *
 * Modification Log:
 *  2009.03.24	Paulo	- Initial setup of the Fader Constructor and () ()
 */


/*
 *************************************************
 * Fader object fades a single element in or out *
 *************************************************
 */
 
/*
 * Fader constructor.  Parameters:
 * - element: The element to fade in or out
 * - callback: A function that will be called when a fade is complete
 * - fadeTime: How long (in ms) the fade should take (see setFadeTime())
 */
function Fader(element, callback, fadeTime, minOpacity, maxOpacity)
{
	var minFadeTime = 100;

	this.element = element;

	this.onFinished = callback;
/*
	if (callback === null)
	{
		this.onFinished = this.fadeOut();
	}
	else
	{
		this.onFinished = callback;
	}
*/

	// Initialize for a fade-in; these values will be reset by the fadeIn/fadeOut functions
	this.fadingIn = false;
	this.now = 0.0;
	this.from = 0.0;
	this.to = 1.0;

	this.minOpacity = minOpacity ? minOpacity : 0;
	this.maxOpacity = maxOpacity ? maxOpacity : 1;

	this.fadeTime = ((fadeTime > minFadeTime) ? fadeTime : minFadeTime);

	var self = this;

	this.nextFrame = function (animation, now, first, done) {
		self.element.style.opacity = now;
	};
}

/* 
 * Prototype method declarations; call these methods as 
 * nameOfFaderInstance.methodName();
 */
Fader.prototype.fadeOut = function ()
{
	var from = this.maxOpacity;

	if (!this.fadingIn)
	{
		return;
	}

	if (this.element.style.opacity)
	{
		from = parseInt(this.element.style.opacity, 10);
	}

	this.fadeTo(from, this.minOpacity);
	this.fadingIn = false;
};

Fader.prototype.fadeIn = function ()
{
	var from = this.minOpacity;

	if (this.fadingIn)
	{
		return;
	}

	if (this.element.style.opacity)
	{
		from = parseInt(this.element.style.opacity, 10);
	}

	this.fadeTo(from, this.maxOpacity);
	this.fadingIn = true;
};

Fader.prototype.glow = function (direction)
{
	if (direction)
	{
		this.fadeOut();
	}
	else
	{
		this.fadeIn();
	}

	setTimeout(function () { this.glow(direction ? 0 : 1); }, 1000);
};

Fader.prototype.fadeTo = function (newFrom, newTo) {
	if (this.fadeAnimator) {
		this.fadeAnimator.stop();
		delete this.fadeAnimator;
	}
	
	this.fadeAnimator = new AppleAnimator(this.fadeTime, 13, newFrom, newTo, this.nextFrame);
	this.fadeAnimator.oncomplete = this.onFinished;
	this.fadeAnimator.start();
};
