/**
 * @projectDescription	sIBL_GUI_For_XSI - Loader for sIBL Files.
 *
 * MODIFY THIS AT YOUR OWN RISK
 *
 * @author 	Thomas Mansencal	thomas.mansencal@gmail.com
 * @version	3.1.0
 * @os		Windows
 * @tasklist 	Code Comment.
 */

// ************************************************************************************************
// ***	Global variables
// ************************************************************************************************
HDRLABS_URL = "http://www.hdrlabs.com"
WINDOWS_RELEASE_URL = "http://kelsolaar.hdrlabs.com/?dir=./sIBL_GUI/Repository/Builds/Windows"
LINUX_RELEASE_URL = "http://kelsolaar.hdrlabs.com/?dir=./sIBL_GUI/Repository/Builds/Linux"
APPLICATION_THREAD_URL = "http://www.hdrlabs.com/cgi-bin/forum/YaBB.pl?num=1271609371"

// ************************************************************************************************
// ***	Plugin Loading / Unloading
// ************************************************************************************************

/**
 * XSILoadPlugin.
 *
 * @param	{PluginRegistrar}	in_reg	"The PluginRegistrar for this plugin."
 */
function XSILoadPlugin(in_reg)
{
	in_reg.Author = "Kel Solaar";
	in_reg.Name = "sIBL_GUI_For_XSI_Plugin";
	in_reg.Email = "thomas.mansencal@gmail.com";
	in_reg.URL = "http://www.thomasmansencal.com/";
	in_reg.Major = 3;
	in_reg.Minor = 1;

	in_reg.RegisterProperty("sIBL_GUI_For_XSI_Preferences");
	in_reg.RegisterCommand("sIBL_GUI_For_XSI_Preferences", "sIBL_GUI_For_XSI_Preferences");
	in_reg.RegisterMenu(siMenuTbGetLightID, "sIBL_GUI_For_XSI_Preferences_Menu", false, false);
	in_reg.RegisterMenu(siMenuTbGetLightID, "Launch_sIBL_GUI_Menu", false, false);
	in_reg.RegisterMenu(siMenuTbGetLightID, "Execute_Loader_Script_sIBL_GUI_Menu", false, false);

	initializePreferencesProperty()

	Application.LogMessage(in_reg.Name + " has been loaded.", siVerbose);

	return true;
}

/**
 * XSIUnloadPlugin.
 *
 * @param	{PluginRegistrar}	in_reg	"The PluginRegistrar for this plugin."
 */
function XSIUnloadPlugin(in_reg)
{
	Application.LogMessage(in_reg.Name + " has been unloaded.", siVerbose);

	return true;
}

// ************************************************************************************************
// ***	PPG Define / DefineLayout / Init / Closed
// ************************************************************************************************

/**
 * sIBL_GUI_For_XSI_Preferences_Define.
 *
 * @param	{Context}	in_ctxt	"Custom property."
 */
function sIBL_GUI_For_XSI_Preferences_Define(in_ctxt)
{
	var sIBL_GUI_For_XSI_Preferences_property = in_ctxt.Source;

	sIBL_GUI_For_XSI_Preferences_property.AddParameter3("Logo_siString", siString);
	sIBL_GUI_For_XSI_Preferences_property.AddParameter3("Executable_Path_siString", siString, Application.preferences.GetPreferenceValue("sIBL_GUI_For_XSI_Settings.Executable_Path_siString"));
	sIBL_GUI_For_XSI_Preferences_property.AddParameter3("Loader_Script_Path_siString", siString, Application.preferences.GetPreferenceValue("sIBL_GUI_For_XSI_Settings.Loader_Script_Path_siString"));
	return true;
}

/**
 * sIBL_GUI_For_XSI_Preferences_DefineLayout.
 *
 * @param	{Context}	in_ctxt	"Custom property."
 */
function sIBL_GUI_For_XSI_Preferences_DefineLayout(in_ctxt)
{
	var sIBL_GUI_For_XSI_Preferences_propertyLayout = in_ctxt.Source;

	sIBL_GUI_For_XSI_Preferences_propertyLayout.Clear();

	var Logo_siControlBitmap = sIBL_GUI_For_XSI_Preferences_propertyLayout.AddItem("Logo_siString", "", siControlBitmap);
	var pluginPath = getPluginPath("sIBL_GUI_For_XSI_Plugin", "sIBL_GUI_For_XSI.js");
	Logo_siControlBitmap.SetAttribute(siUIFilePath, pluginPath + "/pictures/sIBL_GUI_For_XSI_Logo.bmp");
	Logo_siControlBitmap.SetAttribute(siUINoLabel, true);

	sIBL_GUI_For_XSI_Preferences_propertyLayout.AddGroup("Settings");
	var Executable_Path_siControlFilePath = sIBL_GUI_For_XSI_Preferences_propertyLayout.AddItem("Executable_Path_siString", "sIBL_GUI Executable Path", siControlFilePath);
	Executable_Path_siControlFilePath.SetAttribute(siUIOpenFile, true);
	Executable_Path_siControlFilePath.SetAttribute(siUIFileMustExist, true);
	var Loader_Script_Path_siControlFilePath = sIBL_GUI_For_XSI_Preferences_propertyLayout.AddItem("Loader_Script_Path_siString", "Loader Script Path", siControlFilePath);
	Loader_Script_Path_siControlFilePath.SetAttribute(siUIOpenFile, true);
	Loader_Script_Path_siControlFilePath.SetAttribute(siUIFileMustExist, true);
	sIBL_GUI_For_XSI_Preferences_propertyLayout.EndGroup();

	sIBL_GUI_For_XSI_Preferences_propertyLayout.AddGroup("Online");
	sIBL_GUI_For_XSI_Preferences_propertyLayout.AddRow()
	var Get_Application_button = sIBL_GUI_For_XSI_Preferences_propertyLayout.AddButton("Get_Application_button", "@ Get sIBL_GUI ...");
	Get_Application_button.SetAttribute(siUICY, 32)
	var HDRlabs_button = sIBL_GUI_For_XSI_Preferences_propertyLayout.AddButton("HDRlabs_button", "@ HDRLabs ...");
	HDRlabs_button.SetAttribute(siUICY, 32)
	var Application_Thread_button = sIBL_GUI_For_XSI_Preferences_propertyLayout.AddButton("Application_Thread_button", "@ RD Thread ...");
	Application_Thread_button.SetAttribute(siUICY, 32)
	sIBL_GUI_For_XSI_Preferences_propertyLayout.EndRow();
	sIBL_GUI_For_XSI_Preferences_propertyLayout.EndGroup();

	return true;
}

/**
 * sIBL_GUI_For_XSI_Preferences_OnInit.
 */
function sIBL_GUI_For_XSI_Preferences_OnInit()
{
	Application.LogMessage("sIBL_GUI_For_XSI_Preferences_OnInit called", siVerbose);

	return true;
}

/**
 * sIBL_GUI_For_XSI_Preferences_OnClosed.
 */
function sIBL_GUI_For_XSI_Preferences_OnClosed()
{
	Application.LogMessage("sIBL_GUI_For_XSI_Preferences_OnClosed called", siVerbose);

	deleteRequestedProperties("sIBL_GUI_For_XSI_Preferences");
}

// ************************************************************************************************
// ***	Command Execute
// ************************************************************************************************

/**
 * sIBL_GUI_For_XSI_Preferences_Execute.
 */
function sIBL_GUI_For_XSI_Preferences_Execute()
{
	Application.LogMessage("sIBL_GUI_For_XSI_Preferences_Execute called", siVerbose);

	deleteRequestedProperties("sIBL_GUI_For_XSI_Preferences");

	var currentProperty = SIAddProp("sIBL_GUI_For_XSI_Preferences", "Scene_Root", siDefaultPropagation, null, null);

	return true;
}

// ************************************************************************************************
// ***	PPG logic
// ************************************************************************************************

/**
 * sIBL_GUI_For_XSI_Preferences_Executable_Path_siString_OnChanged.
 */
function sIBL_GUI_For_XSI_Preferences_Executable_Path_siString_OnChanged()
{
	Application.preferences.SetPreferenceValue("sIBL_GUI_For_XSI_Settings.Executable_Path_siString", PPG.Executable_Path_siString.Value);
}

/**
 * sIBL_GUI_For_XSI_Preferences_Loader_Script_Path_siString_OnChanged.
 */
function sIBL_GUI_For_XSI_Preferences_Loader_Script_Path_siString_OnChanged()
{
	Application.preferences.SetPreferenceValue("sIBL_GUI_For_XSI_Settings.Loader_Script_Path_siString", PPG.Loader_Script_Path_siString.Value);
}

/**
 * sIBL_GUI_For_XSI_Preferences_Get_Application_button_OnClicked.
 */
function sIBL_GUI_For_XSI_Preferences_Get_Application_button_OnClicked()
{
	if (XSIUtils.IsWindowsOS())
		openUrl(WINDOWS_RELEASE_URL)
	else
		if (XSIUtils.IsLinuxOS())
			openUrl(LINUX_RELEASE_URL)
}

/**
 * sIBL_GUI_For_XSI_Preferences_HDRlabs_button_OnClicked.
 */
function sIBL_GUI_For_XSI_Preferences_HDRlabs_button_OnClicked()
{
	openUrl(HDRLABS_URL)
}

/**
 * sIBL_GUI_For_XSI_Preferences_Application_Thread_button_OnClicked.
 */
function sIBL_GUI_For_XSI_Preferences_Application_Thread_button_OnClicked()
{
	openUrl(APPLICATION_THREAD_URL)
}

// ************************************************************************************************
// ***	Menu functions
// ************************************************************************************************

/**
 * sIBL_GUI_For_XSI_Preferences_Menu_Init.
 *
 * @param	{Context}	io_Context	"Provides the menu."
 */
function sIBL_GUI_For_XSI_Preferences_Menu_Init(io_Context)
{
	var menu = io_Context.Source;
	menu.AddCallbackItem("sIBL_GUI_For_XSI_Preferences", "sIBL_GUI_For_XSI_Preferences_Menu_Clicked");
}

/**
 * sIBL_GUI_For_XSI_Preferences_Menu_Clicked.
 *
 * @param	{Context}	io_Context	"Provides the menu."
 */
function sIBL_GUI_For_XSI_Preferences_Menu_Clicked(io_Context)
{
	sIBL_GUI_For_XSI_Preferences_Execute();
	InspectObj("sIBL_GUI_For_XSI_Preferences", "", "sIBL_GUI_For_XSI_Preferences");

	return 1;
}

/**
 * Launch_sIBL_GUI_Menu_Init.
 *
 * @param	{Context}	io_Context	"Provides the menu."
 */
function Launch_sIBL_GUI_Menu_Init(io_Context)
{
	var menu = io_Context.Source;
	menu.AddCallbackItem("Launch sIBL_GUI", "Launch_sIBL_GUI_Menu_Clicked");
}

/**
 * Launch_sIBL_GUI_Menu_Clicked.
 *
 * @param	{Context}	io_Context	"Provides the menu."
 */
function Launch_sIBL_GUI_Menu_Clicked(io_Context)
{
	launchApplication();

	return 1;
}

/**
 * Execute_Loader_Script_sIBL_GUI_Menu_Init.
 *
 * @param	{Context}	io_Context	"Provides the menu."
 */
function Execute_Loader_Script_sIBL_GUI_Menu_Init(io_Context)
{
	var menu = io_Context.Source;
	menu.AddCallbackItem("Execute Loader Script", "Execute_Loader_Script_sIBL_GUI_Menu_Clicked");
}

/**
 * Execute_Loader_Script_sIBL_GUI_Menu_Clicked.
 *
 * @param	{Context}	io_Context	"Provides the menu."
 */
function Execute_Loader_Script_sIBL_GUI_Menu_Clicked(io_Context)
{
	executeLoaderScript();

	return 1;
}

// ************************************************************************************************
// ***	Utilities functions
// ************************************************************************************************

/**
 * openUrl.
 *
 * @param	{String}	url "Url to open"
 */
function openUrl(url)
{
	if (XSIUtils.IsWindowsOS())
	{
		var shell = new ActiveXObject("WScript.Shell");
		shell.run(url);
	}
	else
	{
		if (XSIUtils.IsLinuxOS())
		{
			Application.system("xdg-open " +  url);
		}
	}
}

/**
 * initializePreferencesProperty.
 */
function initializePreferencesProperty()
{
	if (Application.Preferences.Categories("sIBL_GUI_For_XSI_Settings") == null)
	{
		preferencesProperty = ActiveSceneRoot.AddCustomProperty("sIBL_GUI_For_XSI_Settings", false);
		preferencesProperty.AddParameter3("Executable_Path_siString", siString, "");
		preferencesProperty.AddParameter3("Loader_Script_Path_siString", siString, "");
		InstallCustomPreferences("sIBL_GUI_For_XSI_Settings", "sIBL_GUI_For_XSI_Settings");
	}
}

/**
 * launchApplication.
 */
function launchApplication()
{
	var executablePath = Application.preferences.GetPreferenceValue("sIBL_GUI_For_XSI_Settings.Executable_Path_siString");
	fileSystemObject = new ActiveXObject("Scripting.FileSystemObject");
	if(fileSystemObject.FileExists(executablePath))
	{
		var parentFolder = fileSystemObject.GetParentFolderName(executablePath)
		if (XSIUtils.IsWindowsOS())
		{
			var regexPattern = /\s+/g;
			systemCommand = "start /D " + "\"" + parentFolder + "\" " + parentFolder.replace(regexPattern, "\" \"") + "\\sIBL_GUI.exe";
		}
		Application.system(systemCommand);
	}
	else
	{
		if(executablePath == "")
		{
			XSIUIToolkit.Msgbox("Please define an executable in 'sIBL_GUI_For_XSI_Preferences' property!", siMsgInformation, "sIBL_GUI | Information");
			deleteRequestedProperties("sIBL_GUI_For_XSI_Preferences");
			var currentProperty = SIAddProp("sIBL_GUI_For_XSI_Preferences", "Scene_Root", siDefaultPropagation, null, null);
			InspectObj(currentProperty(0));
		}
		else
		{
			XSIUIToolkit.Msgbox("sIBL_GUI path is invalid, please check 'sIBL_GUI_For_XSI_Preferences' property!", siMsgCritical, "sIBL_GUI | Error");
		}
	}
}

/**
 * executeLoaderScript.
 */
function executeLoaderScript()
{
	var loaderScriptPath = Application.preferences.GetPreferenceValue("sIBL_GUI_For_XSI_Settings.Loader_Script_Path_siString");
	fileSystemObject = new ActiveXObject("Scripting.FileSystemObject");
	if(fileSystemObject.FileExists(loaderScriptPath))
	{
		Application.ExecuteScript(loaderScriptPath, "JScript");
	}
	else
	{
		if(loaderScriptPath == "")
		{
			XSIUIToolkit.Msgbox("Please define a Loader Script path in 'sIBL_GUI_For_XSI_Preferences' property!", siMsgInformation, "sIBL_GUI | Information");
			deleteRequestedProperties("sIBL_GUI_For_XSI_Preferences");
			var currentProperty = SIAddProp("sIBL_GUI_For_XSI_Preferences", "Scene_Root", siDefaultPropagation, null, null);
			InspectObj(currentProperty(0));
		}
		else
		{
			XSIUIToolkit.Msgbox("Loader Script path is invalid, please check 'sIBL_GUI_For_XSI_Preferences' property!", siMsgCritical, "sIBL_GUI | Error");
		}
	}
}

/**
 * getPluginPath.
 *
 * @param	{String}	pluginName "Current plugin name."
 * @param	{String}	pluginFileName "Current plugin file name."
 * :return	{string}	"The plugin path"
 */
function getPluginPath(pluginName, pluginFileName)
{
	var pluginsList = Application.Plugins;

	for (var i = 0; i < pluginsList.Count; i++)
	{
		if (pluginsList(i).name == pluginName)
		{
			pluginPath = pluginsList(i).Filename.replace(pluginFileName, "");
			if (XSIUtils.IsWindowsOS())
			{
				return pluginPath;
			}
			else
			{
				if (XSIUtils.IsLinuxOS())
				{
					return pluginPath.replace(/\\/gi, "/");
				}
			}
		}

	}
}

/**
 * getRequestedPropertiesAsCollection.
 *
 * @param	{String}	propertyType "Requested property."
 * :return	{XSICollection}	"Property as XSICollection."
 */
function getRequestedPropertiesAsCollection(propertyType)
{
	var propertiesList = getByClassIdAsCollection("{76332571-D242-11d0-B69C-00AA003B3EA6}");
	logMessage(propertiesList)
	if (propertiesList.count != 0)
	{
		var propertiesListAsStringArray = getCollectionAsStringArray(propertiesList);

		var regexPattern = new RegExp(propertyType + "\\w*");

		var requestedProperties = new Array();

		for (var i = 0; i < propertiesListAsStringArray.length; i++)
		{
			var propertyFound = propertiesListAsStringArray[i].match(regexPattern);

			if (propertyFound)
			{
				requestedProperties[requestedProperties.length] = propertiesListAsStringArray[i];
			}
		}

		var requestedPropertiesAsCollection = new ActiveXObject("XSI.Collection");

		if (requestedProperties.length != 0)
		{
			requestedPropertiesAsCollection = getStringArrayAsCollection(requestedProperties);
		}

		return requestedPropertiesAsCollection;
	}
	else
	{

		return 0;
	}
}

/**
 * deleteRequestedProperties.
 *
 * @param	{String}	propertyType "Requested property."
 */
function deleteRequestedProperties(propertyType)
{
	var requestedProperties = getRequestedPropertiesAsCollection(propertyType);

	for (var i = 0; i < requestedProperties.count; i++)
	{
		DeleteObj(requestedProperties.item(i));
	}
}

/**
 * getByClassIdAsCollection.
 *
 * @param	{String}	classId "Requested class Id."
 * :return	{XSICollection}	"XSICollection."
 */
function getByClassIdAsCollection(classId)
{
	var nodesByClassIDList = new ActiveXObject("XSI.Collection");

	nodesByClassIDList = FindObjects(null, classId);

	return nodesByClassIDList;
}

/**
 * getCollectionAsStringArray.
 *
 * @param	{XSICollection}	collection "Collection"
 * :return	{StringArray}	"Collection as String array."
 */
function getCollectionAsStringArray(collection)
{
	var collectionObjectsAsString = collection.GetAsText();
	var collectionObjectsList = collectionObjectsAsString.split(",");

	return collectionObjectsList;
}

/**
 * getStringArrayAsCollection.
 *
 * @param	{StringArray}	array "String array"
 * :return	{XSICollection}	"String array as XSICollection."
 */
function getStringArrayAsCollection(array)
{
	var stringArrayAsCollection = new ActiveXObject("XSI.Collection");
	stringArrayAsCollection.SetAsText(array);

	return stringArrayAsCollection;
}
