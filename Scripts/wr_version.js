/*
 * File: wr_version.js
 *
 * Copyright (c) 2007-2009, Paulo Avila (apaulodesign.com)
 *
 * Project: General Widget Resource
 *
 * Description: Acquires the version of the widget from an online
 *  PHP application through AJAX. This value is passed to an externally
 *  defined function that actually does something with it.
 *
 *  NOTE THAT THIS RESOURCE DEPENDS ON THE wr_plist.js RESOURCE.
 *
 *  NOTE THAT THREE FUNCTIONS SPECIFIC TO A WIDGET MUST BE CREATED ELSEWHERE:
 *   - w_versionQuery_startVisual()
 *   - w_versionQuery_stopVisual()
 *   - w_versionQuery_response(latestVersion)
 *
 * Modification Log:
 *  2007.06.03	Paulo	- Initial setup of functions
 *  2008.03.02	Paulo	- Modularized code so that it can be used for different widgets
 *  2008.03.03	Paulo	- Dynamically gets the widget name by use of the wr_plist.js resource
 *  2008.03.15	Paulo	- Added the wr_getExtension() function to parse the CFBundleIdentifier value
 *  2008.09.12	Paulo	- Skeleton functions for response code errors...
 *  2008.09.14	Paulo	- Moved the wr_getExtension() function to the wr_basic.js resource
 *  2008.09.24	Paulo	- Modified uses of wr_getExtension() to utilize the wr_ext() String method
 *  2008.11.09	Paulo	- Now wr_vQuery() function accepts custom-defined handlers
 *  2008.12.10	Paulo	- Modified code to get rid of several global variables
 *
 *  -----------------------------------------------------------------------------------------------------------------------------
 *
 *  Future		Feature	- properly handle response codes and possibly display error messages using the wr_dialog
 */

// be sure to update the comments
//maybe a 4th noUpdateHandler that is called when no update is available (this would be when user manually checks)
//then the 3rd would become: updateHandler
//or you can have this vQuery handle all the cases (by allowing it to use the wr_dialog() functions)

/*
 * Initiates an asynchronous AJAX request to an online application.
 *
 * The three arguments are handlers:
 *
 *  - <startHandler>: called when the request is initiated
 *  - <stopHandler>: called when the request completes (failure/success)
 *  - <responseHandler>: called when the request was successful - the response is passed as the argument
 */
function wr_vQuery(startHandler, stopHandler, responseHandler)
{
	var AJAX_STATE_UNSENT = 0;
	var AJAX_STATE_OPEN = 1;
	var AJAX_STATE_HEADERS_RECEIVED = 2;
	var AJAX_STATE_LOADING = 3;
	var AJAX_STATE_DONE = 4;

	var RESPONSE_CODE_OK = 200;
	var RESPONSE_CODE_NOT_FOUND = 404;

	var url = "http://www.apaulodesign.com/widgets/version.php?widget=" + wr_getPlistValue("CFBundleIdentifier").wr_ext();

	var g_ajaxRequest = new XMLHttpRequest();

	g_ajaxRequest.open("GET", url);
	g_ajaxRequest.setRequestHeader("Cache-Control", "no-cache");
	g_ajaxRequest.onreadystatechange = function () {
		if (g_ajaxRequest.readyState === AJAX_STATE_DONE)
		{
			stopHandler();	// customizable function particular to the widget

			if (g_ajaxRequest.status === RESPONSE_CODE_OK)
			{
				responseHandler(g_ajaxRequest.responseText);	// customizable function particular to the widget
			}
			/*
			else if (g_ajaxRequest.status == 0)
				alert("check ur internet connection or try again later");
			else
				alert("my site might be down temporarily (RESPONSE_CODE_NOT_FOUND) (404)"); //wr_dialog with option to send developer and note
			*/
		}
		/*
		else if (g_ajaxRequest.readyState == AJAX_STATE_LOADING)
		{
			//warning message if a reasonable timeout is reached
			//allow for abort with the use of request g_ajaxRequest.abort();
		}
		*/
	};

	g_ajaxRequest.send(null);		// sends the request

	startHandler();					// customizable function particular to the widget
//alert("end of version check");
}
