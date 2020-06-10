Unicode true

;--------------------------------
;Include

  !include "MUI2.nsh"

;--------------------------------
;Config vars

  !define NAME "ACM-new"
  !define FULL_NAME "Amplio Audio Content Manager"
  !define VERSION "1.0"

  ;Vars for control panel
  !define REGHKEY HKLM
  !define REGPATH_WINUNINST "Software\Microsoft\Windows\CurrentVersion\Uninstall"

;--------------------------------
;General

  ;Name and file
  Name "${NAME}"
  OutFile "${NAME} ${VERSION} Installer.exe"

  ;Instalation path
  InstallDir $PROFILE\LiteracyBridge\${NAME}

;--------------------------------
;Interface Settings

  ;Icons
  !define MUI_ICON "images\installer\install.ico"
  !define MUI_UNICON "images\installer\uninstall.ico"

  ;Abort warning on install/uninstall
  !define MUI_ABORTWARNING
  !define MUI_UNABORTWARNING

  ;Header
  !define MUI_HEADERIMAGE
  !define MUI_HEADERIMAGE_BITMAP "images\installer\header.bmp"

  !define MUI_WELCOMEFINISHPAGE_BITMAP "images\installer\welcome.bmp"

  !define MUI_FINISHPAGE_NOAUTOCLOSE

;--------------------------------
;Page Settings

  !define MUI_PAGE_HEADER_TEXT "${NAME} ${VERSION} Setup"

  !define MUI_WELCOMEPAGE_TITLE "Welcome to the ${NAME} ${VERSION} Setup Wizard"
  !define MUI_WELCOMEPAGE_TITLE_3LINES
  !define MUI_WELCOMEPAGE_TEXT "This wizard will guide you through the installation of ${NAME} ${VERSION} (${FULL_NAME}), the next generation of the ... \
  $\r$\n\
  $\r$\n\
  ${NAME} ${VERSION} includes a (we can add more text here to)\
  $\r$\n\
  $\r$\n\
  Click Next to continue."

  !define MUI_LICENSEPAGE_TEXT_TOP "Press Page Down to see the rert pf the agreement"
  !define MUI_LICENSEPAGE_TEXT_BOTTOM "If you accept the terms of the agreement, click I Agree to continue.\
  $\r$\n\
  $\r$\n\
  You must accept the agreement to install ${NAME}"

  !define MUI_FINISHPAGE_TITLE "Finish the install"
  !define MUI_FINISHPAGE_TITLE_3LINES
  !define MUI_FINISHPAGE_TEXT "Thanks for install ${NAME}"
  ;Checkbox for open TBL
  !define MUI_FINISHPAGE_RUN $INSTDIR\run_acm.bat
  !define MUI_FINISHPAGE_RUN_TEXT "Run Audio Content Manager"
  ;Checkboc for open amplio.org
  !define MUI_FINISHPAGE_SHOWREADME "https://amplio.org"
  !define MUI_FINISHPAGE_SHOWREADME_TEXT "Go to Amplio Suite website"

;--------------------------------
;Pages

  ;For the installer
  !insertmacro MUI_PAGE_WELCOME
  !insertmacro MUI_PAGE_LICENSE "LICENSE"
  !insertmacro MUI_PAGE_DIRECTORY
  !insertmacro MUI_PAGE_INSTFILES
  !insertmacro MUI_PAGE_FINISH

  ;For the uninstaller
  !insertmacro MUI_UNPAGE_WELCOME
  !insertmacro MUI_UNPAGE_CONFIRM
  !insertmacro MUI_UNPAGE_INSTFILES
  !insertmacro MUI_UNPAGE_FINISH

;--------------------------------
;Langs

  !insertmacro MUI_LANGUAGE "English"

;--------------------------------
;Installer Sections

Section
  SetOutPath $INSTDIR

  ;Copy some files
  File run_tb_loader.bat
  File run_acm.bat
  File acm.jar
  File /r lib
  File /r images
  File jre_setup.exe

  ;Install java
  SetDetailsPrint both
  DetailPrint "Installing Java"
  SetDetailsPrint none
  ExecWait '"$INSTDIR\jre_setup.exe" /s INSTALLDIR="$INSTDIR\jre"'
  Delete "$INSTDIR\jre_setup.exe"
  SetDetailsPrint both
  DetailPrint "Java successfully installed"

  ;Update the base path
  Push path_to_replace #text to be replaced
  Push "$INSTDIR" #replace with
  Push all
  Push all
  Push "$INSTDIR\run_acm.bat"
  Call AdvReplaceInFile

  Push path_to_replace #text to be replaced
  Push "$INSTDIR" #replace with
  Push all
  Push all
  Push "$INSTDIR\run_tb_loader.bat"
  Call AdvReplaceInFile

  ;Create shortcuts in the start menu programs
  CreateShortCut  "$SMPROGRAMS\Audio Content Manager.lnk" "$INSTDIR\run_acm.bat" "" "$INSTDIR\images\tb_loader.ico"
  CreateShortCut  "$SMPROGRAMS\Talking Book Loader.lnk" "$INSTDIR\run_tb_loader.bat" "" "$INSTDIR\images\tb_loader.ico"

  ;Create shortcuts in the desktop
  CreateShortCut  "$DESKTOP\Audio Content Manager.lnk" "$INSTDIR\run_acm.bat" "" "$INSTDIR\images\tb_loader.ico"
  CreateShortCut  "$DESKTOP\Talking Book Loader.lnk" "$INSTDIR\run_tb_loader.bat" "" "$INSTDIR\images\tb_loader.ico"

  ;Add to control panel programs list
  WriteRegStr ${REGHKEY} "${REGPATH_WINUNINST}\${FULL_NAME}" "DisplayName" "${FULL_NAME}"
  WriteRegStr ${REGHKEY} "${REGPATH_WINUNINST}\${FULL_NAME}" "DisplayIcon" "$INSTDIR\images\installer\uninstall.ico"
  WriteRegStr ${REGHKEY} "${REGPATH_WINUNINST}\${FULL_NAME}" "UninstallString" '"$INSTDIR\uninstaller.exe"'
  WriteRegStr ${REGHKEY} "${REGPATH_WINUNINST}\${FULL_NAME}" "Publisher" "Amplio"
  WriteRegStr ${REGHKEY} "${REGPATH_WINUNINST}\${FULL_NAME}" "HelpLink" "https://amplio.org"

  ;Define uninstaller name
  WriteUninstaller $INSTDIR\uninstaller.exe
SectionEnd


;--------------------------------
;Uninstaller Section

Section "Uninstall"
  ;Remove shortcuts
  Delete "$SMPROGRAMS\Audio Content Manager.lnk"
  Delete "$SMPROGRAMS\Talking Book Loader.lnk"

  Delete "$DESKTOP\Audio Content Manager.lnk"
  Delete "$DESKTOP\Talking Book Loader.lnk"

  ;Remove files
  Delete $INSTDIR\uninstaller.exe
  Delete $INSTDIR\run_tb_loader.bat
  Delete $INSTDIR\run_acm.bat
  Delete $INSTDIR\acm.jar
  RMDir /r $INSTDIR\jre ;Remove local java
  RMDir /r $INSTDIR\lib
  RMDir /r $INSTDIR\images
  RMDir /r $INSTDIR

  ;Remove from control panel programs list
  DeleteRegKey HKLM "${REGPATH_WINUNINST}\${FULL_NAME}"
SectionEnd


;--------------------------------
;Script take from https://nsis.sourceforge.io/More_advanced_replace_text_in_file
Function AdvReplaceInFile
  Exch $0 ;file to replace in
  Exch
  Exch $1 ;number to replace after
  Exch
  Exch 2
  Exch $2 ;replace and onwards
  Exch 2
  Exch 3
  Exch $3 ;replace with
  Exch 3
  Exch 4
  Exch $4 ;to replace
  Exch 4
  Push $5 ;minus count
  Push $6 ;universal
  Push $7 ;end string
  Push $8 ;left string
  Push $9 ;right string
  Push $R0 ;file1
  Push $R1 ;file2
  Push $R2 ;read
  Push $R3 ;universal
  Push $R4 ;count (onwards)
  Push $R5 ;count (after)
  Push $R6 ;temp file name

  GetTempFileName $R6
  FileOpen $R1 $0 r ;file to search in
  FileOpen $R0 $R6 w ;temp file
  StrLen $R3 $4
  StrCpy $R4 -1
  StrCpy $R5 -1

  loop_read:
  ClearErrors
  FileRead $R1 $R2 ;read line
  IfErrors exit

    StrCpy $5 0
    StrCpy $7 $R2

  loop_filter:
    IntOp $5 $5 - 1
    StrCpy $6 $7 $R3 $5 ;search
    StrCmp $6 "" file_write1
    StrCmp $6 $4 0 loop_filter

  StrCpy $8 $7 $5 ;left part
  IntOp $6 $5 + $R3
  IntCmp $6 0 is0 not0
  is0:
  StrCpy $9 ""
  Goto done
  not0:
  StrCpy $9 $7 "" $6 ;right part
  done:
  StrCpy $7 $8$3$9 ;re-join

  IntOp $R4 $R4 + 1
  StrCmp $2 all loop_filter
  StrCmp $R4 $2 0 file_write2
  IntOp $R4 $R4 - 1

  IntOp $R5 $R5 + 1
  StrCmp $1 all loop_filter
  StrCmp $R5 $1 0 file_write1
  IntOp $R5 $R5 - 1
  Goto file_write2

  file_write1:
  FileWrite $R0 $7 ;write modified line
  Goto loop_read

  file_write2:
  FileWrite $R0 $R2 ;write unmodified line
  Goto loop_read

  exit:
    FileClose $R0
    FileClose $R1

    SetDetailsPrint none
    Delete $0
    Rename $R6 $0
    Delete $R6
    SetDetailsPrint lastused

  Pop $R6
  Pop $R5
  Pop $R4
  Pop $R3
  Pop $R2
  Pop $R1
  Pop $R0
  Pop $9
  Pop $8
  Pop $7
  Pop $6
  Pop $5
  ;These values are stored in the stack in the reverse order they were pushed
  Pop $0
  Pop $1
  Pop $2
  Pop $3
  Pop $4
FunctionEnd
