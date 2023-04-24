# GAS-Gmail-Trash-by-Expiry-Label
/**
 Google Apps Script that moves Gmail messages to TRASH based on a User Label 
 containing a time offset which is then compared to the message's actual age.
 Labels can be manually applied or applied using a Gmail Filter.  The script uses 
 regex to detect existing and new labels and multiple offset labels can hapily coexist.
   
  +------------- +
  | Label Syntax |
  +--------------+
   🠖  Note: This tool is not case sensitive. 

  <Label> = <prefix>[<sepparator01>]<delay>[<sepparator01>]<unit>
                     
  <prefix>:   'delete', 'del', 'trash', 'tra'  // 
      
  <delay>: '#' or '0.#'        🠖  positive rational numbers; no thousands separator;
                                  can include decimal include leading 0 if <1 ;
                                  Examples: '1', '100', '0.258', '125.14563'
                                        
  <unit>:  'h*'   🠖   hours   🠖  Examples: 'h' or 'hrs' or 'hour' or 'habcdefg'
           'd*'   🠖   days
           'm*'   🠖   months
           'y*'   🠖   years   
  
  [<sepparator01>]:  Optional, but must be one of: 
                  🠖 A single underscore, or non-word character (\W)  
                  🠖 The word 'in' or 'after' optionally preceded and/or
                    followed by a single underscore, or non-word character
                        
                  Examples: '.', '_', 'in', '.in', '_in.', 'in_' 

   [<sepparator02>]:  Optional, a single underscore, or non-word character (\W)  

  +---------------------+
  | Test Mode Variables |
  +---------------------+
   🠖  1=enabled,  0=disabled (actually anything but 1) 
   🠖  If testMode enabled, nothing actually gets moved to TRASH
   🠖  Enabling useTestLabel is optional, and always ignored if
      if testMode is disabled
   🠖  Enabling useTestLabel searches Gmail for the testLabel only,
      instead of filtering all User Labels based on the Label Syntax
      (see "Label Syntax" above")
   🠖  Variable testLabel is ignored if useTestLabel is disabled & always
      if testMode is disabled

## Installation  
   
A.  Create a Google Apps Script (GAS) Project  
B.  Paste the Code.gs file contents into your GAS Project's Code.gs file.  
C.  Add the dependency Advanced Gmail API Service to your GAS Project.  
D.  Authorize project to access your Gmail.  
E.  Create Trigger
  
### A. Create Google Apps Script Project
1. Sign in to your Google Account in Chrome web browser.
2. Navigate to script.google.com  *If this is the first time you've been to script.google.com, click View Dashboard.*
3. At the top left, click 'New project'.
4. Name the project by clicking on 'Untitled project'. 

### B. Paste the Code
5. Delete any pre-populated code from the script editor (e.g. function myFunction(), etc.)
6. Using a text editor copy the contents the Code.gs file in this Git and paste it into the script editor.
7. Click the Save button.

### C. Add dependency
8. Click on the plus (+) symbol on 'Services  +' to open the 'Add a service' dialog.
9. Type 'Gmail' in the 'Identifier' field.
10. Click 'Add'

### D. Authorize Project
11. Open Code.gs in the script editor
12. Make sure 'addParentLabel' is the function selected to the right of 'Run' and 'Debug'
13. Click on the 'Run' button beside 'Debug' at the top of the page.
14. Click on 'Review permissions' in the 'Authorization required' dialog that appears.
15. Choose the Google account you'd like to allow the script to access.
16. You will see a warning that 'Google hasn’t verified this app' because... Google Hasn't Verified this App :-)
17. Click on the 'Advanced' link
18. Click on the 'Go to [custom script name here] (unsafe)' link.
19. Read the warning about the fact that this script wants to access your Gmail account.    
20. Click 'Allow' if you'd like to allow this script access.

**Please Note**:

     If you completed steps 11 - 20, but took too long, that script instance will have timed
     out with a permission-related error.  Don't worry, future instances will succeed.  Simply
     manually run the script again to confirm by repeating steps 12 - 14.  You should no longer
     be prompted for authorization.

### E. Create Trigger
21. Click on the 'Trigger' menu button (alarm clock image) in the left menu.
22. Click the '+  Add Trigger' button at the bottom right of the Triggers page.
23. Configure Trigger:  

**Trigger Settings**:  

     Choose which function to run:       trashByExpiryLabel  
     Choose which deployment should run: Head  
     Select event source:                Time-driven  

**Set the following to your preference.  Here are my settings**:  
    
     Select type of time based trigger:  Minutes timer  
     Select minute interval:             Every 5 minutes   
     Failure notification settings:      Notify me immediately   


## Feedback
Constructive feedback is welcomed and, of course, please advise of any issues/bugs encountered.  


*/
