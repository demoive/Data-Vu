/*
 * File: wr_plist.js
 *
 * Copyright (c) 2007-2009, Paulo Avila (apaulodesign.com)
 *
 * Project: General Widget Resource
 *
 * Description: Provides methods to read and write widget preferences and
 *  read only access to the values of keys defined inside the Info.plist file.
 *  Also provides the Constructor for building preference Objects.
 *
 *  wr_getPref(keyName)
 *  wr_setPref(keyValue, keyName)
 *
 *  wr_getPlistValue(key)
 *
 *  wr_Preference(e, isUnique, label, tooltip)
 *   element
 *   key
 *   isChecked()
 *   setEnabled()
 *   applySavedPref()
 *   onclick()
 *   onmouseover()
 *   onmouseout()
 *
 * Modification Log:
 *  2007.09.09	Paulo	- Added wr_getPref()
 *  2008.03.03	Paulo	- Initial skeleton structure setup of wr_getPlistValue() function (not functional)
 *  2008.03.05	Paulo	- Finalized functionality of wr_getPlistValue()
 *  2008.03.15	Paulo	- Updated comments and code structure
 *  2008.09.13	Paulo	- Added wr_setPref()
 *  2008.11.10	Paulo	- Added the wr_Preference Object Constructor
 *  2008.11.13	Paulo	- Enhanced the wr_Preference Constructor to behave correctly for checkboxes and [groups of ]radio buttons
 *  2008.11.15	Paulo	- Added functionality to show a tooltip
 *  2008.11.16	Paulo	- Perfected how tooltip shows & disappears to mimic OS's functionality
 *  2008.11.18	Paulo	- Dynamically adjust window height to allow tooltip to appear outside widget's regular bottom
 *  2009.01.18	Paulo	- Added setEnabled()
 *  2009.02.15	Paulo	- Corrected catchall timeout for tooltip (was 5 sec and suppose to be 10 sec)
 *  2009.03.22	Paulo	- Calls to setTimeout() pass anonymous functions (instead of strings)
 */

//*  2008.12.10	Paulo	- Modified code to get rid of several global variables and functions

//still need to account for options (radio) correctly (use the array parameter)

//still need to resize the width of the window properly
//(if you do that, remove the margin-left property

//in the future, account for when widget is on the bottom/right to show the tooltip above/left of the mouse

//fix the refresh that happens to a tooltip when you quickly mouseout and back over the same item...
//it shouldn't really change positions if it never disappeared


var ELEMENT_NODE = 1;
var ATTRIBUTE_NODE = 2;
var TEXT_NODE = 3;
var CDATA_SECTION_NODE = 4;
var ENTITY_REFERENCE_NODE = 5;
var ENTITY_NODE = 6;
var PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE = 8;
var DOCUMENT_NODE = 9;
var DOCUMENT_TYPE_NODE = 10;
var DOCUMENT_FRAGMENT_NODE = 11;
var NOTATION_NODE = 12;

var g_tipElement = null;
var g_tipText = null;
var g_tipTimer = null;
var g_tipTimerLimit = null;

var g_winHeight = window.innerHeight;
var g_winWidth = window.innerWidth;


/*
 * asdf
 * If the element is a checkbox, it's id attribute is used as the key in the saved preferences and its value is boolean
 needs to have a <label> surrounding it
 * If the element is a radio button, it's name attribute is used as the key and it's value is the 'value' attribute
 */
function wr_Preference(e, label, tooltip, isUnique)
{
//you could create a different "wr_Preference" constructor that accepts an array of e's, labels & tooltips for the options
//try to mix and match the functions as best as possible

	var prefKey = null;
	var type = e.getAttribute("type");

	switch (type)
	{
		case "checkbox":
			prefKey = (isUnique) ? wr_instance(e.id) : e.id;
			break;
		case "radio":
//ensure 'name' attribute exists
			prefKey = (isUnique) ? wr_instance(e.getAttribute("name")) : e.getAttribute("name");
			break;
	}

/*
// the checked values of radio button behave differently if they have a <name> atttribute
if ((e.getAttribute("type") == "radio" && !e.getAttribute("name") && e.checked) ||
	(e.getAttribute("type") == "checkbox" && !e.checked))
{
	e.removeAttribute("checked");
	wr_setPref(false, prefKey);
}
else
{
	e.setAttribute("checked");
	wr_setPref(true, prefKey);
}
*/

	this.element = e;
	this.key = prefKey;

//insertAfter(new_node, existing_node)
	if (e.nextSibling)
	{
		e.parentNode.insertBefore(document.createTextNode(label), e.nextSibling);
	}
	else
	{
		e.parentNode.appendChild(document.createTextNode(label));
	}

	/*
	 * Enables/Disables a preference item.
	 */
	this.setEnabled = function (enable)
	{
		if (enable)
		{
			e.parentNode.style.color = "white";
			e.disabled = false;
		}
		else
		{
			e.parentNode.style.color = "#888888";
			e.disabled = true;
		}
	};

	/*
	 * Returns a boolean value indicating if the HTML element is 'checked.'
	 */
	this.isChecked = function ()
	{
		return e.getAttribute("checked") !== null;
	};


	/*
	 * If a preference has a saved value, a call to this function will
	 * set the checkbox (or group of radio buttons) to the correct value.
	 *
	 * Realistically only called when the widget is first loaded.
	 */
	this.applySavedPref = function ()
	{
		var value = wr_getPref(prefKey);

		switch (type)
		{
			case "checkbox":
				if (value === true)
				{
					e.setAttribute("checked");
				}
				else if (value === false)
				{
					e.removeAttribute("checked");
				}
				break;

			case "radio":
				//for all input>radio elements - if name == name && value == saved pref, set it to checked
				break;
		}
	};


	/*
	 * Controls what happens when a preference element is clicked.
	 * As of right now, only 'input' elements are supported.
	 *
	 * If input type is a checkbox, its boolean value will be toggled.
	 *
	 * If input type is a radio button, its preference value and key are determined
	 * by the contents of the 'value' and 'name' HTML elements, respectively.
	 * All radio buttons with the same 'name' attribute are grouped as one preference key.
	 *
	 * NOTE: The default behavior for a radio button (such as grouped visual toggling)
	 * is left under the Webkit's control EXCEPT when a 'value' attribute is not defined.
	 */
	if (e.tagName.toLowerCase() === "input")
	{
		e.onclick = function (event) {
			switch (type)
			{
				case "checkbox":
					if (e.checked)
					{
						e.setAttribute("checked");
						wr_setPref(true, prefKey);
					}
					else
					{
						e.removeAttribute("checked");
						wr_setPref(false, prefKey);
					}
					break;

				case "radio":
					if (e.getAttribute("value"))
					{
						e.setAttribute("checked");
						wr_setPref(e.getAttribute("value"), prefKey);
					}
					else
					{
						event.preventDefault();
					}
					break;
			}

			event.stopPropagation();
		};
	}


	/*
	 * If a tooltip for an element has been provided, show and hide it
	 * after the proper amount of time has elapsed:
	 *
	 * If the mouse remains over an element for 1.75 seconds, show its tooltip.
	 * Hide the tooltip a 1/4 second after the mouse leaves an element.
	 * The exception to hiding it is if the mouse moves to another element
	 * (that has a tooltip) within the 1/4 seconds, in which case the tooltip's
	 * content and position will be updated after .2 seconds.
	 *
	 * As a catchall, a tooltip will dissappear once 10 seconds has
	 * elapsed since the last time it was shown or updated no matter what.
	 */
	if (tooltip !== "" && tooltip !== null)
	{
		e.parentNode.onmouseover = function (event) {
			g_tipText = tooltip;

			clearTimeout(g_tipTimer);
			g_tipTimer = setTimeout(function () { wr_showTooltip((event.clientX + 7), (event.clientY + 11)); }, (g_tipElement) ? 200 : 1750);
		};

		e.parentNode.onmouseout = function () {
			clearTimeout(g_tipTimer);
			g_tipTimer = setTimeout(function () { wr_removeTooltip(); }, 250);
		};

		// only show tooltip if mouse hasn't moved for a while
		// (not very ideal since we have to track the mouse, but more accurate with the [x,y] coordinates)
		//e.parentNode.onmousemove = function (event) {
		//	if (!g_tipElement) {
		//		clearTimeout(g_tipTimer);
		//		g_tipTimer = setTimeout("wr_showTooltip('" + (event.clientX + 7) + "', '" + (event.clientY + 11) + "')", 500);
		//	}
		//};
	}
}


/*
 * Shows a tooltip with contents from <g_tipText> and positions it in
 * the correct place in the relation to the mouse.
 *
 * If <g_tipElement> already exists, simply update it's content and position
 * or else create it with the following HTML elements and dynamically add them to
 * the document. These elements will be destroyed when the dialog message disappears:
 *
 *    +-------------------------------+
 *    |div.tooltip                    |
 *    |                               |
 *    |   +----------------------+    |
 *    |   |span.bg               |    |
 *    |   |                      |    |
 *    |   +----------------------+    |
 *    |   +----------------------+    |
 *    |   |span.text             |    |
 *    |   |                      |    |
 *    |   +----------------------+    |
 *    |                               |
 *    +-------------------------------+
 *
 * The reason for the two span elements is to allow for a translucent background
 * without affecting the translucency of the text. If both <span> elements are
 * defined with a 'position' of 'absolute' they will overlap perfectly since 
 * this function fills them with the EXACT same text content. The look of these
 * elements can be defined in the following CSS styles:
 *
 *  div#wr_tooltip span
 *  div#wr_tooltip span.bg
 *  div#wr_tooltip span.text
 */
function wr_showTooltip(x, y)
{
	clearTimeout(g_tipTimerLimit);
	g_tipTimerLimit = setTimeout(function () { wr_removeTooltip(); }, 10000);

	if (!g_tipElement)
	{
		g_tipElement = document.createElement('div');
		g_tipElement.id = "wr_tooltip";
	//	g_tipElement.className = "pro";
		g_tipElement.appendChild(document.createElement('span'));
		g_tipElement.appendChild(document.createElement('span'));
		g_tipElement.childNodes[0].setAttribute("class", "bg");
		g_tipElement.childNodes[1].setAttribute("class", "text");

		window.document.body.appendChild(g_tipElement);
	}

	g_tipElement.childNodes[0].innerHTML = g_tipText;
	g_tipElement.childNodes[0].style.left = x + "px";
	g_tipElement.childNodes[0].style.top = y + "px";

	g_tipElement.childNodes[1].innerHTML = g_tipText;
	g_tipElement.childNodes[1].style.left = x + "px";
	g_tipElement.childNodes[1].style.top = y + "px";

	// if the tooltip's height plus the y coordinate of where it is being displayed
	// goes past the window's bottom, resize the window to accomodate it
	if (g_winHeight < (parseInt(y, 10) + g_tipElement.childNodes[1].clientHeight + 10))
	{
		window.resizeTo(g_winWidth, (parseInt(y, 10) + g_tipElement.childNodes[1].clientHeight + 10));
	}

	g_tipElement.onmouseover = function (event) {
		clearTimeout(g_tipTimer);
	};	

	g_tipElement.onmouseout = function (event) {
		clearTimeout(g_tipTimer);
		g_tipTimer = setTimeout(function () { wr_removeTooltip(); }, 250);
	};
}


/*
 * Removes the HTML elements that were dynamically created
 * and added to the document in the wr_showTooltip() function.
 */
function wr_removeTooltip()
{
	if (g_tipElement)
	{
		window.document.body.removeChild(g_tipElement);
		window.resizeTo(g_winWidth, g_winHeight);
		g_tipElement = null;
	}
}


/*
 * Returns a previously saved preference with key <keyName>
 * or null if the <keyName> doesn't exist.
 */
function wr_getPref(keyName)
{
	var keyValue = null;

	if (window.widget)
	{
		keyValue = widget.preferenceForKey(keyName);
	}

	return keyValue;
}


/*
 * Saves a value (<keyValue>) to a corresponding key (<keyName>).
 * Returns the <keyName> that the <keyValue> was saved under.
 */
function wr_setPref(keyValue, keyName)
{
	if (window.widget)
	{
		widget.setPreferenceForKey(keyValue, keyName);
	}

	return keyName;
}


/* 
 * Returns the value of the <key> contained in the Info.plist file
 * by the use of AJAX and XML parsing.
 *
 * If the value is an array, it will return a comma-delimeted
 * string containing all the values of the array.
 *
 * Note that the Info.plist file must exist in the same directory as
 * the HTML file that calls this function. Ideally this location is
 * the root of the widget.
 */
function wr_getPlistValue(key)
{
	var i, j;
	var keyValue = "";			// the value that will be returned

	var nodes = null;			// will contain all the nodes of the Info.plist file
	var arrayNodes = null;		// only used if the target <key> is an array of values

	var ajaxRequest = new XMLHttpRequest();

	// synchronous ajax request to get the contents of the Info.plist file
//JSLing: Unescaped '/'.
	ajaxRequest.open("GET", window.location.pathname.replace(/[^/]*$/, "Info.plist"), false);
	ajaxRequest.send(null);

	nodes = ajaxRequest.responseXML.getElementsByTagName("dict")[0].childNodes;

	// traverse the file until the requested key has been found
	for (i = 0; i < nodes.length; i++)
	{
		if (nodes[i].nodeType === ELEMENT_NODE &&
			nodes[i].tagName.toLowerCase() === "key" &&
			nodes[i].firstChild.data === key)
		{
			if (nodes[i + 2].tagName.toLowerCase() !== "array")
			{
				keyValue = nodes[i + 2].firstChild.data;
			}
			else
			{
//JSLint: Use the array literal notation [].
				keyValue = new Array();
				arrayNodes = nodes[i + 2].childNodes;

				for (j = 0; j < arrayNodes.length; j++)
				{
					if (arrayNodes[j].nodeType === ELEMENT_NODE)
					{
						keyValue.push(arrayNodes[j].firstChild.data);
					}
				}
			}

			break;
		}
	}

	return keyValue;
}
