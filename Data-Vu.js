/*
 * File: Data-Vu.js
 *
 * Copyright (c) 2007-2009, Paulo Avila (apaulodesign.com)
 *
 * Project: Data Vu Widget
 * Author: Paulo Avila
 *
 * Description: Provides the necessary functions for the operation of the
 *  Data Vu widget (a wrapper for the rsync command line program).
 *
 * Modification Log:
 *  2007.05.22	Paulo	- Initial setup of functions for base graphics
 *  2007.05.24	Paulo	- Added logic to retrieve path information from dropped items
 *            	     	- v0.1 (no public release)
 *  2007.09.09	Paulo	- Updated appearance for icons to display properly
 *  2008.02.03	Paulo	- Properly formated path strings for visual accuracy
 *  2008.09.14	Paulo	- Added w_widgetHandlers()
 *  2008.10.05	Paulo	- Modified code to make use of the Widget Resource (wr_*) scripts
 *  2008.10.06	Paulo	- Modified functionality and appearance to accomodate new design
 *  2008.10.11	Paulo	- Path strings are now formatted for proper functionality (with escaped characters, etc.)
 *  2008.10.12	Paulo	- Added functionality for options and preferences
 *            	     	- Added basic log output functionality
 *            	     	- First output log at 23:10:46 GMT+1
 *            	     	- v0.2 (no public release)
 *  2008.10.13	Paulo	- Partially created filters to isolate pertinent information from the output log
 *  2008.10.15	Paulo	- Properly confirgured the behavior of the misleading onmouseover event in Dashboard
 *  2008.10.16	Paulo	- Characters are now enclosed in single quotes for complete robustness in path names
 *  2008.10.17	Paulo	- Added option to not copy older files (and removed option to start with Home as the source)
 *            	     	- v0.3 (no public release)
 *  2008.10.18	Paulo	- Provide warning if Source is empty, better functionality of SYNC button
 *            	     	- v0.4 (no public release)
 *  2008.10.19	Paulo	- Improved output data format
 *  2008.10.26	Paulo	- Added alert dialogs (wr_alert())
 *            	     	- Accounts for multiple files dropped, and non-directory files selected
 *            	     	- Help messages available for options on back
 *            	     	- Added option to not delete any files in Target and use the --force option
 *            	     	- v0.6 (no public release)
 *  2008.10.30	Paulo	- Adapted to the new wr_dialog() (instead of the wr_alert())
 *  2008.11.09	Paulo	- Functionality for user confirmation when src is empty AND the --delete option is selected
 *            	     	- Disabled drag & drop during a sync
 *            	     	- v0.7 (no public release)
 *  2008.11.10	Paulo	- Configured how and when to automatically check for updates
 *            	     	- "Objectized" all the preference options by use of the new wr_Preference() Object
 *  2008.11.15	Paulo	- Changed help messages to tooltips (a feature added to the wr_Preference() Object)
 *            	     	- v0.8 (no public release)
 *  2008.12.02	Paulo	- Used the filtered output log results to be shown in a modal dialog when the 'results' icon is pressed
 *  2008.12.08	Paulo	- Upgraded to rsync v3.0.4 and adjusted output results accordingly
 *            	     	- AllowFileAccessOutsideOfWidget preference no longer needed since widget includes its own copy of rsync
 *            	     	- v0.9 (no public release)
 *  2008.12.10	Paulo	- Code cleanup and got rid of several global variables and functions
 *  2008.12.11	Paulo	- Path of the command (contained within the widget) is determined dynamically
 *  2008.12.12	Paulo	- Identified some causes for exit codes: 0, 1, 3, 12, 23, 24, 25, 30, 35
 *            	     	- Clears results when new path is defined and when a sync starts
 *            	     	- v1.0b (private beta release to selected group of beta testers)
 *  2009.01.10	Paulo	- Removed the "skipOlder" preference since it has been merged with the "Mirror" preference
 *            	     	- Verified that the -u and --force options work properly together (when mirroring is disabled)
 *            	     	- Fixed the duplicate dialogs that were displayed after a sync had been performed
 *  2009.01.15	Paulo	- Stretch widget to show results instead of using a pop-up dialog
 *            	     	- v1.1b
 *  2009.01.18	Paulo	- Resolved minor display problem when filenames contain special HTML entity codes
 *            	     	- Disable preference options during a sync
 *  2009.01.31	Paulo	- Date and time of last sync is now shown
 *            	     	- // The "clear results" button now removes the source and target
 *            	     	- Fixed minor problem when multiple clicks to clearing results during transitioning from the back
 *            	     	- Clearing the results now actually removes the results (instead of just hiding them)
 *            	     	- When empty platters are clicked, notify the user that drag & drop is necessary to define paths
 *            	     	- Platter outline (during hover with a file) now uses CSS instead of an image
 *  2009.02.01	Paulo	- Output log button now available in the results to save file to Desktop
 *            	     	- Removed several global variables by "objectizing" rsync command variables
 *            	     	- Small gradient on the top of the bottom image so that it looks better when stetching
 *  2009.02.02	Paulo	- Localized timestamp when viewed in long format (in the output log)
 *            	     	- Re-formatted the output log (better timestamp and more organized data)
 *            	     	- v1.2b
 *  2009.02.03	Paulo	- Added the -x option so that rsync and du don't cross any filesystems
 *            	     	- Override the BLOCKSIZE environment variable when size of paths are acquired
 *            	     	- Widget automatically stretches to show results after a sync
 *            	     	- Changed sync button to image
 *            	     	- Result icon is now the exit status icon in the results
 *            	     	- Re-enable drag & drop / preferences / sync button only when results are cleared (instead of after a sync)
 *  2009.02.04	Paulo	- The last sync timestamp is now saved in the plist
 *            	     	- Disabled onclick of v#.# during a version check (and re-enabled it afterwards)
 *            	     	- Result summary indicates if the --delete option was disabled
 *            	     	- Results now disappear and clear after the widget finished the collapse animation
 *            	     	- Data Vu name no longer has accute and grave accents due to trademark application
 *  2009.02.05	Paulo	- Spinner animation during a syncronization
 *  2009.02.06	Paulo	- Animations stop/resume when the Dashboard is exited/shown
 *            	     	- Proper grammer (plurals) in result summary
 *            	     	- Tested all combinations of permissions on both src and tar (rwx, r--, rw-, r-x, -wx, -w-, --x, ---)
 *  2009.02.07	Paulo	- Fixed the incorrect display of the file name when it contained the following string "'\''"
 *            	     	- Added .Trashes/ and .Spotlight-V100/ to the list of file exclusions
 *            	     	- Actual Hard Drive name is now acquired if the root directory is the path
 *            	     	- Added warning dialog whenever the --deletion option is enabled
 *            	     	- v1.3b
 *  2009.02.10	Paulo	- Validation of correct permissions before a sync
 *            	     	- Sync button disabled earlier in the w_doSync() (and re-enabled in each validation)
 *            	     	- Identified some causes for exit codes: 2, 13, 20
 *  2009.02.11	Paulo	- Error checking for all widget.system() calls
 *            	     	- Validation of enough free disk space before doing a sync when --delete is ON
 *  2009.03.20	Paulo	- Make use of wr_dev() for widget.system() calls and unsure exit codes (including unknowns: 4, 5, 6, 10, 11, 21, 22)
 *            	     	- //Added code to restrict src to be inside user's Home directory and no more than 1GB
 *  2009.03.21	Paulo	- Exit/Result status icon is now the button to shows log view/save options
 *  2009.03.22	Paulo	- Calls to setTimeout() pass anonymous functions (instead of strings)
 *  2009.03.23	Paulo	- Result exit statuses have proper titles
 *  2009.03.30	Paulo	- Reset/Clear Log button does not use generic AppleGlassButton class
 *  2009.03.31	Paulo	- Last sync timestamp no longer erased during widget load (erased only when new files are dropped onto platters)
 *            	     	- Passed all code through JSLint in order to be minified & obfuscated
 *            	     	- v1.4b
 *  2009.04.20	Paulo	- The wr_showBack() and wr_showFront() now execute a handler once the transition is complete

 *  2009.03.24	Paulo	- Dialog windows now fade out (by use of the wr_fader.js construct)
 *            	     	- Result status button glows to indicate it can be clicked

 *            	     	- version check
 *            	     	- Recompiled rsync 3.0.4 to be a Universal Binary (via gcc with -arch followed by ld/lipo)
 *
 *
 * Pending Visual Modifications:
 *	+ Animate dialog (up and fade out / down and fade in)
 *	+ moved dry run option to the front / when in dry run mode, very obvious now indicated
 *  - long dialogs cause widget to be stretched (maybe during a dialog, have bottom's position be absolute)
 *  - remove src or tar feature (by hovering on the icon, a X appears in front of it?)
 *	- ... poof animation when src/tar gets removed?
 *  - "swap source and target" button?
 *	+ add tooltips for all items
 *  - perhaps have -vv be a future feature (show what happened with each file)?
 *  - suggest that dry run be used when the "delete" option is checked
 *  - cache dialog images
 *  - ... or at least provide lots of warning or suggestions to read the documentation.
 *  + send screenshots of all dialogs to Pete/Dad for better wording (along with snippet of Apple Design Guidlines for dialogs)
 *
 * Pending Functional Modifications:
 *	+ Properly handles aliases (and soft links) (K -k and symbolic links, hard links, aliases etc.)
 *  + update when updates are checked for and how the returned result is handled
 *  + recompile rsync to able to work on PowerPC's and Tiger
 *  - support copy and paste of paths (onpaste, ask if it should be src or tar)
 *	- double click on src or tar opens it in the finder
 *	- Support for Finder Aliases (code hints already commented in source code)
 *  - animation resizeTo function goes to becomes a Widget Resource and substite it's calls to w_expand(), w_collapse(), [w_rectAnimationHandler()]
 *  - include duration in the log
 *	- +%A, %d de %B de %C%y, %H:%M:%S GMT%z
 *  - allow target directory to go missing since rsync will create it (but a warning should be displayed)
 *  - see how to run everything with sudo (make sure the output is the same minus the Password: / Incorrect Password, etc)
 *  - use the sudo when ever the src is outside the user's Home  - maybe use the -r of du/df to ask the user that he'll prob. need root priv.
 *	- make sure it handles fifos/sockets in the way that it should
 *	- Can cancel a sync during execution by clicking the spinner (with confirmation dialog)
 *
 * Future Ideas:
 *	- "Evaluative Mode" to detect the most recent changes between files and update the older copy
 *
 *
 *  - LITE VERSION LIMITATIONS:
 *     - up to 1GB
 *     - limited to home directory?
 *     - always mirror
 *     - always do a version check
 *     - given the option to not debug information
 *
 *
 *  - PRO VERSION FEATURES:
 *     - files outside ~/ (src/tar)
 *     - bootable clones
 *     - incremental backups
 *     - disk images (restore & create)
 *     - actual file icons
 *     - option to auto version check
 *     - progress indicator / duration
 *     - detailed output log (hover over to see full path)
 *     - user-definable log location
 *     - scheduling
 *     - ?? can choose to not delete files ??
 *
 */


/*global g_syncButton, g_resetButton, g_statusButton, g_spinner, g_cmd, g_Prefs*/
/*global w_init, w_setSrc, w_setTar, w_toBack, w_toFront, w_dragEnter, w_dragOver, w_dragLeave, w_dragDrop, w_getFileName, w_doSync, w_cancelSync, w_syncDone, w_formatTimestamp, w_parseSummary, w_saveLog, w_clearResults, wr_resizeTo, w_shiftSpinner, w_vQueryResponse, w_loadSavedPrefs, w_registerHandlers, w_widgetHandlers*/

/*global wr_showBack, wr_showFront, wr_localize, wr_instance, wr_escapeCLI, wr_dialog, wr_eId, wr_openURL, wr_dev, wr_debug*/

/*global g_tipElement, g_tipText, g_tipTimer, g_tipTimerLimit, g_winHeight, g_winWidth*/
/*global wr_Preference, wr_showTooltip, wr_removeTooltip, wr_getPref, wr_setPref, wr_getPlistValue*/

/*global wr_formatNum, wr_factorBytes*/
/*global wr_vQuery*/



//window.setInterval("pa.animate()", 1000 / frameRate);
//widget.setCloseBoxOffset(10,14);

//var g_inDashboard = window.widget ? true : false;

var g_syncButton = null;	// sync button Object
var g_resetButton = null;	// button Object that clears the results
var g_statusButton = null;	// button Object that shows exit status and log info
var g_spinner = null;		// timer id used to animate spinner

//maybe include the syncButton & logButton too?
//g_sync = sys, 
var g_cmd = { rsync : null,			// widget.system object - object returned when the command is run
              str : null,			// String - the command string (with all the arguments)
              src : null,			// String - full path of the source
              tar : null,			// String - full path of the target
              timestamp : null,		// String - timestamp of when the sync finished [+%C%y%m%d%H%M%S]
              isRunning : null };	// Boolean - during a sync, false all other times
			  	

var g_Prefs = { dryRun : null,
                mirror : null,
                exclude : null, 
                autoUpdate : null };

/*
 * Initializes global objects, registers the widget handlers and
 * ... as well as any saved preferences.
 */
function w_init()
{
	w_registerHandlers();
	w_loadSavedPrefs();

	wr_vQuery(function () { wr_eId("version").onclick = null; wr_eId("version").innerHTML = "checking..."; },
	          function () { wr_eId("version").innerHTML = "v" + wr_getPlistValue("CFBundleVersion"); },
	          w_vQueryResponse);

/*
 *
 * When checking for new versions, follow the Apple OS X Design Guide:
 * Only perform the version query once a week and after a one minute delay (conserve resources during launch).
 * If an update is available, set a flag in the preferences and don't alert the user yet, else save the current date.
 * If the flag indicating an update exists has been set, inform the user immediately
 * and give him an option to be reminded later (reset the date) or to go get the update.
 */
/*
	var today = null;

var K_UPDATE_CHECK = "vUpdateCheck";
var K_LAST_V_CHECK = "vLastQuery";		// date of last query
var asdf = "vReminder";					// date the next time user should be reminded

	var updateChecker = wr_getPref(K_UPDATE_CHECK);
//20081225
//20081226
//Christmas = new Date("December 25, 2005");
//days = Math.round(difference/(1000*60*60*24));
//http://www.aspnetcenter.com/cliktoprogram/javascript/date.asp
//http://www.w3schools.com/jsref/jsref_getTime.asp

	if (g_Prefs.autoUpdate.isChecked())
	{
		today = new Date();

		if (updateChecker == "available" or REMINDER)
		{
			//vReminder
			wr_dialog("New Version Available", "There is a new version available and you should go get it!",
					  "Go get it", function () { wr_openURL(); },
					  "Remind Me Later", nullreset date);
					  //wr_setPref(__current-date__, K_UPDATE_CHECK);
					  //shouldn't just simply reset the date cause we don't want to check for it again in a week, but rather just remind the user in the week
		}
		else
		{
			w_vAutoQuery();

			if ((updateChecker - __current-date__) >= 7)
	//		setTimeout("wr_vQuery(w_vQueryStart, w_vQueryStop, w_vQueryResponse)", 5000);
	//		setTimeout("w_vQuery()", 60000);
		}
	}
//wr_setPref(g_cmd.src, wr_instance("sourcePath"));
*/
}


/*
 * Loads the <newSrcPath> String as the path for the source file of the widget.
 */
function w_setSrc(newSrcPath)
{
	if (typeof(newSrcPath) === "string")
	{
		// set the global variable for the source path
		g_cmd.src = newSrcPath;

		// display the file icon and name (formatted properly)
		wr_eId("srcPlatterName").style.display = "none";
		wr_eId("srcFileIcon").src = "Images/icon_folder.png";
		wr_eId("srcFileName").innerText = w_getFileName(g_cmd.src);

		// if a target file has been defined also, enable the sync button
		if (typeof(g_cmd.tar) === "string")
		{
			g_syncButton.setEnabled(true);
		}
	}
	else
	{
		g_cmd.src = null;
	}
}


/*
 * Loads the <newTarPath> String as the path for the target file of the widget.
 */
function w_setTar(newTarPath) 
{
	if (typeof(newTarPath) === "string")
	{
		// set the global variable for the target path
		g_cmd.tar = newTarPath;

		// display the file icon and name (formatted properly)
		wr_eId("tarPlatterName").style.display = "none";
		wr_eId("tarFileIcon").src = "Images/icon_redlof.png";
		wr_eId("tarFileName").innerText = w_getFileName(g_cmd.tar);

		// if a source file has been defined also, enable the sync button
		if (typeof(g_cmd.src) === "string")
		{
			g_syncButton.setEnabled(true);
		}
	}
	else
	{
		g_cmd.tar = null;
	}
}


/*
 * Stretches the widget to the same dimensions as that of
 * the back preferences and proceeds to transition to the back.
 */
function w_toBack()
{
	// if there are results
	if (g_resetButton.enabled)
	{
//maybe dynamically get the width/height of the back image? if it's smaller than currnet size
		wr_resizeTo(302, 128, wr_showBack);
	}
	else
	{
		wr_showBack();
	}
}


/*
 * Transitions the widget to the front and if there are results
 * available for display, stretches the widget to expose them.
 */
function w_toFront()
{
	wr_showFront(function () { if (g_resetButton.enabled) { wr_resizeTo(302, 222, null); } });

	// if there are results
//	if (g_resetButton.enabled)
//	{
//		setTimeout(function () { wr_resizeTo(302, 222, null); }, 750);	// 750 milliseconds is how long it takes for the flip animation to occur
//	}
}


/*
 * Called when the mouse (while dragging something) enters the boundary area.
 * Changes the appearance of the drop zone to signify that it's ready to receive file.
 */
function w_dragEnter(event, element)
{
	element.style.borderColor = "#848588";

	event.stopPropagation();
	event.preventDefault();
}


/*
 * Called continuously while the mouse is over the element.
 */
function w_dragOver(event)
{
	//event.dataTransfer.dropEffect = "copy";

	event.stopPropagation();
	event.preventDefault();
}


/*
 * Called when the mouse (while dragging something) leaves the boundary area.
 * Restores the appearance of the drop zone to its idle state.
 */
function w_dragLeave(event, element)
{
	element.style.borderColor = "transparent";

	event.stopPropagation();
	event.preventDefault();
}


/*
 * Called when the mouse is released (while dragging something) on the boundary area.
 *
 * Dropped items are captured as a string in the following format (1 item per line):
 *   file://localhost/Users/1st%20%22File%22.txt
 *   file://localhost/Users/2nd%20File.txt
 *   file://localhost/Users/Directory/
 *
 * So the paths of the items need to be split into an array and converted to the following format:
 *   [0] = /Users/1st "File".txt
 *   [1] = /Users/2nd File.txt
 *   [2] = /Users/Directory/
 *
 * Handles the following verifications:
 *   - Only 1 file allowed
 *   - Only directories allowed
 *   - //Aliases/softlinks are followed
 *   - Must be an actual file dragged from the Finder (not a text string of the path)
 */
function w_dragDrop(event, element)
{
	var uri; 
	var path;
	var paths;

	element.style.borderColor = "transparent";

	try
	{
		uri = event.dataTransfer.getData("text/uri-list");

		paths = uri.split("\n");

		// more than one file was dropped
		if (paths.length > 1)
		{
			wr_dialog(wr_localize("dialog_multipleItems_t"), wr_localize("dialog_multipleItems_m"));
			return;
		}

		// properly decode and escape necessary characters
		path = decodeURIComponent(paths[0].substring("file://localhost".length));

//if alias OR SoftLink, add the little arrow to the icon

// if alias then
// osascript -e 'tell application "Finder"' -e 'set theItem to (POSIX file "/Users/Paulo/Desktop/aliasTo8:word") as alias' -e 'if the kind of theItem is "alias" then' -e 'get the posix path of (original item of theItem as text)' -e 'end if' -e 'end tell'
// /Users/Paulo/Desktop/2008/

//OR

// if you already know that it is an Alias (by: GetFileInfo -aa aliasTo8 [returns 1][0 if not][and >1 on error]
// then you can just do this (you'll need to wr_escapeCLI the path and remove the first and last characters):
// osascript -e 'tell application "Finder"' -e 'set theItem to (POSIX file "/Users/Paulo/Desktop/Awesome'\''s") as alias' -e 'get the posix path of (original item of theItem as text)' -e 'end tell'

		// not a directory
		if (path.charAt(path.length - 1) !== '/')
		{
			wr_dialog(wr_localize("dialog_invalidFileType_t"), wr_localize("dialog_invalidFileType_m"));
			return;
		}

		// always ensure that the deepest DIRECTORY of the path is chosen (even if a file is dropped)
		path = path.substring(0, path.lastIndexOf("/")) + "/";

		if (element.id === "srcPlatter")
		{
			w_setSrc(path);
			wr_setPref(path, wr_instance("sourcePath"));
		}

		if (element.id === "tarPlatter")
		{
			w_setTar(path);
			wr_setPref(path, wr_instance("targetPath"));
		}

		wr_setPref(null, wr_instance("lastSync"));
		wr_eId("info").innerHTML = "";
	}
	catch (ex)
	{
		wr_dialog(wr_localize("dialog_invalidFileType_t"), wr_localize("dialog_invalidFileType_m"));
	}

	event.stopPropagation();
	event.preventDefault();
}


/*
 * Parses a <fullPath> String in order to isolate just the filename.
 * If <fullPath> is "/", get the current name of the Hard Drive.
 *
 * Due to OS X's HFS+ file structure that uses colons instead of
 * forwards slashes to delimit directories, we replace any color (':')
 * with a forwardslash ('/') to match the filename shown in the Finder.
 */
function w_getFileName(fullPath)
{
	var offset = 0;
	var rootDrives = null;
	var filename = "";
	var hd = null;
	var directories = null;

	// special case where the Hard Drive name needs to be acquired
	if (fullPath === "/")
	{
		if (window.widget)
		{
			// get's the name of the soft link that points to the root: /Volumes/<HD Name> -> /
			hd = widget.system("/usr/bin/stat -f %N%SY /Volumes/* | grep -E ' -> /$' | sed -E 's/^\\/Volumes\\/(.+) -> \\/$/\\1/g'", null);

			if (hd.status > 0 || typeof(hd.outputString) === "undefined")
			{
				wr_dev("Unable to get Hard Drive name.\n\nstatus: " + hd.status + "\nstdout: " + hd.outputString + "\nstderr: " + hd.errorString);
			}
			else
			{
				rootDrives = hd.outputString.split("\n");
				//filename = hd.outputString.split("\n", 1)[0];
				//osascript -e '"/" as POSIX file' | sed -E 's/:$//'
				//osascript -e 'tell app "Finder" to get name of startup disk'

//stat -f %N%SY /Volumes/* | awk '$3 == "/" { sub(".*/","",$1); print $1 }'
//system_profiler SPSoftwareDataType | sed -n 's/.*Volume: //p'
//ls -F /Volumes | sed -n 's/@$//p'



				// if the multiple soft links to the root exist...
				if (rootDrives.length > 2)
				{
					wr_dev("Multiple \"Hard Drive's\" names encountered (" + rootDrives + ")\n");
				}

				// choose the first name
				filename = rootDrives[0];
			}
		}
		else
		{
			filename = "Non-Widget HD";
		}
	}
	else
	{
		directories = fullPath.split("/");

		// choose the final file, regardless of whether it is a directory or file
		offset = (fullPath[fullPath.length - 1] === '/') ? 2 : 1;
		//offset = 2;	// ensures the deepest directory is chosen (even if a file is dropped)
		filename = directories[directories.length - offset];
	}

	// replaces colons with a forward slash
	filename = filename.replace(/\:/g, "/");

	return filename;
}


/*
 * Executes the rsync command after checking several necessary preconditions:
 *  - If the --delete option is enabled, provide a confirmation dialog.
 *  - If the src is empty and the --delete option is enabled, provide a confirmation dialog.
 *  - Verifies that the source and target still exist on the system.
 *  - Sets the proper visuals indicating that it is being run.
 *
 * Once the command is initiated, it is controlled by the <g_cmd.rsync> global object and
 *  - The command is run asychronously.
 *  - Sync button is disabled.
 *  - Drag & Drop is disabled.
 *  - Preferences in the back are disabled.
 *
 * The only time the boolean argument <deletionsConfirmed> should be passed as true
 * is when this function is called from the confirmation dialog that deletions will occur.
 */
function w_doSync(deletionsConfirmed)
{
	var srcTest = 0;
	var tarTest = 0;

	var widgetPath = "~/Library/Widgets/Data\\ Vu.wdgt/";		//window.location.pathname.replace(/ /g, "\\ ").replace(/[^/]*$/, "");
	var command = "rsync-3.0.4 -avAXx --stats";

	g_syncButton.setEnabled(false);

	if (g_Prefs.dryRun.isChecked()) { command += " -n"; }

//consider making -u a permanent option (that is how you have it worded online)
	if (g_Prefs.mirror.isChecked()) { command += " --delete --delete-during --delete-excluded"; }
	else                            { command += " -u --force"; }

	//._name, .DS_Store, .Trash/, .Trashes/, .Spotlight-V100/
	if (g_Prefs.exclude.isChecked()) { command += " --exclude=.Trash --exclude=.Trashes --exclude=.Spotlight-V100"; }

	g_cmd.str = command;

	if (g_cmd.src && g_cmd.tar)
	{
		command += " " + wr_escapeCLI(g_cmd.src) + " " + wr_escapeCLI(g_cmd.tar);

		if (window.widget)
		{
//need to do wr_dev on these
			// VALIDATION 1: source and target still exist as directories on the system
			srcTest = widget.system("/bin/test -d " + wr_escapeCLI(g_cmd.src), null).status;
			tarTest = widget.system("/bin/test -d " + wr_escapeCLI(g_cmd.tar), null).status;

			// if either file doesn't exist or isn't a directory, set proper icon and escape
			wr_eId("srcFileIcon").src = (srcTest) ? "Images/icon_missing.png" : "Images/icon_folder.png";
			wr_eId("tarFileIcon").src = (tarTest) ? "Images/icon_gnissim.png" : "Images/icon_redlof.png";
			if (srcTest || tarTest) { g_syncButton.setEnabled(true); return; }

			// VALIDATION 2: permission are correct (src & tar need r-x)
			// in reality, tar only needs --x to transfer all the files but exits with 13 & 23
			// since it can't originally read the tar folder
			// after a sync its permissions change to rwxr-xr-x anyway
			// so might as well have the user ensure the permission are correct from the get-go
			srcTest = (widget.system("/bin/test -r " + wr_escapeCLI(g_cmd.src), null).status ||
			           widget.system("/bin/test -x " + wr_escapeCLI(g_cmd.src), null).status);
			tarTest = (widget.system("/bin/test -r " + wr_escapeCLI(g_cmd.tar), null).status ||
			           widget.system("/bin/test -x " + wr_escapeCLI(g_cmd.tar), null).status);

//consider an individual message for each folder
			if (srcTest || tarTest)
			{
				wr_dialog(wr_localize("dialog_permissions_t"), wr_localize("dialog_permissions_m"));
				g_syncButton.setEnabled(true);
				return;
			}

//-- LITE VERSION LIMITATION ------------------------------------
			// at least one of the directories needs to be in the user's home directory
			// and the other one would need to be an external drive
			var homePath = widget.system("/bin/echo -n $HOME", null).outputString + "/";
			var voluPath = "/Volumes/";

			if ((g_cmd.src.substr(0, homePath.length) === homePath && g_cmd.tar.substr(0, homePath.length) === homePath) ||
			    (g_cmd.src.substr(0, homePath.length) === homePath && g_cmd.tar.substr(0, voluPath.length) === voluPath) ||
				(g_cmd.src.substr(0, voluPath.length) === voluPath && g_cmd.tar.substr(0, homePath.length) === homePath))
			{
				// satisfies limitation
			}
			else
			{
				wr_dialog(wr_localize("dialog_pathNotInHome_t"), wr_localize("dialog_pathNotInHome_m"));
				return;
			}
			//if src is greater than 1 GB, don't allow sync (need to multiple by 1024 cause -k option returns size in KB
/*
			if ((1024 * (widget.system("/usr/bin/du -Hcksx " + wr_escapeCLI(g_cmd.src) + " | tail -n 1 | sed -E 's/[^0-9]//g'", null).outputString.split("\n", 1)[0])) > 1073741824)
			{
				wr_dialog(wr_localize("dialog_srcTooLarge_t"), wr_localize("dialog_srcTooLarge_m"));
				return;
			}
*/
//---------------------------------------------------------------

/* currently not using this validation because it is innacurate when --delete is turned off !!!

//	var srcSize = null;
//	var tarSize = null;
//	var srcDiskTotal = null;
//	var tarDiskRemaining = null;

			// VALIDATION 3: enough disk space available (in KB)
			srcSize = widget.system("/usr/bin/du -Hskcx " + (g_Prefs.exclude.isChecked() ?
			                                                 "-I .Trash -I .Trashes -I .Spotlight-V100 " : "") +
				                    wr_escapeCLI(g_cmd.src) +
									" | tail -n 1 | sed -E 's/^([0-9]+)[[:space:]]total$/\\1/'", null).outputString;

			tarSize = widget.system("/usr/bin/du -Hskcx " + (g_Prefs.exclude.isChecked() ?
			                                                 "-I .Trash -I .Trashes -I .Spotlight-V100 " : "") +
				                    wr_escapeCLI(g_cmd.tar) +
									" | tail -n 1 | sed -E 's/^([0-9]+)[[:space:]]total$/\\1/'", null).outputString;

			tarDiskRemaining = widget.system("/bin/df -k " +
			                                 wr_escapeCLI(g_cmd.tar) +
			                                 " | tail -n 1 | sed -E 's/^[^\\n]+[ \\t]+[0-9]+[ \\t]+[0-9]+[ \\t]+([0-9]+)[ \\t]+[^\\n]+$/\\1/'", null).outputString;

			//status isn't 0, very likely that sudo will need to be used (both for 'du' and 'rsync')
		//	to do this, you need to do the du operations separately so that you can have a valid status
		//	if (srcSize.status || tarSize.status)
		//	{
		//		alert("maybe use sudo since...");
		//	}

			// verify that only digits were extracted and turn them into Integers
			if (/^\d+\n?$/.test(srcSize) &&
			    /^\d+\n?$/.test(tarSize) &&
				/^\d+\n?$/.test(tarDiskRemaining))
			{
				srcSize = parseInt(srcSize);
				tarSize = parseInt(tarSize);
				tarDiskRemaining = parseInt(tarDiskRemaining);

alert("srcSize= "+srcSize);
alert("tarSize= "+tarSize);
alert("tarDiskRemaining= "+tarDiskRemaining);

alert("Total remaining= " + (tarDiskRemaining + tarSize));
alert((tarDiskRemaining + tarSize) < srcSize );

//(if tarAvailable+tarSize > diskTotal, then the calculcation is wrong)
//				<= ?
				if ( g_Prefs.mirror.isChecked() && (tarDiskRemaining + tarSize) < srcSize )
				{
					g_syncButton.setEnabled(true);
			//		still need to define these txts
					wr_dialog(wr_localize("dialog_space_t"), wr_localize("dialog_space_m"));
					return;
				}
			}
			else
			{
				wr_dev("Incorrect parsing of disk sizes.\n\nSource: " + srcSize + "\nTarget: " + tarSize + "\nTarDiskRemaining: " + tarDiskRemaining);
			}
*/

			// VALIDATION 4: confirmation dialog if the mirror option is enabled
			if (!deletionsConfirmed && g_Prefs.mirror.isChecked())
			{
				// src appears empty
				if (typeof(widget.system("/bin/ls -1 " + wr_escapeCLI(g_cmd.src), null).outputString) === "undefined")
				{
					wr_dialog(wr_localize("dialog_emptySource_t"), wr_localize("dialog_emptySource_m"),
							  wr_localize("Cancel"), null, 
							  wr_localize("Proceed"), function () { w_doSync(1); });
				}
				else
				{
					wr_dialog(wr_localize("dialog_mirrorWarning_t"), wr_localize("dialog_mirrorWarning_m"),
							  wr_localize("Mirror"), function () { w_doSync(1); },
							  wr_localize("Cancel"), null);
				}

				g_syncButton.setEnabled(true);
				return;
			}

			// ALL THE VALIDATIONS HAVE PASSED. LET'S START THE SYNC!

			// disable drag & drop events
			wr_eId("srcPlatter").ondragenter = null;
			wr_eId("srcPlatter").ondragover = null;
			wr_eId("srcPlatter").ondragleave = null;
			wr_eId("srcPlatter").ondrop = null;
			wr_eId("tarPlatter").ondragenter = null;
			wr_eId("tarPlatter").ondragover = null;
			wr_eId("tarPlatter").ondragleave = null;
			wr_eId("tarPlatter").ondrop = null;

			// disable preference options
			g_Prefs.dryRun.setEnabled(false);
			g_Prefs.mirror.setEnabled(false);
			g_Prefs.exclude.setEnabled(false);

			// clear the last sync timestamp
			wr_setPref(null, wr_instance("lastSync"));
			wr_eId("info").innerHTML = "";

	//on hover of spinner, w_cancelSync
			g_spinner = setInterval(function () { w_shiftSpinner(); }, 75);
			g_cmd.isRunning = true;

			//redirect = " > /private/tmp/Data-Vu_" + wr_instance() + ".txt";
			//tee =      " | tee ~/Desktop/bkup/2006.05.08.log
			g_cmd.rsync = widget.system((widgetPath + command), w_syncDone);
		}
	}
}


/*
 * Kills the rsync process gracefully
 * and resets the widget to an idle state.
 */
function w_cancelSync()
{
	if (g_cmd.isRunning)
	{
		g_cmd.rsync.cancel();
		g_cmd.isRunning = false;

		// stop the spinner and remove it
		clearInterval(g_spinner);
		wr_eId("info").style.backgroundPositionY = "0";
		wr_eId("info").innerHTML = "Cancelled";

		// reset the widget
		w_clearResults();
	}
}


/*
 * Called once the command in w_doSync() completes its execution.
 *
 *  - Stops the "in-progress" visual indicator
 *  - Displays the appropriate result icon for the exit status code of the finished command
 *  - Updates the content of the summary of the results
 *  - Enables the reset button
 *  - Stretches the widget to show data
 */
function w_syncDone(e)
{
	var green = "0";
	var yellow = "-40px";
	var red = "-80px";
//	var unknown = "-120px";

	var exitIcon = null;
	var exitText = null;
	var exitInfo = null;
	var summaryHTML = null;

	var date = "00000000000000";

	g_cmd.isRunning = false;

	if (window.widget)
	{
		date = widget.system("/bin/date \"+%C%y%m%d%H%M%S\"", null).outputString;

		// verify that only digits exist
		if (typeof(date) !== "undefined" && /^\d+\n?$/.test(date))
		{
			date = date.split("\n", 1)[0];
		}
		else
		{
			wr_dev("Unable to get date after sync operation.\nstdout: " + date);
		}
	}

	// save the date timestamp
	g_cmd.timestamp = date;
	wr_setPref(g_cmd.timestamp, wr_instance("lastSync"));

	// hault the spinner
	clearInterval(g_spinner);

	summaryHTML = w_parseSummary();

	switch (g_cmd.rsync.status)
	{
		// Success
		case 0:
			exitIcon = green;
			exitText = wr_localize("exit_00_t");
			exitInfo = wr_localize("exit_00_m");
			break;

		// Syntax or usage error
		case 1:
			exitIcon = red;
			exitText = wr_localize("exit_01_t");
			exitInfo = wr_localize("exit_01_m");

			// SHOULDN NOT HAPPEN since everything is hard coded
			setTimeout(function () {
				wr_dev("Unexpected exit code (" + g_cmd.rsync.status + ")" + ((summaryHTML === null) ? " THAT DID NOT PRODUCE AN OUPUT SUMMARY." : ".") + "\n\nCommand:\n" + g_cmd.str + " " + wr_escapeCLI(g_cmd.src) + " " + wr_escapeCLI(g_cmd.tar) + "\n\nstderr:\n" + g_cmd.rsync.errorString);
			}, 750);
			
			// most likely cause is improper sanition of paths
			// files didn't transfer due to incompatablity with different filesystem formats (FAT32, etc)...causes exit 23
			break;

		// Protocol incompatibility
		case 2:
			exitIcon = red;
			exitText = wr_localize("exit_02_t");
			exitInfo = wr_localize("exit_02_m");

			// SHOULDN NOT HAPPEN since we do a check before
			setTimeout(function () {
				wr_dev("Unexpected exit code (" + g_cmd.rsync.status + ")" + ((summaryHTML === null) ? " THAT DID NOT PRODUCE AN OUPUT SUMMARY." : ".") + "\n\nCommand:\n" + g_cmd.str + " " + wr_escapeCLI(g_cmd.src) + " " + wr_escapeCLI(g_cmd.tar) + "\n\nstderr:\n" + g_cmd.rsync.errorString);
			}, 750);

			// occurs when source disappears (but exit is 23...with output data)
			break;

		// Errors selecting input/output files, dirs
		case 3:
			exitIcon = red;
			exitText = wr_localize("exit_03_t");
			exitInfo = wr_localize("exit_03_m");

			// SHOULDN NOT HAPPEN since we check permission & file existance before
			setTimeout(function () {
				wr_dev("Unexpected exit code (" + g_cmd.rsync.status + ")" + ((summaryHTML === null) ? " THAT DID NOT PRODUCE AN OUPUT SUMMARY." : ".") + "\n\nCommand:\n" + g_cmd.str + " " + wr_escapeCLI(g_cmd.src) + " " + wr_escapeCLI(g_cmd.tar) + "\n\nstderr:\n" + g_cmd.rsync.errorString);
			}, 750);

			// occurs when tar doesn't have --x
			// path doesn't exist
			break;

		// Requested action not supported: an attempt was made to manipulate 64-bit files on a platform that cannot support them; or an option was specified that is supported by the client and not by the server.
		case 4:
			exitIcon = red;
			exitText = wr_localize("exit_04_t");
			exitInfo = wr_localize("exit_04_m");

			setTimeout(function () {
				wr_dev("Unexpected exit code (" + g_cmd.rsync.status + ")" + ((summaryHTML === null) ? " THAT DID NOT PRODUCE AN OUPUT SUMMARY." : ".") + "\n\nCommand:\n" + g_cmd.str + " " + wr_escapeCLI(g_cmd.src) + " " + wr_escapeCLI(g_cmd.tar) + "\n\nstderr:\n" + g_cmd.rsync.errorString);
			}, 750);

			break;

		// Error starting client-server protocol
		case 5:
			exitIcon = red;
			exitText = wr_localize("exit_05_t");
			exitInfo = wr_localize("exit_05_m");

			setTimeout(function () {
				wr_dev("Unexpected exit code (" + g_cmd.rsync.status + ")" + ((summaryHTML === null) ? " THAT DID NOT PRODUCE AN OUPUT SUMMARY." : ".") + "\n\nCommand:\n" + g_cmd.str + " " + wr_escapeCLI(g_cmd.src) + " " + wr_escapeCLI(g_cmd.tar) + "\n\nstderr:\n" + g_cmd.rsync.errorString);
			}, 750);

			break;

		// Daemon unable to append to log-file
		case 6:
			exitIcon = red;
			exitText = wr_localize("exit_06_t");
			exitInfo = wr_localize("exit_06_m");

			setTimeout(function () {
				wr_dev("Unexpected exit code (" + g_cmd.rsync.status + ")" + ((summaryHTML === null) ? " THAT DID NOT PRODUCE AN OUPUT SUMMARY." : ".") + "\n\nCommand:\n" + g_cmd.str + " " + wr_escapeCLI(g_cmd.src) + " " + wr_escapeCLI(g_cmd.tar) + "\n\nstderr:\n" + g_cmd.rsync.errorString);
			}, 750);

			break;

		// Error in socket I/O
		case 10:
			exitIcon = yellow;
			exitText = wr_localize("exit_10_t");
			exitInfo = wr_localize("exit_10_m");

			setTimeout(function () {
				wr_dev("Unexpected exit code (" + g_cmd.rsync.status + ")" + ((summaryHTML === null) ? " THAT DID NOT PRODUCE AN OUPUT SUMMARY." : ".") + "\n\nCommand:\n" + g_cmd.str + " " + wr_escapeCLI(g_cmd.src) + " " + wr_escapeCLI(g_cmd.tar) + "\n\nstderr:\n" + g_cmd.rsync.errorString);
			}, 750);

			break;

		// Error in file I/O
		case 11:
			exitIcon = yellow;
			exitText = wr_localize("exit_11_t");
			exitInfo = wr_localize("exit_11_m");

			setTimeout(function () {
				wr_dev("Unexpected exit code (" + g_cmd.rsync.status + ")" + ((summaryHTML === null) ? " THAT DID NOT PRODUCE AN OUPUT SUMMARY." : ".") + "\n\nCommand:\n" + g_cmd.str + " " + wr_escapeCLI(g_cmd.src) + " " + wr_escapeCLI(g_cmd.tar) + "\n\nstderr:\n" + g_cmd.rsync.errorString);
			}, 750);

			break;

		// Error in rsync protocol data stream
		case 12:
			exitIcon = red;
			exitText = wr_localize("exit_12_t");
			exitInfo = wr_localize("exit_12_m");

			setTimeout(function () {
				wr_dev("Unexpected exit code (" + g_cmd.rsync.status + ")" + ((summaryHTML === null) ? " THAT DID NOT PRODUCE AN OUPUT SUMMARY." : ".") + "\n\nCommand:\n" + g_cmd.str + " " + wr_escapeCLI(g_cmd.src) + " " + wr_escapeCLI(g_cmd.tar) + "\n\nstderr:\n" + g_cmd.rsync.errorString);
			}, 750);

			// happens when the root TARGET directory does not have read/write permissions
			// also happens when you run out of space on the target drive
			// http://samba.anu.edu.au/rsync/issues.html
			// local rsync was trying to talk to the remote rsync, but the connection to that rsync is now gone
			break;

		// Errors with program diagnostics
		case 13:
			exitIcon = red;
			exitText = wr_localize("exit_13_t");
			exitInfo = wr_localize("exit_13_m");

			setTimeout(function () {
				wr_dev("Unexpected exit code (" + g_cmd.rsync.status + ")" + ((summaryHTML === null) ? " THAT DID NOT PRODUCE AN OUPUT SUMMARY." : ".") + "\n\nCommand:\n" + g_cmd.str + " " + wr_escapeCLI(g_cmd.src) + " " + wr_escapeCLI(g_cmd.tar) + "\n\nstderr:\n" + g_cmd.rsync.errorString);
			}, 750);

			// occurs when don't have r permission on src.
			// also when don't have r-x on tar
			break;

		// Error in IPC code
		case 14:
			exitIcon = yellow;
			exitText = wr_localize("exit_14_t");
			exitInfo = wr_localize("exit_14_m");

			setTimeout(function () {
				wr_dev("Unexpected exit code (" + g_cmd.rsync.status + ")" + ((summaryHTML === null) ? " THAT DID NOT PRODUCE AN OUPUT SUMMARY." : ".") + "\n\nCommand:\n" + g_cmd.str + " " + wr_escapeCLI(g_cmd.src) + " " + wr_escapeCLI(g_cmd.tar) + "\n\nstderr:\n" + g_cmd.rsync.errorString);
			}, 750);

			break;

		// Received SIGUSR1 or SIGINT
		case 20:
			exitIcon = yellow;
			exitText = wr_localize("exit_20_t");
			exitInfo = wr_localize("exit_20_m");

			setTimeout(function () {
				wr_dev("Unexpected exit code (" + g_cmd.rsync.status + ")" + ((summaryHTML === null) ? " THAT DID NOT PRODUCE AN OUPUT SUMMARY." : ".") + "\n\nCommand:\n" + g_cmd.str + " " + wr_escapeCLI(g_cmd.src) + " " + wr_escapeCLI(g_cmd.tar) + "\n\nstderr:\n" + g_cmd.rsync.errorString);
			}, 750);

			// command was killed by an external process
			break;

		// Some error returned by waitpid()
		case 21:
			exitIcon = yellow;
			exitText = wr_localize("exit_21_t");
			exitInfo = wr_localize("exit_21_m");

			setTimeout(function () {
				wr_dev("Unexpected exit code (" + g_cmd.rsync.status + ")" + ((summaryHTML === null) ? " THAT DID NOT PRODUCE AN OUPUT SUMMARY." : ".") + "\n\nCommand:\n" + g_cmd.str + " " + wr_escapeCLI(g_cmd.src) + " " + wr_escapeCLI(g_cmd.tar) + "\n\nstderr:\n" + g_cmd.rsync.errorString);
			}, 750);

			break;

		// Error allocating core memory buffers
		case 22:
			exitIcon = yellow;
			exitText = wr_localize("exit_22_t");
			exitInfo = wr_localize("exit_22_m");

			setTimeout(function () {
				wr_dev("Unexpected exit code (" + g_cmd.rsync.status + ")" + ((summaryHTML === null) ? " THAT DID NOT PRODUCE AN OUPUT SUMMARY." : ".") + "\n\nCommand:\n" + g_cmd.str + " " + wr_escapeCLI(g_cmd.src) + " " + wr_escapeCLI(g_cmd.tar) + "\n\nstderr:\n" + g_cmd.rsync.errorString);
			}, 750);

			break;

		// Partial transfer due to error
		case 23:
			exitIcon = yellow;
			exitText = wr_localize("exit_23_t");
			exitInfo = wr_localize("exit_23_m");

			break;

		// Partial transfer due to vanished source files
		case 24:
			exitIcon = yellow;
			exitText = wr_localize("exit_24_t");
			exitInfo = wr_localize("exit_24_m");

	setTimeout(function () {
				wr_dev("Unexpected exit code (" + g_cmd.rsync.status + ")" + ((summaryHTML === null) ? " THAT DID NOT PRODUCE AN OUPUT SUMMARY." : ".") + "\n\nCommand:\n" + g_cmd.str + " " + wr_escapeCLI(g_cmd.src) + " " + wr_escapeCLI(g_cmd.tar) + "\n\nstderr:\n" + g_cmd.rsync.errorString);
			}, 750);

			break;

		// The --max-delete limit stopped deletions
		case 25:
			exitIcon = yellow;
			exitText = wr_localize("exit_25_t");
			exitInfo = wr_localize("exit_25_m");

			// NOT POSSIBLE since the widget doesn't use the --max-delete option
			setTimeout(function () {
				wr_dev("Unexpected exit code (" + g_cmd.rsync.status + ")" + ((summaryHTML === null) ? " THAT DID NOT PRODUCE AN OUPUT SUMMARY." : ".") + "\n\nCommand:\n" + g_cmd.str + " " + wr_escapeCLI(g_cmd.src) + " " + wr_escapeCLI(g_cmd.tar) + "\n\nstderr:\n" + g_cmd.rsync.errorString);
			}, 750);

			break;

		// Timeout in data send/receive
		case 30:
			exitIcon = yellow;
			exitText = wr_localize("exit_30_t");
			exitInfo = wr_localize("exit_30_m");

			// NOT POSSIBLE since the widget doesn't use the --timeout option
			setTimeout(function () {
				wr_dev("Unexpected exit code (" + g_cmd.rsync.status + ")" + ((summaryHTML === null) ? " THAT DID NOT PRODUCE AN OUPUT SUMMARY." : ".") + "\n\nCommand:\n" + g_cmd.str + " " + wr_escapeCLI(g_cmd.src) + " " + wr_escapeCLI(g_cmd.tar) + "\n\nstderr:\n" + g_cmd.rsync.errorString);
			}, 750);

			break;

		// Timeout waiting for daemon connection
		case 35:
			exitIcon = yellow;
			exitText = wr_localize("exit_35_t");
			exitInfo = wr_localize("exit_35_m");

			// NOT POSSIBLE since the widget doesn't use the --contimeout option
			setTimeout(function () {
				wr_dev("Unexpected exit code (" + g_cmd.rsync.status + ")" + ((summaryHTML === null) ? " THAT DID NOT PRODUCE AN OUPUT SUMMARY." : ".") + "\n\nCommand:\n" + g_cmd.str + " " + wr_escapeCLI(g_cmd.src) + " " + wr_escapeCLI(g_cmd.tar) + "\n\nstderr:\n" + g_cmd.rsync.errorString);
			}, 750);

			break;

		// Error code not accounted for
		default:
			//32 = broken pip (happened when killed via cli)
			//rsync: writefd_unbuffered failed to write 4 bytes [sender]: Broken pipe (32)

			//28 = no space left on device (32 > 28 > 11 > 12)

			setTimeout(function () {
				wr_dev("Exit code (" + g_cmd.rsync.status + ") unaccounted for after running the following command:\n" + g_cmd.str + " " + wr_escapeCLI(g_cmd.src) + " " + wr_escapeCLI(g_cmd.tar) + "\n\nstderr:\n" + g_cmd.rsync.errorString);
			}, 750);

			break;
	}

	// cause for error code not yet determined, option to send info to developer
	if (exitInfo === " ")
	{
		exitInfo = wr_localize("dialog_rareExit");

		wr_eId("exit-text").onclick = function () {
			wr_dialog(exitText, exitInfo,
			          wr_localize("Yes") + "...", function () { wr_debug("Rare exit code (" + g_cmd.rsync.status + ") encountered" + ((summaryHTML === null) ? " THAT DID NOT PRODUCE AN OUPUT SUMMARY." : ".") + "\n\nCommand:\n" + g_cmd.str + " " + wr_escapeCLI(g_cmd.src) + " " + wr_escapeCLI(g_cmd.tar) + "\n\nstderr:\n" + g_cmd.rsync.errorString); },
			          wr_localize("No"), null);
			};
	}
	else
	{
		//More Info Online...
		//exitInfo = "Would you like to see more information about this exit code online?";
		exitInfo += "<br /><br />More details in the output log.<br /><br />Was this explanation helpful?";

		wr_eId("exit-text").onclick = function () {
			wr_dialog(exitText, exitInfo,
			          wr_localize("Yes"), null,
			          wr_localize("No") + "...",  function () { wr_debug("Explanation for exit code " + g_cmd.rsync.status + " was NOT helpful." + "\n\nCommand:\n" + g_cmd.str + " " + wr_escapeCLI(g_cmd.src) + " " + wr_escapeCLI(g_cmd.tar) + "\n\nstderr:\n" + g_cmd.rsync.errorString); });
		};
	}

	// force the color of the icon...
	// red if no results could be parsed from output, green only if exit status = 0, yellow otherwise
	//exitIcon = ((summaryHTML === null) ? red : ((g_cmd.rsync.status === 0) ? green : yellow));
	// red if stderr, green only if exit status = 0, yellow otherwise
	//exitIcon = ((g_cmd.rsync.errorString) ? red : ((g_cmd.rsync.status == 0) ? green : yellow));

	// activate all elements of the results before displaying it
	g_resetButton.setEnabled(true);
	wr_eId("info").innerHTML = wr_localize("Last SYNC on:") + "<br />" + w_formatTimestamp(wr_localize("date_short"));
	wr_eId("exit-text").innerHTML = exitText;
	wr_eId("exit-icon").style.backgroundPositionY = exitIcon;
	wr_eId("summary").innerHTML = (summaryHTML === null) ? wr_localize("exit_unknown") : summaryHTML;
	wr_eId("results").style.display = "block";

	// remove the spinner
	wr_eId("info").style.backgroundPositionY = "0";

	// don't stretch the widget if the user is on the back side (waits for him to return to the front)
	if (wr_eId("back").style.display !== "block")
	{
		wr_resizeTo(302, 222, null);
	}
}


/*
 * Formats the the g_cmd.timestamp string into a more
 * human readable String defined by <format> (using the codes of the unix 'date' program).
 */
function w_formatTimestamp(format)
{
	var date;
	var formattedDate = "1111/11/11 11:11:11";

	if (window.widget)
	{
		date = widget.system("/bin/date -jf \"%C%y%m%d%H%M%S\" \"" + g_cmd.timestamp + "\" \"" + format + "\"", null);

		// +%b %d at %H:%M:%S
		// +%C%y/%m/%d/ %H:%M:%S
		if (date.status === 0 && typeof(date.outputString) !== "undefined")
		{
			formattedDate = date.outputString.split("\n", 1)[0];
		}
		else
		{
			wr_dev("Unable to properly parse the date of the last sync.\n\nstatus: " + date.status + "\nstdout: " + date.outputString + "\nstderr: " + date.errorString);
		}

	/*
		formattedDate = wr_localize("Last SYNC on:") + "<br />" +
						timestamp.substr(0, 4)  + "/" +
						timestamp.substr(4, 2)  + "/" +
						timestamp.substr(6, 2)  + " " +
						timestamp.substr(8, 2)  + ":" +
						timestamp.substr(10, 2) + ":" +
						timestamp.substr(12, 2);
	*/
	}
	else
	{
		formattedDate = "non-Widget Date";
	}

	return formattedDate;
}


/*
 * Parses the standard output of the rsync command
 * and returns the results summarized into an HTML String.
 */
function w_parseSummary()
{
	var deleted = null;
	var files = null;
	var bytes = null;
	var files_t = null;
	var bytes_t = null;

	var outputHTML = null;

	if (window.widget)
	{
		deleted = widget.system("/bin/echo " + wr_escapeCLI(g_cmd.rsync.outputString) +
	                            " | grep -Ec '^deleting '",
	                            null).outputString;
		files = widget.system("/bin/echo " + wr_escapeCLI(g_cmd.rsync.outputString) +
	                          " | grep -E '^Number of files transferred: [0-9]+$' | sed -E 's/[^0-9]*([0-9]+)[^0-9]*/\\1/'",
	                          null).outputString;
		bytes = widget.system("/bin/echo " + wr_escapeCLI(g_cmd.rsync.outputString) +
	                          " | grep -E '^Total transferred file size: [0-9]+ bytes$' | sed -E 's/[^0-9]*([0-9]+)[^0-9]*/\\1/'",
	                          null).outputString;
		files_t = widget.system("/bin/echo " + wr_escapeCLI(g_cmd.rsync.outputString) +
	                            " | grep -E '^Number of files: [0-9]+$' | sed -E 's/[^0-9]*([0-9]+)[^0-9]*/\\1/'",
	                            null).outputString;
		bytes_t = widget.system("/bin/echo " + wr_escapeCLI(g_cmd.rsync.outputString) +
	                            " | grep -E '^Total file size: [0-9]+ bytes$' | sed -E 's/[^0-9]*([0-9]+)[^0-9]*/\\1/'",
	                            null).outputString;
	}

	// verify output exists and are vaild numbers
	if (typeof(deleted) !== "undefined" && /^\d+\n?$/.test(deleted) &&
	    typeof(files) !== "undefined"   && /^\d+\n?$/.test(files) &&
	    typeof(bytes) !== "undefined"   && /^\d+\n?$/.test(bytes) &&
	    typeof(files_t) !== "undefined" && /^\d+\n?$/.test(files_t) &&
	    typeof(bytes_t) !== "undefined" && /^\d+\n?$/.test(bytes_t))
	{
		deleted = parseInt(deleted.split("\n", 1)[0], 10);
		files = parseInt(files.split("\n", 1)[0], 10);
		bytes = parseInt(bytes.split("\n", 1)[0], 10);
		files_t = parseInt(files_t.split("\n", 1)[0], 10);
		bytes_t = parseInt(bytes_t.split("\n", 1)[0], 10);

		// rsync counts the root directory as one of the files so there are times when we need to subtract one
		if (files_t > 0) { files_t--; }

		outputHTML = "<span class=\"" + ((g_Prefs.mirror.isChecked()) ? "" : "strike") + "\">" +
	                 wr_formatNum(deleted, 0) + " " + ((deleted === 1) ? "file" : "files") + " deleted</span><br />" +
	                 wr_formatNum(files, 0) + " " + ((files === 1) ? "file" : "files") + " transfered (" + wr_factorBytes(bytes) + ")<br />" +
		//           "Total" + "files" + " and" + "directories" + ": " + wr_formatNum(files_t, 0) + " (" + wr_factorBytes(bytes_t) + ")";
		             wr_formatNum(files_t, 0) + " " + ((files_t === 1) ? "file" : "files") + " (" + wr_factorBytes(bytes_t) + ")";
	}
	else
	{
		outputHTML = null;
	}

	return outputHTML;
}


/*
 * Formats the output log and writes it to a file
 * on the Desktop (with a timestamp in the name).
 */
function w_saveLog()
{
	var fileWrite = 0;

	var logPath = "~/Desktop/Data-Vu_" + g_cmd.timestamp + ".txt";	//echo -n $HOME

	if (window.widget)
	{
//		maybe create the file first, verify that it was created successfully and has the right permissions
//		if it already exists (warning, abort?)
//		touch and test -e

//is it more efficient to
//echo everything all at once?
		fileWrite = (fileWrite ||
			         widget.system("/bin/echo " + wr_escapeCLI(w_formatTimestamp(wr_localize("date_full")) +
					 "\n" +
	                 "\nCommand: " + g_cmd.str +
	                 "\nSource: " + g_cmd.src +
	                 "\nTarget: " + g_cmd.tar) + " > " + logPath, null).status);

		// append stderr (if it exits)
		if (typeof(g_cmd.rsync.errorString) !== "undefined")
		{
			fileWrite = (fileWrite ||
				         widget.system("/bin/echo -n " + wr_escapeCLI("\n\nstderr\n--------------------------\n\n") +
		                 wr_escapeCLI(g_cmd.rsync.errorString) +
		                 " >> " + logPath, null).status);
		}

		// append stdout
		fileWrite = (fileWrite ||
			         widget.system("/bin/echo -n " + wr_escapeCLI("\n\nstdout\n--------------------------\n\n") +
	                 wr_escapeCLI(g_cmd.rsync.outputString) +
	                 " >> " + logPath, null).status);

		if (fileWrite)
		{
			wr_dev("Unable to write to the log file.");
		}
		else
		{
//			wr_dialog("Detailed Log", "A detailed log of this syncronization has been saved to your Desktop with a timestamp as: <strong>" + w_getFileName(logPath) + "</strong>.",
//			"See It", function () { widget.system("/usr/bin/open " + logPath + " >& /dev/null &", null); wr_openURL(""); },
//			"OK", null);
			//"Clear Results", function () { w_saveLog(); wr_resizeTo(302, 128, w_clearResults); }
			//widget.system("/usr/bin/qlmanage -p " + logPath + " >& /dev/null &", null);
		}
	}
}


/*
 * Clears the results (does not change the size of the widget).
 */
function w_clearResults()
{
	// clear the memory from the global rsync object
	g_cmd.rsync = null;

	// clear the result summary
	wr_eId("exit-text").innerHTML = "";
	wr_eId("summary").innerHTML = "";
	wr_eId("results").style.display = "none";

	// disable the reset button
	g_resetButton.setEnabled(false);

	// re-enable drag & drop events
	wr_eId("srcPlatter").ondragenter = function () { w_dragEnter(event, this); };
	wr_eId("srcPlatter").ondragover = function () { w_dragOver(event); };
	wr_eId("srcPlatter").ondragleave = function () { w_dragLeave(event, this); };
	wr_eId("srcPlatter").ondrop = function () { w_dragDrop(event, this); };
	wr_eId("tarPlatter").ondragenter = function () { w_dragEnter(event, this); };
	wr_eId("tarPlatter").ondragover = function () { w_dragOver(event); };
	wr_eId("tarPlatter").ondragleave = function () { w_dragLeave(event, this); };
	wr_eId("tarPlatter").ondrop = function () { w_dragDrop(event, this); };

	// re-enable the preference options
	g_Prefs.dryRun.setEnabled(true);
	g_Prefs.mirror.setEnabled(true);
	g_Prefs.exclude.setEnabled(true);

	/*
	// clear scr, tar and last sync date
	g_cmd.src = null;
	wr_eId("srcPlatterName").style.display = "block";
	wr_eId("srcFileIcon").src = "Images/icon_src.png";
	wr_eId("srcFileName").innerText = "";
	wr_setPref(null, wr_instance("targetPath"));

	g_cmd.tar = null;
	wr_eId("tarPlatterName").style.display = "block";
	wr_eId("tarFileIcon").src = "Images/icon_tar.png";
	wr_eId("tarFileName").innerText = "";
	wr_setPref(null, wr_instance("sourcePath"));

	wr_eId("info").innerHTML = "";
	wr_setPref(null, wr_instance("lastSync"));
	*/

	// enable the sync button
	g_syncButton.setEnabled(true);
}


/*
 * Resizes the widget to <width> and <height>.
 * The resize is done in a smooth animation (by use of the AppleAnimator object)
 * and supports the Shift-Key being depressed (animate at a tenth of the normal
 * speed). Once the animation is complete, the <doneHandler> is called.
 */
function wr_resizeTo(width, height, doneHandler)
{
	var speedFactor, startingRect, finishingRect, rectAnimation, stretchAnimation;

	speedFactor = ((event && event.shiftKey) ? 10 : 1);

	// 2 AppleRect objects store the starting and finshing rectangle sizes
	startingRect = new AppleRect(0, 0, window.innerWidth, window.innerHeight);
	finishingRect = new AppleRect(0, 0, width, height);

	// The RectAnimation specifies the range of values and the handler to call at the animator's interval
	rectAnimation = new AppleRectAnimation(startingRect, finishingRect, function (rectAnimation, currentRect, startingRect, finishingRect)
	{
		wr_eId("middle").style.height = (currentRect.bottom - 40);
		wr_eId("bottom").style.top = (currentRect.bottom - 13);
		window.resizeTo(currentRect.right, currentRect.bottom);
	});

	stretchAnimation = new AppleAnimator((500 * speedFactor), 13);	// the timer for the animation

	stretchAnimation.addAnimation(rectAnimation);
	stretchAnimation.oncomplete = doneHandler; 
	stretchAnimation.start();
}


//interval, #of slides, offset
//g_spinner = new MatrixAnimationX(13, 12, -28);
//.start()
//.stop()
//.pause()
//.resume()
//maybe not these...
//.over(offset, handle);
//.down(offset, handle);
//	wr_eId("info").style.backgroundPositionY = ((current == 12) ? offset : (offset * current)) + "px";

//var g_Spinner = new AppleAnimator(2000, 50, 1, 12, w_shiftSpinner);
//current, start, finish. does nothing the the AppleAnimator object
function w_shiftSpinner()
{
	var offset = -28;
	var current = parseInt(document.defaultView.getComputedStyle(wr_eId("info"), null).getPropertyValue('background-position-y'), 10);
	var slide = current / offset;

	// loops the matrix of images
	wr_eId("info").style.backgroundPositionY = ((slide === 12) ? offset : (current + offset)) + "px";
}


///----------------


/*
 * Called when a successful response has been received after checking for the version.
 * _______
//array[0] = latest version
//array[1] = type (0, 1, 2)
//array[3] = custom message
 */
function w_vQueryResponse(latestVersion)
{
	var responses = null;

	wr_eId("version").innerHTML = "v" + wr_getPlistValue("CFBundleVersion");
//alert(latestVersion);
	if (latestVersion !== null && latestVersion !== '')
	{
		responses = latestVersion.split("|", 1);

		if (wr_getPlistValue("CFBundleVersion") !== responses[0])
		{
			wr_eId("version").innerHTML = "v" + wr_getPlistValue("CFBundleVersion");
			wr_dialog("New Version Available", "There is a new version available (you are using version " + wr_getPlistValue("CFBundleVersion") + ").<br /><br />You can read release notes and get the new version on the web.",
			          "Get It...", function () { wr_openURL(); },
			          "Not Now", null);
		}
	}
	else
	{
		// empty page received
	}

	// restore onclick action
	wr_eId("version").onclick = function () {
		wr_eId("version").onclick = null;
		wr_vQuery(function () { wr_eId("version").innerHTML = "checking..."; },
		          function () { wr_eId("version").innerHTML = "v" + wr_getPlistValue("CFBundleVersion"); },
		          w_vQueryResponse);
	};
}


/*
 * Retrieves any previously saved settings and applies
 * their values to the correct elements and variables.
 */
function w_loadSavedPrefs()
{
	var src = wr_getPref(wr_instance("sourcePath"));
	var tar = wr_getPref(wr_instance("targetPath"));
	var last = wr_getPref(wr_instance("lastSync"));

	if (src) { w_setSrc(src); }
	if (tar) { w_setTar(tar); }

	if (last)
	{
		g_cmd.timestamp = last;
		wr_eId("info").innerHTML = wr_localize("Last SYNC on:") + "<br />" + w_formatTimestamp(wr_localize("date_short"));
	}

	// double check that the last sync date should only exist if both src and tar do also (and vice versa)
	if ( ((src && tar) && !last) || (last && (!src || !tar)))
	{
		//wr_setPref(null, wr_instance("lastSync"));
		wr_dev("When trying to load the saved preferences, either no last sync date existed when there was a Source and Target defined, or a last sync date existed when both a Source and Target were not defined.\n\nsrc_pref: " + src + "\ntar_pref: " + tar + "\nlast_pref: " + last + "\n\nsrc_mem: " + g_cmd.src + "\ntar_mem: " + g_cmd.tar + "\nlast_mem: " + g_cmd.timestamp);
	}

	g_Prefs.dryRun.applySavedPref();
	g_Prefs.mirror.applySavedPref();
	g_Prefs.exclude.applySavedPref();
	g_Prefs.autoUpdate.applySavedPref();
}


/*
 * Registers event handlers (including Dashboard-specific ones)
 * and initialized objects
 */
function w_registerHandlers()
{
	var infoButton = new AppleInfoButton(wr_eId("infoButton"), wr_eId("front"), "white", "white", w_toBack);
	var doneButton = new AppleGlassButton(wr_eId("doneButton"), wr_localize("Done"), w_toFront);

	g_syncButton = new AppleButton(wr_eId("syncButton"),
	                               "", 40,
	                               "Images/sync-button-l_up.png", "Images/sync-button-l_down.png", 40,
	                               "", "",
	                               "", "", 0,
	                               function () { w_doSync(0); });
	g_syncButton.setDisabledImages("Images/sync-button-l_off.png", "", "");
	g_syncButton.setEnabled(false);

	g_resetButton = new AppleButton(wr_eId("resetButton"),
	                                wr_localize("Done"), 20,
	                                "Images/reset-button-l_up.png", "Images/reset-button-l_down.png", 10,
	                                "Images/reset-button-m_up.png", "Images/reset-button-m_down.png",
	                                "Images/reset-button-r_up.png", "Images/reset-button-r_down.png", 10,
	                                function () { wr_resizeTo(302, 128, w_clearResults); });
//	g_resetButton = new AppleGlassButton(wr_eId("resetButton"), wr_localize("Clear"), function () { wr_resizeTo(302, 128, w_clearResults); });
	g_resetButton.setEnabled(false);

	g_Prefs.dryRun = new wr_Preference(wr_eId("dryRun"), wr_localize("option_simulate"), wr_localize("tooltip_simulate"), true);
	g_Prefs.mirror = new wr_Preference(wr_eId("mirrorSource"), wr_localize("option_mirror"), wr_localize("tooltip_mirror"), true);
	g_Prefs.exclude = new wr_Preference(wr_eId("excludeFiles"), wr_localize("option_exclude"), wr_localize("tooltip_exclude"), true);
	g_Prefs.autoUpdate = new wr_Preference(wr_eId("autoUpdate"), wr_localize("option_autoUpdate"), "", false);

	wr_eId("srcPlatterName").innerHTML = wr_localize("Source");
	wr_eId("srcPlatter").onclick = function () { if (g_cmd.src === null) { wr_dialog(wr_localize("dialog_definepath_t"), wr_localize("dialog_definepath_m")); } };
	wr_eId("srcPlatter").ondragenter = function () { w_dragEnter(event, this); };
	wr_eId("srcPlatter").ondragover = function () { w_dragOver(event); };
	wr_eId("srcPlatter").ondragleave = function () { w_dragLeave(event, this); };
	wr_eId("srcPlatter").ondrop = function () { w_dragDrop(event, this); };

	wr_eId("tarPlatterName").innerHTML = wr_localize("Target");
	wr_eId("tarPlatter").onclick = function () { if (g_cmd.tar === null) { wr_dialog(wr_localize("dialog_definepath_t"), wr_localize("dialog_definepath_m")); } };
	wr_eId("tarPlatter").ondragenter = function () { w_dragEnter(event, this); };
	wr_eId("tarPlatter").ondragover = function () { w_dragOver(event); };
	wr_eId("tarPlatter").ondragleave = function () { w_dragLeave(event, this); };
	wr_eId("tarPlatter").ondrop = function () { w_dragDrop(event, this); };

	wr_eId("logo").onclick = function () { wr_openURL(); };
	wr_eId("version").innerHTML = "v" + wr_getPlistValue("CFBundleVersion");
	wr_eId("version").onclick = function () {
		wr_eId("version").onclick = null;
		wr_vQuery(function () { wr_eId("version").innerHTML = "checking..."; },
		          function () { wr_eId("version").innerHTML = "v" + wr_getPlistValue("CFBundleVersion"); },
		          w_vQueryResponse);
	};

//create your own button Class that does buttons this cool way:
//each onmouseover, onmouseout function will check the "isEnabled" flag as to whether and of course control the onclick event

//	g_statusButton = new Fader(wr_eId("exit-icon"), function () { g_statusButton.fadeIn(); }, 1000, 0.3, 1.0);
//	g_statusButton.onFinished = function () { g_statusButton.fadeIn(); };
//	wr_eId("exit-icon").onclick = function () { g_statusButton.fadeOut(); };

	wr_eId("exit-icon").style.appleDashboardRegion = "dashboard-region(control circle)";
	wr_eId("exit-icon").onmouseover = function () { wr_eId("exit-icon").className = "mouseover"; };
	wr_eId("exit-icon").onmouseout = function () { wr_eId("exit-icon").className = "mouseout"; };
//	wr_eId("exit-icon").onclick = w_saveLog;
	wr_eId("exit-icon").onclick = function () {
		wr_dialog("Detailed Log", "If you would like to save and/or view a detailed log of this syncronization a file will be created on your Desktop with the following name and timestamp:<p align=\"center\"><strong>Data-Vu_" + g_cmd.timestamp + ".txt</strong></p>",
		"Save", w_saveLog,
		"Save & View", function () { w_saveLog(); widget.system("/usr/bin/open " + "~/Desktop/Data-Vu_" + g_cmd.timestamp + ".txt" + " >& /dev/null &", null); wr_openURL(""); },
		"Cancel", null);
		//"Save & Reset", function () { w_saveLog(); wr_resizeTo(302, 128, w_clearResults); }
		//widget.system("/usr/bin/qlmanage -p " + logPath + " >& /dev/null &", null);
	};

//wr_eId("info").onclick = function () { wr_dialog(wr_localize("dialog_cancel_t"), wr_localize("dialog_cancel_m"), "Yes", w_cancelSync, "No", null); };

	w_widgetHandlers();
}


/*
 * Registers Widget/Dashboard Events to their respective handlers
 *
 * widget.onshow - Dashboard environment is activated
 * widget.ohhide - Dashboard environment is exited
 * widget.onremove - Widget instance is closed (not refreshed)
 * widget.onfocus - Widget instance gets key focus
 * widget.onblur - Widget instance looses key focus
 * widget.ondragstart - Widget is being dragged
 * widget.ondragend - Widget just finshed being dragged
 */
function w_widgetHandlers()
{
	if (window.widget)
	{
		/*
		 * Called when the Dashboard environment is activated.
		 */
		widget.onshow = function () {
			if (g_cmd.isRunning)
			{
				// resume the spinner animation
				g_spinner = setInterval(function () { w_shiftSpinner(); }, 75);

				// resume the monitoring of the percentage complete
			}
		};


		/*
		 * Called when the Dashboard environment is activated.
		 */
		widget.onhide = function () {
			// pause spinner animation
			clearInterval(g_spinner);

			// when getting percentage, stop monitoring the output
			
		};

		/*
		 * Called when Widget instance is closed (not refreshed).
		 * Kills the rsync process in case it's still running.
		 * Clears any saved preferences (most likely the widget-specific ones).
		 */
		widget.onremove = function () {
			w_cancelSync();
// cancel timeout for version check

			wr_setPref(null, wr_instance("sourcePath"));
			wr_setPref(null, wr_instance("targetPath"));
			wr_setPref(null, wr_instance("lastSync"));

			wr_setPref(null, g_Prefs.dryRun.key);
			wr_setPref(null, g_Prefs.mirror.key);
			wr_setPref(null, g_Prefs.exclude.key);
		};
	}
}
