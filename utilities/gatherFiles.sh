#/bin/bash
echo ----------------------------------------------------------------
echo sIBL_GUI For XSI - Files Gathering
echo ----------------------------------------------------------------

export PROJECT=/Users/KelSolaar/Documents/Developement/sIBL_GUI_For_XSI

export RELEASES=$PROJECT/releases
export REPOSITORY=$RELEASES/repository

#! Gathering folder cleanup.
rm -rf $REPOSITORY/*

#! Change Log gathering.
cp $RELEASES/Change_Log.html $REPOSITORY/

#! Addon gathering.
cd $PROJECT/Addons/
zip -r $REPOSITORY/sIBL_GUI_For_XSI.zip sIBL_GUI_For_XSI.xsiaddon