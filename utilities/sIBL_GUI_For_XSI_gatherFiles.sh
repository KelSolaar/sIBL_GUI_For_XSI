#/bin/bash
echo ----------------------------------------------------------------
echo sIBL_GUI For XSI - Files Gathering
echo ----------------------------------------------------------------

#! Gathering Folder Cleanup.
rm -rf ./releases/repository/*

#! Change Log Gathering.
cp ./releases/Change\ Log.html ./releases/repository/

#! Addon Gathering.
cd ./Addons/
zip -r ../releases/repository/sIBL_GUI_For_XSI.zip sIBL_GUI_For_XSI.xsiaddon