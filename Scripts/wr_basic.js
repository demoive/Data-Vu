/*
 * File: wr_basic.js
 *
 * Copyright (c) 2007-2009, Paulo Avila (apaulodesign.com)
 *
 * Project: General Widget Resource
 *
 * Description: Provides the necessary functions for the basic operation of
 *  most widgets.
 *
 * Modification Log:
 *  2007.01.22	Paulo	- Initial setup with the wr_showBack() and wr_showFront() functions
 *  2007.05.29	Paulo	- Added wr_localize()
 *  2008.09.14	Paulo	- Added wr_openURL()
 *  2008.09.30	Paulo	- Modified wr_localize() to work better in Safari (when localizedStrings.js doesn't exist)
 *  2008.10.04	Paulo	- Added wr_instance() to allow preferences to be saved and retrieved with a unique identifier (for each widget instance)
 *  2008.10.05	Paulo	- Added wr_alert()
 *  2008.10.12	Paulo	- Added wr_eId() & wr_optionToggle()
 *  2008.10.19	Paulo	- Added wr_escapeCLI()
 *  2008.10.30	Paulo	- Modified wr_alert() to wr_dialog() since it now supports multiple buttons and custom handlers
 *  2008.11.08	Paulo	- Improved dialog box to accomodate different lengths of messages
 *  2009.03.20	Paulo	- Added wr_dev() & wr_debug()
 *  2009.03.22	Paulo	- Calls to setTimeout() pass anonymous functions (instead of strings)
 *  2009.03.24	Paulo	- Dialog windows now fade out (wr_fader.js)
 *  2009.04.20	Paulo	- wr_showBack() and wr_showFront() now execute a handler once the transition is complete
 */

/*
// if negative value, revert to default size
// don't know if the default width/height should be global (so as to capture initially)
function wr_resizeWindow(w, h)
{
//callee code
	window.resizeTo(window.innerWidth, originalHeight);
}
*/

/* Undocumented Widget Methods
widget.closestCity();
widget.createMenu();
widget.setPositionOffset(x,y);
widget.calculator.evaluateExpression(expression,digits);
widget.onreceiverequest
widget.ontransitioncomplete
> resizeTo
function (w, h) 
{
  widget.privateresizeTo(w, h);
}
> resizeBy
function (w, h) 
{
  widget.privateresizeBy(w, h);
}
*/


/*
 * Called when the information button (ibutton) is clicked.
 * Performs the following operations:
 *
 *  - freezes the widget (so it can be changed without the user noticing)
 *  - hides the front
 *  - shows the back
 *  - flips the widget over (animation provided by system)
 *  - runs an <endHandler> if defined
 */
function wr_showBack(endHandler)
{
	// freeze the widget and prepare to show the back
	if (window.widget)
	{
		widget.prepareForTransition("ToBack");
	}

	document.getElementById("front").style.display = "none";
	document.getElementById("back").style.display = "block";

	// flip it over
	if (window.widget)
	{
		setTimeout(function () { widget.performTransition(); }, 0);
	}

	// if an end handler is passed, run it once the flip animation is done
	if (endHandler)
	{
		setTimeout(endHandler, 750);	// flip animation lasts for 750 milliseconds
	}
}


/*
 * Called when the Done button on the back is clicked.
 * Performs the following operations:
 *
 *  - freezes the widget (so it can be changed without the user noticing)
 *  - hides the back
 *  - shows the front
 *  - flips the widget over (animation provided by system)
 *  - runs an <endHandler> if defined
 */
function wr_showFront(endHandler)
{
	// freeze the widget and prepare to show the front
	if (window.widget)
	{
		widget.prepareForTransition("ToFront");
	}

	document.getElementById("back").style.display = "none";
	document.getElementById("front").style.display = "block";

	// flip it over
	if (window.widget)
	{
		setTimeout(function () { widget.performTransition(); }, 0);
	}

	// if an end handler is passed, run it once the flip animation is done
	if (endHandler)
	{
		setTimeout(endHandler, 750);	// flip animation lasts for 750 milliseconds
	}
}


/*
 * Returns the localized equivalent of <key>.
 * If a localization doesn't exist, the function simply returns what was passed to it.
 */
function wr_localize(key)
{
	try {
		key = localizedStrings[key] || key;
	}
	catch (e) { }

	return key;
}


/*
 * Returns the unique identifier assigned by the system to the specific instance of a widget.
 * If an argument is passed (such as a <keyName>), it will be appended to the identifier before the return.
 * This identifier persists between each instantiation of the Dashboard and is a READ ONLY attribute.
 */
function wr_instance()
{
	var id = (window.widget) ? widget.identifier : "!Dashboard";

	if (arguments.length === 1)
	{
		id += "-" + arguments[0];
	}
	
	return id;
}


/*
 * Formats strings so that they can be used literally through a command line interface.
 * Replaces all occurances of a single quote (') with the escaped version ('\'') and
 * encloses the entire string with single quotes:
 *
 *   Person's File Name => 'Person'\''s File Name'
 *
 * When used with the sh shell, this ensures that everything is sanitized since
 * all characters will be interpreted with their literal value.
 */
function wr_escapeCLI(cli)
{
	if (typeof(cli) === "string")
	{
		cli = cli.replace(new RegExp("\'", "g"), "'\\''");
	}

	return "'" + cli + "'";
}


/*
 * Alerts a message in a modal dialog along with confirmation/action button(s).
 * Returns the outer most HTML element that contains the dialog.
 *
 * In it's simplest form, this function will display a dialog <message> with
 * a corresponding <title> and an "OK" button to close the modal window.
 *
 * Uses the Fader Constructor (wr_fader.js) to fade the dialog out.
 *
 * However, multiple button creation is supported (each with a custom label and handler).
 * To create and customize buttons, pass additional argument pairs where the first is a String
 * for the button label and the second is its corresponding handler function.
 * The buttons are justified right and will appear in order from right to left.
 *
 * A real-world use would be something like:
 *
 *  wr_dialog("Title", "My descriptive message.",
 *            "Yes", yesHandler,
 *            "No", noHandler);
 *
 * If <title> is null, a generic title will be used (defined in the "dialog_default_t" localization).
 * Aside from its user-defined handler, every button will also cause the modal window to close.
 * The handler of a custom button can be defined as null, in which case no additional handler is added.
 * The label of the default "OK" button can be customized by passing an optional third String argument.
 *
 * This function creates HTML elements which are added to the document dynamically.
 * These HTML elements are destroyed when the dialog message is closed.
 *
 *    +---------------------------------------------------+
 *    |div#wr_dialog                                      |
 *    |                                                   |
 *    |   +------------------------------------------+    |
 *    |   |div.title                                 |    |
 *    |   |                                          |    |
 *    |   |                                          |    |
 *    |   +------------------------------------------+    |
 *    |   +------------------------------------------+    |
 *    |   |div.message                               |    |
 *    |   |                                          |    |
 *    |   |                                          |    |
 *    |   +------------------------------------------+    |
 *    |   +------------------------------------------+    |
 *    |   |div.buttons                               |    |
 *    |   |                                          |    |
 *    |   |    +---+ +-------------+ +-------------+ |    |
 *    |   |    |...| | span.button | | span.button | |    |
 *    |   |    +---+ +-------------+ +-------------+ |    |
 *    |   +------------------------------------------+    |
 *    |                                                   |
 *    +---------------------------------------------------+
 *
 * For customization of these elements, be sure to define the following CSS styles:
 *
 *  #wr_dialog
 *  #wr_dialog div.title
 *  #wr_dialog div.message
 *  #wr_dialog div.buttons
 *  #wr_dialog div.buttons span.button > div
 *
 */
function wr_dialog(title, message)
{
//JSLint: Use the array literal notation [].
	var buttons = new Array();
	var dialogHeight = 0;
	var originalHeight = window.innerHeight;

	var modal = document.createElement("div");
	var box_top = document.createElement("div");
	var box_middle = document.createElement("div");
	var box_bottom = document.createElement("div");

	var dummyButtonObject = null;
/*
	var outFader = new Fader(modal, function () {
		window.document.body.removeChild(modal);
		window.resizeTo(window.innerWidth, originalHeight);
//"restore" the widget to allow stretching
wr_eId("middle").style.height = "auto";
wr_eId("bottom").style.top = "auto";
		}, 225);
*/
	modal.id = "wr_dialog";
	modal.appendChild(box_top);
	modal.appendChild(box_middle);
	modal.appendChild(box_bottom);

	box_top.className = "title";
	box_top.innerHTML = (title ? title : wr_localize("dialog_default_t"));

	box_middle.className = "message";
	box_middle.innerHTML = message;

	box_bottom.setAttribute("class", "buttons");

	// defines and adds a default button and handler to the arguments if none are passed
	if (arguments.length < 4)
	{
		if (arguments.length < 3)
		{
			arguments.length++;
//JSLint: Bad assignment. (both)
			arguments[2] = wr_localize("OK");
		}

		arguments.length++;
	}

	// builds each button
	for (i = 2; i < arguments.length; i = i + 2)
	{
		buttons[(i - 2)] = document.createElement("span");
		buttons[(i - 2)].className = "button";
		//buttons[(i - 2)].id = "button_" + (i - 2);
		box_bottom.appendChild(buttons[(i - 2)]);

		dummyButtonObject = new AppleGlassButton(buttons[(i - 2)], arguments[i], arguments[(i + 1)]);

		// assumption: removing the outer most element, all it's contents are also destroyed (so that no memory leaks occur)
		buttons[(i - 2)].addEventListener("click",
		                                function () {
		                                	//button_i.remove();
											//outFader.fadeOut();
//"restore" the widget to allow stretching
wr_eId("middle").style.height = "auto";
wr_eId("bottom").style.top = "auto";									
		                                	window.document.body.removeChild(modal);
											window.resizeTo(window.innerWidth, originalHeight);
										},
										false);
	}

	// if memory leaks occur (still under investigation), this modal element
	// might need to be appended to the DOM before the content is added to it.
	window.document.body.appendChild(modal);

	// if the dialog window is taller than the window, resize the window to accomodate it
	dialogHeight = box_top.clientHeight + box_middle.clientHeight + box_bottom.clientHeight;
	if (originalHeight < dialogHeight)
	{
		window.resizeTo(window.innerWidth, dialogHeight);

// don't allow the visible widget body to stretch
wr_eId("middle").style.height = "9px";
wr_eId("bottom").style.top = "102px";
	}

	return modal;
}


/*
 * Wrapper to shorten the commonly used document.getElementById() function.
 * Returns the element with an id attribute of <id>.
 */
function wr_eId(id)
{
	return document.getElementById(id);
}


/*
 * Opens an external URL followed by GET data items.
 *
 * If arguments are specified, the first must be the URL and everything
 * else will be appended as GET data items in the following format:
 * <param0>?arg1=<param1>&arg2=<param2>&arg3=<param3>...
 *
 * If no arguments are specifed, this function opens the following URL
 * along with GET data about the widget name and version extracted from the Info.plist file
 * (NEEDS THE wr_plist.js SCRIPT):
 *
 * http://www.apaulodesign.com/widgets/index.php?source=<WIDGET_IDENTIFIER>&version=<WIDGET_VERSION>
 */
function wr_openURL()
{
	var i = 0;
	var source = "";
	var version = "";
	var url = "http://www.apaulodesign.com/widgets/index.php";
//var arguments = arguments;
	if (arguments.length === 0)
	{
		source = wr_getPlistValue("CFBundleIdentifier").wr_ext();
		version = wr_getPlistValue("CFBundleVersion");

		url += "?source=" + source + "&version=" + version;
	}
	else
	{
		url = arguments[0];

		// add any GET data that was passed as arguments
		if (arguments.length > 1)
		{
			for (i = 1; i < arguments.length; i++)
			{
//				encodeURIComponent(); maybe? ... be sure to decode___() on the other side
				url += ((i === 1) ? "?arg" : "&arg") + i + "=" + encodeURI(arguments[i]);
			}
		}
	}

	if (window.widget)
	{
		widget.openURL(url);
	}
	else
	{
		window.location.href = url;
	}	

/* more arguments reference
function init() {
  // quit if this function has already been called
  if (arguments.callee.done) return;

  // flag this function so we don't do the same thing twice
  arguments.callee.done = true;

  // do stuff
};*/
}


function wr_dev(message)
{
//Would you like to help the developer figure out the problem?<br /><br />You will be able to review the information before sending it.
//	wr_dialog(wr_localize("dialog_devHiccup_t"), wr_localize("dialog_devHiccup_m"), wr_localize("Review and Send Information..."), function ());
//We ran into a hiccup that caused unexcpected results.
	wr_dialog(wr_localize("dialog_devOops_t"), wr_localize("dialog_devOops_m"), "Review Information...", function () { 	wr_debug(message); });
}

function wr_debug(message)
{
	var info = "";
	var source = "";
	var version = "";
	var url = "";

	var date = "";
	var pwd = "";
	var sw_vers = "";
	var arch = "";
	var machine = "";
	var locale = "";
	var diskutil_src = "";
	var diskutil_tar = "";

	source = wr_getPlistValue("CFBundleIdentifier").wr_ext();
	version = wr_getPlistValue("CFBundleVersion");

	try { date = widget.system("/bin/date", null).outputString; }
	catch (ex) { wr_dialog("Attempting /bin/date", ex); }

	try { pwd = widget.system("/bin/pwd", null).outputString; }
	catch (ex) { wr_dialog("Attempting /bin/pwd", ex); }

	try { sw_vers = widget.system("/usr/bin/sw_vers", null).outputString; }
	catch (ex) { wr_dialog("Attempting /usr/bin/sw_vers", ex); }

	try { arch = widget.system("/usr/bin/arch", null).outputString; }
	catch (ex) { wr_dialog("Attempting /usr/bin/arch", ex); }

	try { machine = widget.system("/usr/bin/machine", null).outputString; }
	catch (ex) { wr_dialog("Attempting /usr/bin/machine", ex); }

	try { locale = widget.system("/usr/bin/defaults read NSGlobalDomain AppleLocale", null).outputString; }
	catch (ex) { wr_dialog("Attempting /usr/bin/defaults", ex); }

	if (g_cmd.src)
	{
		try { diskutil_src = widget.system("/usr/sbin/diskutil info " + wr_escapeCLI(g_cmd.src), null).outputString; }
		catch (ex) { wr_dialog("Attempting /usr/sbin/diskutil", ex); }
	}
	else
	{
		diskutil_src = false;
	}

	if (g_cmd.tar)
	{
		try { diskutil_tar = widget.system("/usr/sbin/diskutil info " + wr_escapeCLI(g_cmd.tar), null).outputString; }
		catch (ex) { wr_dialog("Attempting /usr/sbin/diskutil", ex); }
	}
	else
	{
		diskutil_tar = false;
	}

		info = "\n" + date +
		       "\n" + message +
		       "\n" +
		       "\nWidget Information\n------------------------\n" +
		       "\nWidget:\t\t" + source +
		       "\nVersion:\t" + version +
		       "\nIdentifier:\t" + wr_instance() +
		       "\n" +
		       "\nDry Run:\t" + g_Prefs.dryRun.isChecked() +
		       "\nMirror:\t\t" + g_Prefs.mirror.isChecked() +
		       "\nExclude:\t" + g_Prefs.exclude.isChecked() +
		       "\nAuto Update:\t" + g_Prefs.autoUpdate.isChecked() +
		       "\n" +
		       "\nDirectory:\t" + pwd +
		       "\n" +
		       "\nSystem Information\n------------------------\n" +
		       "\n" + sw_vers +
		       "\nArchitecture:\t" + arch +
		       "\nMachine:\t" + machine +
		       "\n" +
		       "\nLocale:\t\t" + locale +
		       "\n" +
		       "\nSource Disk Information\n------------------------\n" +
		       "\n" + ((diskutil_src !== false) ? "Path: " + g_cmd.src + "\n\n" + diskutil_src : "Path not defined.\n\n") +
		       "\nTarget Disk Information\n------------------------\n" +
		       "\n" + ((diskutil_tar !== false) ? "Path: " + g_cmd.tar + "\n\n" + diskutil_tar : "Path not defined.\n\n");

	url = "http://www.apaulodesign.com/contact.php?source=" + encodeURI(source) + "&version=" + encodeURI(version) + "&info=" + encodeURI(info);

	if (window.widget)
	{
		widget.openURL(url);
	}
	else
	{
		window.location.href = url;
	}
}
