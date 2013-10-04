/*
 * File: wr_strFormat.js
 *
 * Copyright (c) 2008-2009, Paulo Avila (apaulodesign.com)
 *
 * Project: General Widget Resource
 *
 * Description: Functions that manipulate Strings or Numbers into specially
 *  formatted Strings.
 *
 * Modification Log:
 *  2008.09.14	Paulo	- Added wr_getExtension()
 *  2008.09.24	Paulo	- Modified wr_getExtension() to be a method of the String object: wr_ext() and added trim()
 *  2008.09.25	Paulo	- Added trim() to the String object
 *  2008.12.02	Paulo	- Added wr_formatNum() & wr_formatNum()
 */


/*
 * Formats a number to the standard human-readable format.
 * Take the following arguments and return as an example:
 *
 *  (4867365.8376, 3) => "4,867,365.838"
 *
 * The <pre> value determines how many decimal places to show:
 *
 * If <pre> > than the actual number of decimals, padding with zeros occurs.
 * If <pre> == 0, no decimals are returned (number is rounded).
 * If <pre> < 0, the original decimal value is retained.
 *
 * Makes use of the toFixed() method of the Number object which requires JavaScript 1.5
 */
function wr_formatNum(num, pre)
{
	var i = 0;
	var sides = null;
	var formatted = "";
	var sep = wr_localize("num_separator");
	var dec = wr_localize("num_decimal");

	if (pre >= 0)
	{
		num = num.toFixed(pre);
	}

	// isolate the left side of the decimal place
	sides = num.toString().split('.');

	while (i < sides[0].length)
	{
		if (((sides[0].length - i) % 3) === 0 && i !== 0)
		{
			formatted += sep;
		}

		formatted += sides[0].charAt(i++);
	}

	return formatted + ((sides[1]) ? dec + sides[1] : "");
}


/*
 * This function factors and formats a number of bytes (<num>) depending
 * on its size and returns a string in a more human-recognizable format:
 *
 *  (10841057) => "10.3 MB"
 */
function wr_factorBytes(num)
{
	// 2^(10*5)
	if (num >= 1125899906842624)
	{
		return (wr_formatNum((num / 1125899906842624), 1) + " PB");
	}

	// 2^(10*4)
	if (num >= 1099511627776)
	{
		return (wr_formatNum((num / 1099511627776), 1) + " TB");
	}

	// 2^(10*3)
	if (num >= 1073741824)
	{
		return (wr_formatNum((num / 1073741824), 1) + " GB");
	}

	// 2^(10*2)
	if (num >= 1048576)
	{
		return (wr_formatNum((num / 1048576), 1) + " MB");
	}

	// 2^(10)
	if (num >= 1024)
	{
		return (wr_formatNum((num / 1024), 1) + " KB");
	}

	return (wr_formatNum(num, 0) + " " + ((num === 1) ? wr_localize("byte") : wr_localize("bytes")));
}


/*
 * Appends the wr_ext() function to the String object.
 * Returns the text after the last period ('.') contained within a <string>.
 * If the <string> does not contain a period, simply returns the original <string>.
 */
String.prototype.wr_ext = function ()
{
	for (var i = this.length - 1; i > 0; i--)
	{
		if (this.charAt(i - 1) === ".")
		{
			break;
		}
	}

	return this.substr(i, this.length - i);
};
