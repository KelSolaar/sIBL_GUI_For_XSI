/**
 * @projectDescription	sIBL_GUI_For_XSI - Loader For sIBL Files.
 *
 * MODIFY THIS AT YOUR OWN RISK
 *
 * @author 	Thomas Mansencal	thomas.mansencal@gmail.com
 * @version	3.0.0
 * @os		Windows
 * @tasklist 	Code Comment.
 */
// ************************************************************************************************
// ***	XSI JScript START
// ************************************************************************************************

// ************************************************************************************************
// ***	Global Variables
// ************************************************************************************************
HDRLABS_URL = "http://www.hdrlabs.com"
WINDOWS_RELEASE_URL = "http://kelsolaar.hdrlabs.com/?dir=./sIBL_GUI/Repository/Builds/Windows"
LINUX_RELEASE_URL = "http://kelsolaar.hdrlabs.com/?dir=./sIBL_GUI/Repository/Builds/Linux"
APPLICATION_THREAD_URL = "http://www.hdrlabs.com/cgi-bin/forum/YaBB.pl?num=1271609371"
LOADER_SCRIPT = "sIBL_XSI_Import.js"
LOADER_SCRIPT_PATH = "HDRLabs/sIBL_GUI/io/loaderScripts/"
// ************************************************************************************************
// ***	Plugin Loading/Unloading
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
	in_reg.URL = "http://www.thomasmansencal.com/blog/";
	in_reg.Major = 3.00;
	in_reg.Minor = 0;

	in_reg.RegisterProperty("sIBL_GUI_For_XSI_Preferences");
	in_reg.RegisterCommand("sIBL_GUI_For_XSI_Preferences", "sIBL_GUI_For_XSI_Preferences");
	in_reg.RegisterMenu(siMenuTbGetLightID, "sIBL_GUI_For_XSI_Preferences_Menu", false, false);
	in_reg.RegisterMenu(siMenuTbGetLightID, "Launch_sIBL_GUI_Menu", false, false);
	in_reg.RegisterMenu(siMenuTbGetLightID, "Execute_Loader_Script_sIBL_GUI_Menu", false, false);

	sIBL_initializePreferencesProperty()

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
// ***	PPG Define/DefineLayout/Init/Closed
// ************************************************************************************************

/**
 * sIBL_GUI_For_XSI_Preferences_Define.
 *
 * @param	{Context}	in_ctxt	"Returns The CustomProperty."
 */
function sIBL_GUI_For_XSI_Preferences_Define(in_ctxt)
{
	var sIBL_GUI_For_XSI_PreferencesProperty = in_ctxt.Source;

	sIBL_GUI_For_XSI_PreferencesProperty.AddParameter3("sIBL_GUI_For_XSI_Logo", siString);
	sIBL_GUI_For_XSI_PreferencesProperty.AddParameter3("sIBL_GUI_Path", siString, Application.preferences.GetPreferenceValue("sIBL_GUI_Preferences.sIBL_GUI_Path"));
	return true;
}

/**
 * sIBL_GUI_For_XSI_Preferences_DefineLayout.
 *
 * @param	{Context}	in_ctxt	"Returns The CustomProperty."
 */
function sIBL_GUI_For_XSI_Preferences_DefineLayout(in_ctxt)
{
	var sIBL_GUI_For_XSI_PreferencesLayout = in_ctxt.Source;

	sIBL_GUI_For_XSI_PreferencesLayout.Clear();

	var sIBL_GUI_For_XSI_Logo = sIBL_GUI_For_XSI_PreferencesLayout.AddItem("sIBL_GUI_For_XSI_Logo", "", siControlBitmap);
	var pluginPath = sIBL_getPluginPath("sIBL_GUI_For_XSI_Plugin", "sIBL_GUI_For_XSI.js");
	sIBL_GUI_For_XSI_Logo.SetAttribute(siUIFilePath, pluginPath + "/Pictures/sIBL_GUI_For_XSI_Logo.bmp");
	sIBL_GUI_For_XSI_Logo.SetAttribute(siUINoLabel, true);
	sIBL_GUI_For_XSI_PreferencesLayout.AddSpacer();

	sIBL_GUI_For_XSI_PreferencesLayout.AddGroup("Settings");
	var sIBL_GUI_Path = sIBL_GUI_For_XSI_PreferencesLayout.AddItem("sIBL_GUI_Path", "sIBL_GUI Path", siControlFilePath);
	sIBL_GUI_Path.SetAttribute(siUIOpenFile, true);
	sIBL_GUI_Path.SetAttribute(siUIFileMustExist, true);
	sIBL_GUI_For_XSI_PreferencesLayout.EndGroup();
	sIBL_GUI_For_XSI_PreferencesLayout.AddSpacer();

	sIBL_GUI_For_XSI_PreferencesLayout.AddGroup("Online");
	sIBL_GUI_For_XSI_PreferencesLayout.AddRow()
	var getApplication_button = sIBL_GUI_For_XSI_PreferencesLayout.AddButton("getApplicationButton", "Get sIBL_GUI");
	getApplication_button.SetAttribute(siUICY, 32)
	var hdrlabs_button = sIBL_GUI_For_XSI_PreferencesLayout.AddButton("hdrlabsButton", "Visit HDRLabs");
	hdrlabs_button.SetAttribute(siUICY, 32)
	var sIBL_GUI_Thread_button = sIBL_GUI_For_XSI_PreferencesLayout.AddButton("applicationThreadButton", "Visit sIBL_GUI Thread");
	sIBL_GUI_Thread_button.SetAttribute(siUICY, 32)
	sIBL_GUI_For_XSI_PreferencesLayout.EndRow();
	sIBL_GUI_For_XSI_PreferencesLayout.EndGroup();

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

	sIBL_deleteRequestedProperties("sIBL_GUI_For_XSI_Preferences");
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

	sIBL_deleteRequestedProperties("sIBL_GUI_For_XSI_Preferences");

	var currentProperty = SIAddProp("sIBL_GUI_For_XSI_Preferences", "Scene_Root", siDefaultPropagation, null, null);

	return true;
}

// ************************************************************************************************
// ***	PPG Logic
// ************************************************************************************************

/**
 * sIBL_GUI_For_XSI_Preferences_sIBL_GUI_Path_OnChanged.
 */
function sIBL_GUI_For_XSI_Preferences_sIBL_GUI_Path_OnChanged()
{
	Application.preferences.SetPreferenceValue("sIBL_GUI_Preferences.sIBL_GUI_Path", PPG.sIBL_GUI_Path.Value);
}

/**
 * sIBL_GUI_For_XSI_Preferences_getApplicationButton_OnClicked.
 */
function sIBL_GUI_For_XSI_Preferences_getApplicationButton_OnClicked()
{
	if (XSIUtils.IsWindowsOS())
	{
		sIBL_openUrl(WINDOWS_RELEASE_URL)
	}
	else
	{
		if (XSIUtils.IsLinuxOS())
		{
			sIBL_openUrl(LINUX_RELEASE_URL)
		}
	}
}


/**
 * sIBL_GUI_For_XSI_Preferences_hdrlabsButton_OnClicked.
 */
function sIBL_GUI_For_XSI_Preferences_hdrlabsButton_OnClicked()
{
	sIBL_openUrl(HDRLABS_URL)
}

/**
 * sIBL_GUI_For_XSI_Preferences_applicationThreadButton_OnClicked.
 */
function sIBL_GUI_For_XSI_Preferences_applicationThreadButton_OnClicked()
{
	sIBL_openUrl(APPLICATION_THREAD_URL)
}

// ************************************************************************************************
// ***	Menu Functions
// ************************************************************************************************

/**
 * sIBL_GUI_For_XSI_Preferences_Menu_Init.
 *
 * @param	{Context}	io_Context	"Returns The Menu."
 */
function sIBL_GUI_For_XSI_Preferences_Menu_Init(io_Context)
{
	var menu = io_Context.Source;
	menu.AddCallbackItem("sIBL_GUI_For_XSI_Preferences", "sIBL_GUI_For_XSI_Preferences_Menu_Clicked");
}

/**
 * sIBL_GUI_For_XSI_Preferences_Menu_Clicked.
 *
 * @param	{Context}	io_Context	"Returns The Menu."
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
 * @param	{Context}	io_Context	"Returns The Menu."
 */
function Launch_sIBL_GUI_Menu_Init(io_Context)
{
	var menu = io_Context.Source;
	menu.AddCallbackItem("Launch sIBL_GUI", "Launch_sIBL_GUI_Menu_Clicked");
}

/**
 * Launch_sIBL_GUI_Menu_Clicked.
 *
 * @param	{Context}	io_Context	"Returns The Menu."
 */
function Launch_sIBL_GUI_Menu_Clicked(io_Context)
{
	sIBL_launchApplication();

	return 1;
}

/**
 * Execute_Loader_Script_sIBL_GUI_Menu_Init.
 *
 * @param	{Context}	io_Context	"Returns The Menu."
 */
function Execute_Loader_Script_sIBL_GUI_Menu_Init(io_Context)
{
	var menu = io_Context.Source;
	menu.AddCallbackItem("Execute Loader Script", "Execute_Loader_Script_sIBL_GUI_Menu_Clicked");
}

/**
 * Execute_Loader_Script_sIBL_GUI_Menu_Clicked.
 *
 * @param	{Context}	io_Context	"Returns The Menu."
 */
function Execute_Loader_Script_sIBL_GUI_Menu_Clicked(io_Context)
{
	sIBL_executeLoaderScript();

	return 1;
}

// ************************************************************************************************
// ***	Utilities Functions
// ************************************************************************************************

/**
 * sIBL_openUrl.
 *
 * @param	{String}	url "Url To Open"
 */
function sIBL_openUrl(url)
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
 * sIBL_initializePreferencesProperty.
 */
function sIBL_initializePreferencesProperty()
{
	if (Application.Preferences.Categories("sIBL_GUI_Preferences") == null)
	{
		preferencesProperty = ActiveSceneRoot.AddCustomProperty("sIBL_GUI_Preferences", false);
		preferencesProperty.AddParameter3("sIBL_GUI_Path", siString, "");
		InstallCustomPreferences("sIBL_GUI_Preferences", "sIBL_GUI_Preferences");
	}
}

/**
 * sIBL_launchApplication.
 */
function sIBL_launchApplication()
{
	fileSystemObject = new ActiveXObject("Scripting.FileSystemObject");
	var sIBL_GUI_Path = Application.preferences.GetPreferenceValue("sIBL_GUI_Preferences.sIBL_GUI_Path");
	if (fileSystemObject.FileExists(sIBL_GUI_Path))
	{
		var parentFolder = fileSystemObject.GetParentFolderName(sIBL_GUI_Path)
		if (XSIUtils.IsWindowsOS())
		{
			var regexPattern = /\s+/g;
			systemCommand = "start /D " + "\"" + parentFolder + "\" " + parentFolder.replace(regexPattern, "\" \"") + "\\sIBL_GUI.exe";
		}
		else
		{
			if (XSIUtils.IsLinuxOS())
			{
				systemCommand = parentFolder + "./sIBL_GUI_Launcher &";
			}
		}
		Application.system(systemCommand);
	}
	else
	{
		if(sIBL_GUI_Path == "")
		{
			XSIUIToolkit.Msgbox("Please Define An Executable In sIBL_GUI_For_XSI_Preferences!", siMsgInformation, "sIBL_GUI | Information");
			sIBL_deleteRequestedProperties("sIBL_GUI_For_XSI_Preferences");
			var currentProperty = SIAddProp("sIBL_GUI_For_XSI_Preferences", "Scene_Root", siDefaultPropagation, null, null);
			InspectObj(currentProperty(0));
		}
		else
		{
			XSIUIToolkit.Msgbox("sIBL_GUI Path Is Invalid, Please Check sIBL_GUI Preferences!", siMsgCritical, "sIBL_GUI | Error");
		}

	}
}

/**
 * sIBL_executeLoaderScript.
 */
function sIBL_executeLoaderScript()
{
	if (XSIUtils.IsWindowsOS())
	{
		applicationDataVariablePath = XSIUtils.Environment.Item("APPDATA");
		Application.ExecuteScript(applicationDataVariablePath + "/" + LOADER_SCRIPT_PATH + LOADER_SCRIPT, "JScript");
	}
	else
	{
		if (XSIUtils.IsLinuxOS())
		{
			homeVariablePath = XSIUtils.Environment.Item("HOME");
			Application.ExecuteScript(homeVariablePath + "/." + LOADER_SCRIPT_PATH + LOADER_SCRIPT, "JScript");
		}
	}
}

/**
 * sIBL_getPluginPath.
 *
 * @param	{String}	pluginName "Current Plugin Name"
 * @param	{String}	pluginFileName "Current Plugin File Name"
 * @return	{string}	Return A String
 */
function sIBL_getPluginPath(pluginName, pluginFileName)
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
 * sIBL_getRequestedPropertiesAsCollection.
 *
 * @param	{String}	propertyType "Requested Property."
 * @return	{XSICollection}	"Return A XSICollection."
 */
function sIBL_getRequestedPropertiesAsCollection(propertyType)
{
	var propertiesList = sIBL_getByClassIDAsCollection("{76332571-D242-11d0-B69C-00AA003B3EA6}");
	logMessage(propertiesList)
	if (propertiesList.count != 0)
	{
		var propertiesListAsStringArray = sIBL_getCollectionAsStringArray(propertiesList);

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
			requestedPropertiesAsCollection = sIBL_getStringArrayAsCollection(requestedProperties);
		}

		return requestedPropertiesAsCollection;
	}
	else
	{

		return 0;
	}
}

/**
 * sIBL_deleteRequestedProperties.
 *
 * @param	{String}	propertyType "Requested Property."
 */
function sIBL_deleteRequestedProperties(propertyType)
{
	var requestedProperties = sIBL_getRequestedPropertiesAsCollection(propertyType);

	for (var i = 0; i < requestedProperties.count; i++)
	{
		DeleteObj(requestedProperties.item(i));
	}
}

/**
 * sIBL_getByClassIDAsCollection.
 *
 * @param	{String}	currentClassID "Requested Class ID."
 * @return	{XSICollection}	"Return A XSICollection."
 */
function sIBL_getByClassIDAsCollection(currentClassID)
{
	var nodesByClassIDList = new ActiveXObject("XSI.Collection");

	nodesByClassIDList = FindObjects(null, currentClassID);

	return nodesByClassIDList;
}

/**
 * sIBL_getCollectionAsStringArray.
 *
 * @param	{XSICollection}	currentCollection "Collection To Return As A String Array."
 * @return	{StringArray}	"Return A StringArray."
 */
function sIBL_getCollectionAsStringArray(currentCollection)
{
	var collectionObjectsAsString = currentCollection.GetAsText();
	var collectionObjectsList = collectionObjectsAsString.split(",");

	return collectionObjectsList;
}

/**
 * sIBL_getStringArrayAsCollection.
 *
 * @param	{StringArray}	currentStringArray "String Array To Return As A Collection."
 * @return	{XSICollection}	"Return A XSICollection."
 */
function sIBL_getStringArrayAsCollection(currentStringArray)
{
	var stringArrayAsCollection = new ActiveXObject("XSI.Collection");
	stringArrayAsCollection.SetAsText(currentStringArray);

	return stringArrayAsCollection;
}
