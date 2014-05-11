#/bin/bash
echo ----------------------------------------------------------------
echo sIBL_GUI For XSI - Files Gathering
echo ----------------------------------------------------------------

export PROJECT_DIRECTORY=$(cd $( dirname "${BASH_SOURCE[0]}" )/..; pwd)

export RELEASES_DIRECTORY=$PROJECT_DIRECTORY/releases
export REPOSITORY_DIRECTORY=$RELEASES_DIRECTORY/repository

#! Gathering folder cleanup.
rm -rf $REPOSITORY_DIRECTORY/*

#! Change Log gathering.
cp $RELEASES_DIRECTORY/Change_Log.html $REPOSITORY_DIRECTORY/

#! Addon gathering.
cd $PROJECT/Addons/
zip -r $REPOSITORY_DIRECTORY/sIBL_GUI_For_XSI.zip sIBL_GUI_For_XSI.xsiaddon