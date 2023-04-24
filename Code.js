/***
  
  rev. 2023-04-23
  
  +---------------------------------+  
  | GAS Gmail Trash by Expiry Label |
  +---------------------------------+  
   
  Google Apps Script that TRASHes Gmail messages based on a User Label 
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
*/  

const testMode = 1;       // nothing  moved to TRASH if enabled (1) 
const useTestLabel = 0;   // [optional] test with testLabel instead of User Labels
const testLabel = 'del.in24.0.hrfdsf';  // used if testMode AND useTestLabel enabled

function trashByExpiryLabel(){

  const toSec = 86400; // 24hr/1d 🠚 sec
  const toHrs = 3600;  // 24hr/1d 🠚 sec
  const unit = { d: 1, h: 1/24, m: 30, y: 365 };
  const regxDate = /(.*?:\d{2}).*(\sGMT-\d{4})/;
  const regxDel = new RegExp([
    '^(?:del(ete)?|tra(sh)?)[\\W_]?(?:in|after)?[\\W_]?',
    '(?<delay>\\d+(?:\\.\\d+)?)[\\W_]?(?<format>h|m|d|y)'
    ].join(''), "i");

  var _labels = [];
  const date = Math.floor(Date.now() / 1000);
  const grpDate = Date(date*1000).match(regxDate);
  const prettyDate = grpDate[1]+grpDate[2];
  const _tz = grpDate[2];
  
  Logger.log('Now: ' + prettyDate);
  
  if (testMode == 1 && useTestLabel == 1) {

    Logger.log('+'.padEnd(37, '-') + '+' +  '\n' +
                  '| Use Test Label Enabled (Test Mode) |' + '\n' + 
                  '+'.padEnd(37, '-') + '+' + '\n' +
                  'Test Label: \'' +  testLabel + '\'' );
    
    _labels = Gmail.Users.Labels.list('me').labels.filter(
      thisLabel => thisLabel.name == testLabel ); 

  } else {

    _labels = Gmail.Users.Labels.list('me').labels.filter(
    thisLabel => thisLabel.name.match(regxDel)); 

  }
 
  Logger.log(_labels.length + ' User Labels Found Matching RegEx' + '\n' +
              '-'.padStart(36, '-') + '\n' + _labels);

  var idsList = [ ];

  for (let i = 0; i < _labels.length; i++) {

    let name = _labels[i].name;  
    let grp = name.match(regxDel).groups;
    let delay = unit[grp.format] * toSec * grp.delay;
    let minAge = date - delay; 
    let prettyMinAge = (new Date((minAge)*1000)).toString().match(regxDate)[1] + _tz;
    let query = 'label:' + name + ' before:' + minAge;

    Logger.log('Label #:      ' + (i+1).toString() + ' of ' + _labels.length + '\n' + 
               'Label Name:   \'' + name + '\'\n' +
               'Date Offset:  ' + calcDec(delay / toSec, 2) + 
               ' days (' + calcDec(delay / toHrs, 2) + ' hrs)'+ '\n' +
               'Dated Before: ' + prettyMinAge +  '\n' +
               'Current Date: ' + prettyDate + '\n\n' +
               'Gmail Query:  ' + '\'' +  query + '\'');

    let msgQuery = Gmail.Users.Messages.list("me", { 'maxResults': 500, 'q': query});  
    let token = msgQuery.nextPageToken; // future functionality (nothing done with this yet)
    let msgList = msgQuery.messages;
 
    if (msgList) {
      
      msgList.forEach(thisMsg => idsList.push(thisMsg.id));

      Logger.log(((testMode == 1) ? '+'.padEnd(46, '-') + '+' +  '\n' +
                  '| Test Mode Enabled:  Nothing will be Deleted |' + '\n' + 
                  '+'.padEnd(46, '-') + '+' + '\n' : '') +
                  idsList.length + ' Message ID' + 
                  ((idsList.length > 1) ? 's' : '') + ' to be Deleted: ' + '\n' + idsList);
    
      if (testMode != 1) {

        Gmail.Users.Messages.batchModify({ 'ids': idsList,'addLabelIds': [ 'TRASH' ]}, 'me');    

      } 
    
    } else {

      Logger.log('No messages returned by query');
    
    }

  }

  function calcDec(num, max=17, min = 0) {
    return num.toFixed(decimals(num, max, min));
  }

  function decimals(num, max, min ) { 
    if ((num % 1) != 0) {
      let count = num.toString().split(".")[1].length;
      if (count > max) return max;
      if (count < min) return min;
      return count;
    }
    return min;
  }

}
