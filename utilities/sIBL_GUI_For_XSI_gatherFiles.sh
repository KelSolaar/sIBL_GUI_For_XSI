#/bin/bash
echo ----------------------------------------------------------------
echo sIBL_GUI For XSI - Files Gathering
echo ----------------------------------------------------------------

#! Gathering folder cleanup.
rm -rf ./releases/repository/*

#! Change log gathering.
cp ./releases/Change\ Log.html ./releases/repository/

#! Addon gathering.
cd ./Addons/
zip -r ../releases/repository/sIBL_GUI_For_XSI.zip sIBL_GUI_For_XSI.xsiaddon